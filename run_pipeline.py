import os
import sys

def main():
    print("--- Probabilistic Demand Forecasting Engine ---")
    
    print("\n[Module 1] Data Architecture and Feature Engineering")
    try:
        from src import data_processing
        data_processing.main()
    except Exception as e:
        print(f"Error in Module 1: {e}")
        
    print("\n[Module 2] Pre-Modelling Diagnostics")
    try:
        from src import diagnostics
        diagnostics.run_diagnostics()
    except Exception as e:
        print(f"Error in Module 2: {e}")
        
    print("\n[Module 3] Model Pipeline")
    print("Skipping full model runs in main script to save time. See individual scripts in src/models/")
    
    print("\n[Module 4] Evaluation Framework")
    try:
        from src import evaluation
        evaluation.evaluate_models()
    except Exception as e:
        print(f"Error in Module 4: {e}")
        
    print("\nPipeline execution finished.")

if __name__ == "__main__":
    main()
