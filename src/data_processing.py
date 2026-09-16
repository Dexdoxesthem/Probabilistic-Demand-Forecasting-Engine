import pandas as pd
import duckdb
import numpy as np
import os
import warnings
warnings.filterwarnings("ignore")

# Define paths
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
RAW_DIR = os.path.join(DATA_DIR, 'raw')
PROCESSED_DIR = os.path.join(DATA_DIR, 'processed')
DB_PATH = os.path.join(PROCESSED_DIR, 'm5_forecasting.db')

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

def initialize_database():
    """Initializes DuckDB schema and loads raw data."""
    print("Initializing DuckDB and loading raw data...")
    conn = duckdb.connect(DB_PATH)
    
    # Check if data exists
    sales_path = os.path.join(RAW_DIR, 'sales_train_validation.csv')
    calendar_path = os.path.join(RAW_DIR, 'calendar.csv')
    prices_path = os.path.join(RAW_DIR, 'sell_prices.csv')
    
    if not all(os.path.exists(p) for p in [sales_path, calendar_path, prices_path]):
        print("ERROR: Raw CSV files not found in data/raw/. Please download from Kaggle:")
        print("kaggle competitions download -c m5-forecasting-accuracy")
        print("Extract and place sales_train_validation.csv, calendar.csv, and sell_prices.csv in data/raw/")
        return None
    
    # Load and subset to CA_1 store directly in SQL for memory efficiency
    conn.execute(f"""
        CREATE TABLE IF NOT EXISTS sales AS
        SELECT * FROM read_csv_auto('{sales_path}')
        WHERE store_id = 'CA_1'
    """)
    
    conn.execute(f"""
        CREATE TABLE IF NOT EXISTS calendar AS
        SELECT * FROM read_csv_auto('{calendar_path}')
    """)
    
    conn.execute(f"""
        CREATE TABLE IF NOT EXISTS prices AS
        SELECT * FROM read_csv_auto('{prices_path}')
        WHERE store_id = 'CA_1'
    """)
    
    print(f"Data loaded into DuckDB at {DB_PATH}")
    return conn

def feature_engineering(conn):
    """Generates the required features for Module 1."""
    print("Starting feature engineering...")
    
    # Melt sales data from wide to long format
    print("Melting sales data...")
    sales_long = conn.execute("""
        UNPIVOT sales
        ON COLUMNS(* EXCLUDE (id, item_id, dept_id, cat_id, store_id, state_id))
        INTO
            NAME d
            VALUE units_sold
    """).df()
    
    # Load calendar and merge
    calendar = conn.execute("SELECT d, date, wm_yr_wk, wday, month, year, event_name_1, event_name_2, snap_CA FROM calendar").df()
    calendar['date'] = pd.to_datetime(calendar['date'])
    sales_long = sales_long.merge(calendar, on='d', how='left')
    
    # Load prices and merge
    prices = conn.execute("SELECT item_id, wm_yr_wk, sell_price FROM prices").df()
    df = sales_long.merge(prices, on=['item_id', 'wm_yr_wk'], how='left')
    
    # Sort for time series operations
    df = df.sort_values(by=['item_id', 'date']).reset_index(drop=True)
    
    print("Computing lags and rolling statistics...")
    # Lag features
    df['lag_7'] = df.groupby('item_id')['units_sold'].shift(7)
    df['lag_14'] = df.groupby('item_id')['units_sold'].shift(14)
    df['lag_28'] = df.groupby('item_id')['units_sold'].shift(28)
    
    # Rolling statistics (using .shift(1) to avoid leakage)
    # 7-day
    rolling_7 = df.groupby('item_id')['units_sold'].shift(1).groupby(df['item_id']).rolling(7)
    df['roll_mean_7'] = rolling_7.mean().reset_index(level=0, drop=True)
    df['roll_std_7'] = rolling_7.std().reset_index(level=0, drop=True)
    df['roll_min_7'] = rolling_7.min().reset_index(level=0, drop=True)
    df['roll_max_7'] = rolling_7.max().reset_index(level=0, drop=True)
    
    # 28-day
    rolling_28 = df.groupby('item_id')['units_sold'].shift(1).groupby(df['item_id']).rolling(28)
    df['roll_mean_28'] = rolling_28.mean().reset_index(level=0, drop=True)
    df['roll_std_28'] = rolling_28.std().reset_index(level=0, drop=True)
    df['roll_min_28'] = rolling_28.min().reset_index(level=0, drop=True)
    df['roll_max_28'] = rolling_28.max().reset_index(level=0, drop=True)
    
    print("Computing Fourier terms...")
    # Fourier terms for weekly (7) and annual (365.25) seasonality
    df['day_of_year'] = df['date'].dt.dayofyear
    
    # Weekly
    df['fourier_sin_7'] = np.sin(2 * np.pi * df['date'].dt.dayofweek / 7)
    df['fourier_cos_7'] = np.cos(2 * np.pi * df['date'].dt.dayofweek / 7)
    
    # Annual
    df['fourier_sin_365'] = np.sin(2 * np.pi * df['day_of_year'] / 365.25)
    df['fourier_cos_365'] = np.cos(2 * np.pi * df['day_of_year'] / 365.25)
    
    print("Computing price features...")
    # Price features
    df['price_change'] = df.groupby('item_id')['sell_price'].pct_change()
    
    # Price relative to category mean
    cat_price_mean = df.groupby(['cat_id', 'date'])['sell_price'].transform('mean')
    df['price_relative_to_cat_mean'] = df['sell_price'] / cat_price_mean
    
    print("Computing calendar and event features...")
    # Calendar features
    df['is_weekend'] = df['wday'].isin([1, 2]).astype(int) # wday 1 is Saturday, 2 is Sunday in M5
    df['snap_flag'] = df['snap_CA'] # Since we're CA_1
    
    # Event encoding
    major_events = ['SuperBowl', 'Thanksgiving', 'Christmas']
    df['event_flag'] = df['event_name_1'].isin(major_events).astype(int)
    
    # Lead/lag windows around events (-3 to +3 days)
    # We create a dummy variable that is 1 if an event happens in the next/past N days
    for lag in range(-3, 4):
        if lag == 0: continue
        col_name = f'event_lag_{lag}'
        # shift(-lag) means if lag is -3, we look 3 days ahead (shift(-3))
        # this is NOT leakage for future known events like holidays
        df[col_name] = df.groupby('item_id')['event_flag'].shift(-lag).fillna(0)
    
    print("Saving features to DuckDB and Parquet...")
    # Save to DuckDB
    conn.execute("DROP TABLE IF EXISTS features")
    conn.execute("CREATE TABLE features AS SELECT * FROM df")
    
    # Save to Parquet for faster reading by models
    parquet_path = os.path.join(PROCESSED_DIR, 'features.parquet')
    df.to_parquet(parquet_path)
    print(f"Features saved to {parquet_path}")
    
    return df

def main():
    conn = initialize_database()
    if conn:
        feature_engineering(conn)
        conn.close()

if __name__ == "__main__":
    main()
