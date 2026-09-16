import yfinance as yf
import pandas as pd
import os

FINANCE_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'finance_raw')
os.makedirs(FINANCE_DATA_DIR, exist_ok=True)

def fetch_asset_data(tickers, period="2y", interval="1d"):
    """
    Fetches OHLCV data for specific trading challenge assets.
    """
    print(f"Fetching data for: {tickers}")
    data = yf.download(tickers, period=period, interval=interval)
    
    if len(tickers) == 1:
        # yfinance returns single index columns for one ticker
        df = data.reset_index()
        df['Ticker'] = tickers[0]
        filepath = os.path.join(FINANCE_DATA_DIR, f"{tickers[0]}_data.csv")
        df.to_csv(filepath, index=False)
        print(f"Saved to {filepath}")
    else:
        # Multi-ticker download returns MultiIndex columns
        for ticker in tickers:
            df = data.xs(ticker, axis=1, level=1).reset_index()
            df['Ticker'] = ticker
            filepath = os.path.join(FINANCE_DATA_DIR, f"{ticker}_data.csv")
            df.to_csv(filepath, index=False)
            print(f"Saved to {filepath}")

if __name__ == "__main__":
    # Example assets for Prop Firm Challenges
    # NQ (Nasdaq 100), ES (S&P 500), EURUSD, Gold (GC=F)
    challenge_assets = ["NQ=F", "ES=F", "EURUSD=X", "GC=F"]
    fetch_asset_data(challenge_assets)
