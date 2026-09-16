import pandas as pd
import numpy as np
import os
import pytorch_lightning as pl
from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
from pytorch_forecasting.data import GroupNormalizer
from pytorch_forecasting.metrics import QuantileLoss
import warnings
warnings.filterwarnings("ignore")

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'data', 'processed')

def prep_tft_data(df):
    print("Preparing data for TFT...")
    
    # TFT requires an integer time index
    df = df.sort_values(['item_id', 'date'])
    df['time_idx'] = (df['date'] - df['date'].min()).dt.days
    
    # Fill NAs
    df.fillna(0, inplace=True)
    
    # Ensure types
    categorical_cols = ['item_id', 'wday', 'month']
    for col in categorical_cols:
        if col in df.columns:
            df[col] = df[col].astype(str)
            
    return df

def train_tft(df, max_encoder_length=28, max_prediction_length=28):
    print("Setting up TimeSeriesDataSet...")
    
    training_cutoff = df["time_idx"].max() - max_prediction_length
    
    training = TimeSeriesDataSet(
        df[lambda x: x.time_idx <= training_cutoff],
        time_idx="time_idx",
        target="units_sold",
        group_ids=["item_id"],
        min_encoder_length=max_encoder_length // 2,
        max_encoder_length=max_encoder_length,
        min_prediction_length=1,
        max_prediction_length=max_prediction_length,
        static_categoricals=["item_id"],
        time_varying_known_categoricals=["wday", "month"],
        time_varying_known_reals=["time_idx", "sell_price"],
        time_varying_unknown_categoricals=[],
        time_varying_unknown_reals=["units_sold", "roll_mean_7", "lag_7"],
        target_normalizer=GroupNormalizer(
            groups=["item_id"], transformation="softplus"
        ),
        add_relative_time_idx=True,
        add_target_scales=True,
        add_encoder_length=True,
    )
    
    # Create dataloaders
    batch_size = 64
    train_dataloader = training.to_dataloader(train=True, batch_size=batch_size, num_workers=0)
    
    # Model
    print("Initializing TFT...")
    tft = TemporalFusionTransformer.from_dataset(
        training,
        learning_rate=0.03,
        hidden_size=16,
        attention_head_size=1,
        dropout=0.1,
        hidden_continuous_size=8,
        output_size=3,  # 3 quantiles (10%, 50%, 90%)
        loss=QuantileLoss(quantiles=[0.1, 0.5, 0.9]),
        log_interval=10, 
        reduce_on_plateau_patience=4,
    )
    
    print("TFT Setup Complete. (Training skipped in mock to save time)")
    return tft

if __name__ == "__main__":
    parquet_path = os.path.join(PROCESSED_DIR, 'features.parquet')
    if os.path.exists(parquet_path):
        df = pd.read_parquet(parquet_path)
        # Subset to make it fast for testing
        top_items = df['item_id'].unique()[:50]
        df_sub = df[df['item_id'].isin(top_items)]
        
        df_tft = prep_tft_data(df_sub)
        tft_model = train_tft(df_tft)
        print("TFT Script ran successfully.")
