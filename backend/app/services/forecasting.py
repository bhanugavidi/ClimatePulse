import numpy as np

def generate_short_term_forecast(baseline_aqi: float, wind_speed: float, humidity: float, hours: int = 6):
    """
    Generates an hourly short-term AQI trend forecast based on atmospheric dispersion:
    - Low wind speed (< 3 m/s) and high humidity causes stagnation, driving AQI up.
    - Strong wind (> 6 m/s) disperses particulates, lowering AQI.
    """
    forecast_points = []
    current_val = baseline_aqi

    # Dispersion factor
    stagnation_factor = 1.05 if wind_speed < 3.5 else 0.96
    if humidity > 70:
        stagnation_factor += 0.02

    for h in range(1, hours + 1):
        noise = float(np.random.normal(0, 1.5))
        current_val = max(15.0, round((current_val * stagnation_factor) + noise, 1))
        
        forecast_points.append({
            "hour_offset": h,
            "predicted_aqi": current_val,
            "confidence": round(max(0.65, 0.95 - (h * 0.05)), 2)
        })

    return forecast_points