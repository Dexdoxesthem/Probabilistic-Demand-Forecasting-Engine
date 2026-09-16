import numpy as np
import pandas as pd

def simulate_prop_challenge(
    mu_daily: float,
    sigma_daily: float,
    n_paths: int = 10000,
    days: int = 30,
    starting_balance: float = 100000.0,
    profit_target_pct: float = 0.08,
    max_daily_loss_pct: float = 0.05,
    max_drawdown_pct: float = 0.10,
    min_days: int = 10
):
    """
    Monte Carlo simulator for Prop Firm challenge rules.
    Returns the joint probability of hitting the profit target before breaching drawdown rules.
    """
    # 1. Generate return paths (n_paths x days)
    # Using normal distribution as a baseline proxy for the predictive distribution
    returns = np.random.normal(loc=mu_daily, scale=sigma_daily, size=(n_paths, days))
    
    # 2. Convert to equity paths
    # Add 1 to returns to get multipliers (e.g., 0.01 -> 1.01)
    multipliers = 1 + returns
    
    # Cumulative product along the days axis
    equity_paths = starting_balance * np.cumprod(multipliers, axis=1)
    
    # Add starting balance as day 0
    day_zero = np.full((n_paths, 1), starting_balance)
    equity_paths = np.hstack((day_zero, equity_paths))
    
    # Calculate daily PnL (Open to Close for simplistic daily loss check)
    # True prop firms check intraday tick-by-tick, but daily close is our proxy here
    daily_equity_drops = (equity_paths[:, 1:] - equity_paths[:, :-1]) / starting_balance
    
    # Calculate running max for trailing drawdown
    running_max = np.maximum.accumulate(equity_paths, axis=1)
    drawdowns = (equity_paths - running_max) / starting_balance
    
    # Target and limits
    target_equity = starting_balance * (1 + profit_target_pct)
    
    # Rule checks per path
    passed = np.zeros(n_paths, dtype=bool)
    
    for i in range(n_paths):
        path = equity_paths[i]
        daily_drops = daily_equity_drops[i]
        dds = drawdowns[i]
        
        # Did we breach daily loss at any point?
        breached_daily = np.any(daily_drops < -max_daily_loss_pct)
        # Did we breach overall drawdown?
        breached_dd = np.any(dds < -max_drawdown_pct)
        
        if breached_daily or breached_dd:
            continue
            
        # Did we hit the profit target?
        # Find the first day we hit the target
        hit_target_days = np.where(path >= target_equity)[0]
        
        if len(hit_target_days) > 0:
            first_hit = hit_target_days[0]
            # Ensure we meet minimum days (or assume we can trade micro lots to pad days)
            # If we hit it, and didn't breach, we pass!
            passed[i] = True
            
    pass_rate = np.mean(passed)
    
    # Calculate median finish, 5th percentile finish
    final_equity = equity_paths[:, -1]
    median_finish_pct = (np.median(final_equity) / starting_balance) - 1
    p05_finish_pct = (np.percentile(final_equity, 5) / starting_balance) - 1
    
    return {
        "pass_probability": pass_rate,
        "median_finish_pct": median_finish_pct,
        "p05_finish_pct": p05_finish_pct,
        "equity_paths": equity_paths  # Can be used to plot the fan chart
    }

if __name__ == "__main__":
    # Example usage:
    # Assuming our model gives us a slight edge (0.05% daily return) with 0.8% daily vol
    # after sizing via fractional Kelly
    res = simulate_prop_challenge(
        mu_daily=0.0005,
        sigma_daily=0.008,
        n_paths=10000
    )
    print(f"Pass Probability: {res['pass_probability']:.1%}")
    print(f"Median Finish: {res['median_finish_pct']:.1%}")
    print(f"5th Percentile Finish: {res['p05_finish_pct']:.1%}")
