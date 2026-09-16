import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller, kpss
from arch.unitroot import PhillipsPerron
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.seasonal import STL
from statsmodels.stats.diagnostic import acorr_ljungbox
import warnings
warnings.filterwarnings("ignore")

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'processed')
ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'public', 'assets')

os.makedirs(ASSETS_DIR, exist_ok=True)

def load_data():
    parquet_path = os.path.join(PROCESSED_DIR, 'features.parquet')
    if not os.path.exists(parquet_path):
        print("Features not found. Please run data_processing.py first.")
        return None
    
    df = pd.read_parquet(parquet_path)
    return df

def run_stationarity_tests(series, name):
    print(f"\n--- Stationarity Tests for {name} ---")
    # ADF Test
    adf_result = adfuller(series.dropna())
    print(f"ADF Statistic: {adf_result[0]:.4f}")
    print(f"p-value: {adf_result[1]:.4f}")
    
    # KPSS Test
    kpss_result = kpss(series.dropna(), regression='c', nlags="auto")
    print(f"KPSS Statistic: {kpss_result[0]:.4f}")
    print(f"p-value: {kpss_result[1]:.4f}")
    
    # PP Test
    pp = PhillipsPerron(series.dropna())
    print(f"Phillips-Perron:\n{pp.summary().as_text()}")

def plot_seasonality_and_autocorrelation(series, name):
    print(f"\n--- Autocorrelation and Seasonality for {name} ---")
    fig, ax = plt.subplots(1, 2, figsize=(16, 5))
    plot_acf(series.dropna(), lags=60, ax=ax[0], title=f"ACF - {name}")
    plot_pacf(series.dropna(), lags=60, ax=ax[1], title=f"PACF - {name}")
    plt.tight_layout()
    fig.savefig(os.path.join(ASSETS_DIR, f'acf_pacf_{name}.png'))
    plt.close()
    
    # STL Decomposition
    # Assuming daily data, period=7 for weekly seasonality
    stl = STL(series.dropna(), period=7, robust=True)
    res = stl.fit()
    fig = res.plot()
    fig.set_size_inches(10, 8)
    fig.savefig(os.path.join(ASSETS_DIR, f'stl_decomp_{name}.png'))
    plt.close()

def run_diagnostics():
    df = load_data()
    if df is None: return
    
    # Aggregate sales for CA_1 store to run overall tests
    agg_sales = df.groupby('date')['units_sold'].sum()
    
    # 1. Stationarity Testing
    run_stationarity_tests(agg_sales, "Store_CA1_Aggregate")
    
    # Try with first difference of log
    agg_sales_log_diff = np.log1p(agg_sales).diff().dropna()
    run_stationarity_tests(agg_sales_log_diff, "Store_CA1_Log_Diff")
    
    # 2. Seasonality and Autocorrelation
    plot_seasonality_and_autocorrelation(agg_sales, "Store_CA1_Aggregate")
    
    # 3. Distributional Analysis
    plt.figure(figsize=(10, 6))
    plt.hist(agg_sales, bins=50, alpha=0.7)
    plt.title('Distribution of Aggregate Daily Sales (CA_1)')
    plt.xlabel('Units Sold')
    plt.ylabel('Frequency')
    plt.savefig(os.path.join(ASSETS_DIR, 'sales_distribution.png'))
    plt.close()
    
    # Check for zero-inflation/intermittency at SKU level
    intermittency = df.groupby('item_id')['units_sold'].apply(lambda x: (x == 0).mean())
    high_intermittency_skus = intermittency[intermittency > 0.3]
    print(f"\nFound {len(high_intermittency_skus)} SKUs with >30% zero sales.")
    print("These SKUs may be better suited for Croston's method instead of SARIMA.")
    
if __name__ == "__main__":
    run_diagnostics()
