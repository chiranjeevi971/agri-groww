import urllib.request
import json
import logging

logger = logging.getLogger(__name__)

WEATHER_CODE_MAP = {
    0: ("Clear sky", "☀️"),
    1: ("Mainly clear", "🌤️"),
    2: ("Partly cloudy", "⛅"),
    3: ("Overcast", "☁️"),
    45: ("Fog", "🌫️"),
    48: ("Depositing rime fog", "🌫️"),
    51: ("Light drizzle", "🌦️"),
    53: ("Moderate drizzle", "🌦️"),
    55: ("Dense drizzle", "🌧️"),
    61: ("Slight rain", "🌧️"),
    63: ("Moderate rain", "🌧️"),
    65: ("Heavy rain", "⛈️"),
    80: ("Slight rain showers", "🌦️"),
    81: ("Moderate rain showers", "🌧️"),
    82: ("Violent rain showers", "⛈️"),
    95: ("Thunderstorm", "⚡")
}

def get_weather_description(code: int):
    return WEATHER_CODE_MAP.get(code, ("Partly cloudy", "⛅"))

def get_live_weather(lat: float, lon: float):
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&"
        f"current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&"
        f"daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min&"
        f"timezone=Asia%2FKolkata"
    )

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "AgriGrowAI/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))

        current = data.get("current", {})
        daily = data.get("daily", {})

        temp = current.get("temperature_2m", 28.0)
        humidity = current.get("relative_humidity_2m", 65.0)
        precip = current.get("precipitation", 0.0)
        code = current.get("weather_code", 1)
        wind = current.get("wind_speed_10m", 8.0)

        condition_text, icon = get_weather_description(code)

        # 3-day rainfall forecast sum
        daily_rain = daily.get("precipitation_sum", [0, 0, 0])
        next_3d_rain = sum(daily_rain[:3]) if daily_rain else 0.0
        rain_prob = daily.get("precipitation_probability_max", [0])[0] if daily.get("precipitation_probability_max") else 0

        # Smart Irrigation Advisory Logic
        if next_3d_rain > 15.0 or rain_prob > 75:
            advisory = "🌧️ Heavy rain forecasted: Postpone irrigation by 48-72 hours to prevent waterlogging & nutrient leaching."
            action = "Postpone Irrigation"
            irrigation_status = "HOLD"
        elif temp > 35.0 and humidity < 40:
            advisory = "☀️ High evapotranspiration rate: Water during early morning (6-8 AM) or sunset to reduce evaporation loss."
            action = "Early Morning Irrigation"
            irrigation_status = "CRITICAL"
        elif precip > 2.0:
            advisory = "🌦️ Active precipitation: Natural soil replenishment underway. Keep drainage gates clear."
            action = "Monitor Drainage"
            irrigation_status = "HOLD"
        else:
            advisory = "✅ Weather conditions favorable: Follow your standard crop timeline schedule."
            action = "Normal Schedule"
            irrigation_status = "NORMAL"

        return {
            "source": "Open-Meteo High Resolution Model",
            "coordinates": {"lat": lat, "lon": lon},
            "current": {
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "precipitation": round(precip, 1),
                "wind_speed": round(wind, 1),
                "condition": condition_text,
                "icon": icon
            },
            "forecast_3d_rain_mm": round(next_3d_rain, 1),
            "rain_probability": rain_prob,
            "irrigation_advisory": {
                "status": irrigation_status,
                "action": action,
                "detail": advisory
            }
        }
    except Exception as e:
        logger.warning(f"Live weather fetch failed: {e}. Using regional climatology.")
        return {
            "source": "Offline Fallback Climatology",
            "coordinates": {"lat": lat, "lon": lon},
            "current": {
                "temperature": 27.5,
                "humidity": 68.0,
                "precipitation": 0.0,
                "wind_speed": 6.5,
                "condition": "Partly cloudy",
                "icon": "⛅"
            },
            "forecast_3d_rain_mm": 2.0,
            "rain_probability": 20,
            "irrigation_advisory": {
                "status": "NORMAL",
                "action": "Normal Schedule",
                "detail": "Weather data cached. Follow standard crop schedule."
            }
        }
