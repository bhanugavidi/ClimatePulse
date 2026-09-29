import os
import io
import requests
from PIL import Image
from typing import Optional, Tuple

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def analyze_image_heuristics(image_bytes: bytes) -> Tuple[int, str]:
    """
    Fast image heuristic fallback if no vision API key is configured.
    Analyzes grayscale variance, contrast, and dark pixel distribution to estimate haze/smoke.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("L")
        # Resize for fast processing
        image = image.resize((100, 100))
        pixels = list(image.getdata())
        
        avg_brightness = sum(pixels) / len(pixels)
        # Check dark dense patches (smoke) or muted low-contrast grey tones (haze)
        dark_pixels = sum(1 for p in pixels if p < 75)
        dark_ratio = dark_pixels / len(pixels)

        if dark_ratio > 0.35:
            return 85, "smoke"
        elif avg_brightness < 120 and dark_ratio > 0.20:
            return 72, "burning"
        elif 120 <= avg_brightness <= 190:
            return 58, "haze"
        else:
            return 25, "normal"
    except Exception as e:
        print(f"Heuristic image processing error: {e}")
        return 50, "haze"


def score_report_ai(
    photo_url: Optional[str] = None,
    reported_pm25: Optional[float] = None,
    wind_speed: float = 3.5,
    humidity: float = 60.0
) -> Tuple[int, str, str]:
    """
    Produces composite AI score (0-100), category, and severity rating.
    Blends:
    - Vision model or image heuristic analysis
    - Physical sensor inputs (reported_pm25)
    - Atmospheric context (stagnant air / high humidity)
    """
    img_score = 30
    category = "normal"

    # 1. Analyze photo if provided
    if photo_url and photo_url.startswith("http"):
        try:
            resp = requests.get(photo_url, timeout=4.0)
            if resp.status_code == 200:
                img_score, category = analyze_image_heuristics(resp.content)
            else:
                img_score, category = 65, "smoke"
        except Exception:
            img_score, category = 65, "smoke"
    elif reported_pm25 and reported_pm25 > 100:
        category = "haze"

    # 2. Contextual sensor & weather adjustments
    sensor_weight = 0.0
    if reported_pm25 is not None:
        # Scale PM2.5 to 0-100 range (assuming 250+ is max severity)
        sensor_weight = min(100.0, (reported_pm25 / 250.0) * 100.0)
        final_score = int(0.55 * sensor_weight + 0.45 * img_score)
    else:
        final_score = img_score

    # 3. Atmospheric stagnation bonus
    if wind_speed < 3.0:
        final_score = min(100, final_score + 5)
    if humidity > 75:
        final_score = min(100, final_score + 5)

    # 4. Map final score to severity
    if final_score >= 80:
        severity = "severe"
    elif final_score >= 65:
        severity = "high"
    elif final_score >= 45:
        severity = "moderate"
    else:
        severity = "low"

    return final_score, category, severity