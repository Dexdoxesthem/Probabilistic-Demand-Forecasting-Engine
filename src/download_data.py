import os
import subprocess
import zipfile

def download_m5_data():
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    RAW_DIR = os.path.join(DATA_DIR, 'raw')
    os.makedirs(RAW_DIR, exist_ok=True)
    
    zip_path = os.path.join(RAW_DIR, 'm5-forecasting-accuracy.zip')
    
    print("Attempting to download M5 dataset using Kaggle CLI...")
    try:
        subprocess.run([
            "kaggle", "competitions", "download", "-c", "m5-forecasting-accuracy", "-p", RAW_DIR
        ], check=True)
        print("Download successful. Extracting...")
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(RAW_DIR)
            
        print("Extraction complete.")
        
        # Clean up zip file
        os.remove(zip_path)
    except Exception as e:
        print(f"Error downloading with Kaggle CLI: {e}")
        print("Please ensure you have configured your Kaggle API key (~/.kaggle/kaggle.json)")
        print(f"Or download manually and extract to: {RAW_DIR}")

if __name__ == "__main__":
    download_m5_data()
