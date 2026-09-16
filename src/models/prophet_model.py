import pandas as pd
import numpy as np
from prophet import Prophet
import os
import json

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'processed')
RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

def prepare_prophet_data(df, target_col='units_sold'):
    """Prepares dataframe for Prophet (requires 'ds' and 'y' columns)."""
    pdf = df.rename(columns={'date': 'ds', target_col: 'y'})
    return pdf

def get_m5_events(df):
    """Creates a custom holiday dataframe for Prophet based on M5 calendar."""
    events = df[df['event_name_1'].notna()][['date', 'event_name_1']].drop_duplicates()
    holidays = pd.DataFrame({
        'holiday': events['event_name_1'],
        'ds': events['date'],
        'lower_window': -3,
        'upper_window': 3,
    })
    return holidays

def run_prophet(train_df, test_df=None, h=28, use_regressors=False, m5_holidays=None):
    print(f"Fitting Prophet model (use_regressors={use_regressors})...")
    
    # Base model config
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False,
        holidays=m5_holidays,
        interval_width=0.95 # Get 95% intervals natively
    )
    model.add_country_holidays(country_name='US')
    
    if use_regressors:
        model.add_regressor('sell_price')
        model.add_regressor('snap_flag')
        
    # Fit model
    model.fit(train_df)
    
    # Create future dataframe
    if test_df is not None:
        future = test_df[['ds']].copy()
        if use_regressors:
            future['sell_price'] = test_df['sell_price']
            future['snap_flag'] = test_df['snap_flag']
    else:
        future = model.make_future_dataframe(periods=h)
        # Without test_df, we can't reliably forecast with regressors (need future prices/snap)
        if use_regressors:
            raise ValueError("test_df must be provided to use regressors (need future values).")
            
    # Predict
    forecast = model.predict(future)
    
    # We also want 80% intervals. Prophet only gives one width at a time.
    # To get 80%, we have to refit or just use the predictive samples (mcmc_samples), but
    # for simplicity we can refit with interval_width=0.8
    model_80 = Prophet(
        yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False,
        holidays=m5_holidays, interval_width=0.80
    )
    model_80.add_country_holidays(country_name='US')
    if use_regressors:
        model_80.add_regressor('sell_price')
        model_80.add_regressor('snap_flag')
    model_80.fit(train_df)
    forecast_80 = model_80.predict(future)
    
    # Combine results
    # Only keep the out-of-sample period (last h rows)
    out_of_sample = forecast.iloc[-h:]
    out_of_sample_80 = forecast_80.iloc[-h:]
    
    return {
        "point": out_of_sample['yhat'].tolist(),
        "lower_95": out_of_sample['yhat_lower'].tolist(),
        "upper_95": out_of_sample['yhat_upper'].tolist(),
        "lower_80": out_of_sample_80['yhat_lower'].tolist(),
        "upper_80": out_of_sample_80['yhat_upper'].tolist()
    }

if __name__ == "__main__":
    parquet_path = os.path.join(PROCESSED_DIR, 'features.parquet')
    if os.path.exists(parquet_path):
        df = pd.read_parquet(parquet_path)
        
        # Test on aggregate
        agg = df.groupby('date').agg({
            'units_sold': 'sum',
            'sell_price': 'mean',
            'snap_flag': 'max',
            'event_name_1': 'first' # keep event
        }).reset_index()
        
        prophet_df = prepare_prophet_data(agg)
        m5_holidays = get_m5_events(df)
        
        train = prophet_df.iloc[:-28]
        test = prophet_df.iloc[-28:]
        
        res_base = run_prophet(train, test, h=28, use_regressors=False, m5_holidays=m5_holidays)
        res_reg = run_prophet(train, test, h=28, use_regressors=True, m5_holidays=m5_holidays)
        
        with open(os.path.join(RESULTS_DIR, 'prophet_forecasts_agg.json'), 'w') as f:
            json.dump({'base': res_base, 'regressors': res_reg}, f)
        print("Prophet forecasts saved.")
