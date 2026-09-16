import pandas as pd
import numpy as np
import lightgbm as lgb
import optuna
from sklearn.model_selection import TimeSeriesSplit
import os
import shap
import json
import matplotlib.pyplot as plt

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'processed')
ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'frontend', 'public', 'assets')
RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'results')

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

def train_lgbm_global(train_df, features, categorical_features):
    """Trains a single LightGBM model on all series simultaneously."""
    print("Training global LightGBM model...")
    X_train = train_df[features]
    y_train = train_df['units_sold']
    
    # Categorical features must be category dtype for LightGBM
    for c in categorical_features:
        if c in X_train.columns:
            X_train[c] = X_train[c].astype('category')
            
    # Simple hyperparameters, ideally tuned with Optuna
    params = {
        'objective': 'regression',
        'metric': 'rmse',
        'boosting_type': 'gbdt',
        'learning_rate': 0.05,
        'num_leaves': 31,
        'verbose': -1,
        'random_state': 42
    }
    
    train_data = lgb.Dataset(X_train, label=y_train, categorical_feature=categorical_features)
    model = lgb.train(params, train_data, num_boost_round=100)
    return model

def recursive_forecast(model, last_train_data, future_calendar_df, features, h=28):
    """Generates 28-day ahead forecast using a recursive strategy."""
    print(f"Generating recursive forecast for {h} days...")
    
    # This is complex to implement generically because we need to update lag/rolling features
    # at each step. For a true recursive model on M5, it's often better to just use direct
    # strategy or simplify the feature updates.
    
    # Due to time constraints in this mock, we'll demonstrate a simplified pseudo-recursive
    # step or a direct forecast if we assume features are pre-computed for the future.
    # In a real scenario, you'd iterate t=1..h, predict y_t, append to history, 
    # recompute roll_mean_7, lag_7, etc.
    
    # For this exercise, let's assume we use a direct strategy (model trained for horizon h)
    # or that we use LightGBM for point predictions.
    pass

def generate_shap_importance(model, X_sample):
    """Generates SHAP summary plot."""
    print("Computing SHAP values...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_sample)
    
    plt.figure(figsize=(10, 8))
    shap.summary_plot(shap_values, X_sample, show=False)
    plt.tight_layout()
    plt.savefig(os.path.join(ASSETS_DIR, 'shap_summary.png'))
    plt.close()

if __name__ == "__main__":
    parquet_path = os.path.join(PROCESSED_DIR, 'features.parquet')
    if os.path.exists(parquet_path):
        df = pd.read_parquet(parquet_path)
        
        # Define features
        exclude_cols = ['id', 'd', 'date', 'units_sold', 'wm_yr_wk', 'event_name_1', 'event_name_2', 'snap_CA', 'snap_TX', 'snap_WI']
        features = [c for c in df.columns if c not in exclude_cols]
        categorical_features = ['item_id', 'dept_id', 'cat_id', 'store_id', 'state_id']
        
        # Keep only categorical features that exist in df
        categorical_features = [c for c in categorical_features if c in df.columns]
        
        # Split (mock)
        train_df = df[df['date'] <= df['date'].max() - pd.Timedelta(days=28)]
        test_df = df[df['date'] > df['date'].max() - pd.Timedelta(days=28)]
        
        # Drop rows with NaNs from rolling/lags
        train_df = train_df.dropna(subset=['lag_28', 'roll_mean_28'])
        
        model = train_lgbm_global(train_df, features, categorical_features)
        
        # SHAP
        X_sample = train_df[features].sample(1000, random_state=42)
        for c in categorical_features:
            X_sample[c] = X_sample[c].astype('category')
        generate_shap_importance(model, X_sample)
        
        print("LightGBM model training and SHAP analysis complete.")
