# R benchmark script for SARIMA and ETS
# Install packages if not present
if (!require("forecast")) install.packages("forecast", repos = "http://cran.us.r-project.org")
if (!require("tseries")) install.packages("tseries", repos = "http://cran.us.r-project.org")
if (!require("jsonlite")) install.packages("jsonlite", repos = "http://cran.us.r-project.org")
if (!require("arrow")) install.packages("arrow", repos = "http://cran.us.r-project.org")

library(forecast)
library(tseries)
library(jsonlite)
library(arrow)

# Paths
processed_dir <- "../data/processed"
results_dir <- "../data/results"
dir.create(results_dir, showWarnings = FALSE)

# Load data (assuming we have a simple CSV of the aggregate sales for ease in R)
# For the full pipeline, we'd read the parquet file
parquet_file <- file.path(processed_dir, "features.parquet")

if (file.exists(parquet_file)) {
  df <- read_parquet(parquet_file)
  
  # Aggregate by date
  agg_sales <- aggregate(units_sold ~ date, data = df, sum)
  agg_sales <- agg_sales[order(agg_sales$date), ]
  
  # Convert to ts object (daily data with weekly seasonality)
  y <- ts(agg_sales$units_sold, frequency = 7)
  
  # Train/test split (mock: last 28 days as test)
  n <- length(y)
  train <- subset(y, end = n - 28)
  test <- subset(y, start = n - 27)
  
  cat("Fitting auto.arima...\n")
  fit_arima <- auto.arima(train)
  print(summary(fit_arima))
  
  cat("Fitting ETS...\n")
  fit_ets <- ets(train)
  print(summary(fit_ets))
  
  # Forecast
  fc_arima <- forecast(fit_arima, h=28)
  fc_ets <- forecast(fit_ets, h=28)
  
  # Save results
  results <- list(
    arima = list(
      point = as.numeric(fc_arima$mean),
      lower_80 = as.numeric(fc_arima$lower[,1]),
      upper_80 = as.numeric(fc_arima$upper[,1]),
      lower_95 = as.numeric(fc_arima$lower[,2]),
      upper_95 = as.numeric(fc_arima$upper[,2])
    ),
    ets = list(
      point = as.numeric(fc_ets$mean),
      lower_80 = as.numeric(fc_ets$lower[,1]),
      upper_80 = as.numeric(fc_ets$upper[,1]),
      lower_95 = as.numeric(fc_ets$lower[,2]),
      upper_95 = as.numeric(fc_ets$upper[,2])
    )
  )
  
  write_json(results, file.path(results_dir, "r_benchmark_forecasts.json"))
  cat("R benchmark forecasts saved.\n")
} else {
  cat("Parquet data not found. Run Python data_processing.py first.\n")
}
