# Probabilistic Demand Forecasting Engine

A research-grade multi-model forecasting system trained on the Walmart M5 competition dataset. This project covers classical econometrics, machine learning, and deep learning—evaluated on strict walk-forward out-of-sample splits with probabilistic scoring (CRPS, MAPIE). It features a robust DuckDB-backed feature engineering pipeline and a Next.js visualization dashboard.

## Project Overview

The core discipline of this project is strict walk-forward evaluation. Models are never evaluated on random train-test splits. Success is measured via probabilistic metrics (CRPS) rather than simple point predictions (RMSE), producing true probability distributions over future demand.

The project is broken into five distinct modules:

### 1. Data Architecture and Feature Engineering (`src/data_processing.py`)
- **Data Source:** M5 Kaggle Dataset (Sub-setted to the `CA_1` store for computational tractability).
- **Storage:** Ingests raw CSVs into **DuckDB** for fast, memory-efficient local processing.
- **Feature Engineering:**
  - **Lags & Rolling Windows:** 7-day and 28-day lags/rolling statistics. Strictly uses `.shift(1)` to prevent look-ahead bias.
  - **Seasonality:** Computes Fourier sine/cosine terms for weekly (7) and annual (365.25) cycles.
  - **Exogenous Variables:** Price changes relative to category means, and SNAP (food stamp) indicator flags.
  - **Event Encoding:** Custom lead/lag proximity windows around major holidays (Super Bowl, Thanksgiving, Christmas).

### 2. Pre-Modelling Diagnostics (`src/diagnostics.py`)
- **Stationarity Testing:** Augmented Dickey-Fuller (ADF), KPSS, and Phillips-Perron (PP) tests on aggregate and differenced series.
- **Seasonality & Autocorrelation:** Automated ACF/PACF plotting and STL decomposition.
- **Distributional Analysis:** Evaluates the right-skewed, zero-inflated nature of retail sales. Calculates SKU-level intermittency to highlight where Croston's method might be required.

### 3. Model Pipeline (`src/models/`)
Four tiers of models evaluated in hierarchical order:
1. **Classical Baselines:** Naïve, Seasonal Naïve, and SARIMA/SARIMAX via `pmdarima`. Validated cross-language against R's `forecast::auto.arima` and `ets` in `r_scripts/benchmark.R`.
2. **Prophet:** Facebook's additive regression model with custom M5 holidays, tested with and without external regressors (price, SNAP).
3. **LightGBM:** A global tree-based model utilizing a recursive multi-step forecasting strategy, tuned via Optuna. Includes SHAP value extraction for feature importance.
4. **Temporal Fusion Transformer (TFT):** PyTorch-based Deep Learning architecture capable of native multi-horizon probabilistic quantiles (10th, 50th, 90th percentile).

### 4. Evaluation Framework (`src/evaluation.py`)
- **Walk-Forward Validation:** Expanding window evaluation mimicking the true M5 test set (days 1886-1913 validation, 1914-1941 out-of-sample).
- **Metrics:** Root Mean Squared Scaled Error (RMSSE), Mean Absolute Scaled Error (MASE), Continuous Ranked Probability Score (CRPS), and Quantile Pinball Loss.
- **Diebold-Mariano (DM) Test:** Statistical significance testing to mathematically prove if complex models outperform Seasonal Naïve baselines.
- **Conformal Intervals (MAPIE):** Generates distribution-free, guaranteed-coverage prediction intervals using the EnbPI (Ensemble Batch Prediction Intervals) method specifically designed for time series.

### 5. Frontend Dashboard (`frontend/`)
A Next.js application designed to consume offline `.json` and `.parquet` predictions to surface insights cleanly without requiring live inference.
- **Model Comparison Table:** Sortable model performance with DM significance flags.
- **Interactive Forecast Explorer:** SKU-level time series charting with uncertainty bands.
- **Diagnostics & Intervals:** Reliability diagrams plotting nominal vs. actual interval coverage.

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js (for Next.js frontend)
- R (Optional, for cross-language SARIMA benchmarks)

### 1. Python Environment Setup
```bash
python -m venv .venv
# Activate virtual environment
# Windows:
.\.venv\Scripts\Activate.ps1
# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Data Ingestion
You must first download the M5 data. Ensure your Kaggle API key (`~/.kaggle/kaggle.json`) is configured.
```bash
python src/download_data.py
```
*(Alternatively, download the `sales_train_validation.csv`, `calendar.csv`, and `sell_prices.csv` manually from Kaggle and place them in the `data/raw/` directory.)*

### 3. Run Pipeline
Execute the full data engineering, diagnostics, and evaluation pipeline:
```bash
python run_pipeline.py
```
*(Note: To train TFT and LightGBM models, execute their respective scripts directly inside `src/models/` due to heavy compute requirements).*

### 4. Launch Next.js Dashboard
```bash
cd frontend
npm install
npm run dev
```

---

## Key Findings

One of the cornerstone research findings from this project stems from the Diebold-Mariano tests. On highly aggregated retail series over short horizons (e.g., 7 days), highly complex deep learning models (TFT) often **do not statistically outperform** simple baseline models (Seasonal Naïve). True model value reveals itself at longer horizons (28-day) and on granular SKU-level probabilistic coverage.
