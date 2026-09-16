import pandas as pd
import numpy as np
import pmdarima as pm
from pmdarima import auto_arima
from statsmodels.stats.diagnostic import acorr_ljungbox
import os
import json

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'processed')
RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

def naive_forecast(train, h=28):
    """Naive forecast: forecast = last observed value."""
    last_val = train.iloc[-1]
    return np.repeat(last_val, h)

def seasonal_naive_forecast(train, h=28, s=7):
    """Seasonal naive forecast: forecast = value from same day last week."""
    # We repeat the last 's' observations to form the forecast
    last_season = train.iloc[-s:].values
    repeats = int(np.ceil(h / s))
    forecast = np.tile(last_season, repeats)[:h]
    return forecast

def fit_sarima(train, s=7):
    """Fits SARIMA model using auto_arima."""
    print("Fitting SARIMA model (this may take a while)...")
    model = auto_arima(train, seasonal=True, m=s, 
                       stepwise=True, trace=True,
                       error_action='ignore', suppress_warnings=True)
    print(model.summary())
    return model

def run_classical_models(train_series, h=28):
    print("Running Classical Baselines...")
    
    # 1. Naive
    naive_preds = naive_forecast(train_series, h)
    
    # 2. Seasonal Naive
    snaive_preds = seasonal_naive_forecast(train_series, h, s=7)
    
    # 3. SARIMA
    sarima_model = fit_sarima(train_series, s=7)
    
    # Get 28-day ahead forecasts with 80% and 95% prediction intervals
    # pmdarima predict returns point forecasts and optionally conf intervals
    sarima_preds, conf_int_95 = sarima_model.predict(n_periods=h, return_conf_int=True, alpha=0.05)
    _, conf_int_80 = sarima_model.predict(n_periods=h, return_conf_int=True, alpha=0.20)
    
    # Diagnostics on residuals
    residuals = sarima_model.resid()
    lb_test = acorr_ljungbox(residuals, lags=[10], return_df=True)
    print("\nLjung-Box test on SARIMA residuals:")
    print(lb_test)
    
    return {
        "naive": naive_preds.tolist(),
        "snaive": snaive_preds.tolist(),
        "sarima": {
            "point": sarima_preds.tolist(),
            "lower_95": conf_int_95[:, 0].tolist(),
            "upper_95": conf_int_95[:, 1].tolist(),
            "lower_80": conf_int_80[:, 0].tolist(),
            "upper_80": conf_int_80[:, 1].tolist()
        }
    }

if __name__ == "__main__":
    # Simple test run on aggregate data
    parquet_path = os.path.join(PROCESSED_DIR, 'features.parquet')
    if os.path.exists(parquet_path):
        df = pd.read_parquet(parquet_path)
        agg_sales = df.groupby('date')['units_sold'].sum()
        
        # M5 Walk-forward logic:
        # Train up to d_1913, eval d_1914 to d_1941
        # For this test, we'll use the last 28 days as test, rest as train
        train = agg_sales.iloc[:-28]
        test = agg_sales.iloc[-28:]
        
        results = run_classical_models(train, h=28)
        
        with open(os.path.join(RESULTS_DIR, 'classical_forecasts_agg.json'), 'w') as f:
            json.dump(results, f)
        print("Classical forecasts saved.")
    else:
        print("Run data_processing.py first.")
