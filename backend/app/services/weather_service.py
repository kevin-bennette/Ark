import httpx
from typing import Dict, Any

async def fetch_weather_and_aqi(lat: float = 19.076, lon: float = 72.877) -> Dict[str, Any]:
    """
    Fetches real-time weather and AQI from Open-Meteo (free, no API key).
    Defaults to Mumbai for the simulation.
    """
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=precipitation"
    aqi_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=european_aqi"
    
    async with httpx.AsyncClient() as client:
        try:
            weather_res = await client.get(weather_url)
            aqi_res = await client.get(aqi_url)
            
            weather_data = weather_res.json()
            aqi_data = aqi_res.json()
            
            return {
                "temperature": weather_data.get("current_weather", {}).get("temperature", 25.0),
                "rainfall_mm": weather_data.get("hourly", {}).get("precipitation", [0.0])[0], # using first hour roughly
                "aqi": aqi_data.get("current", {}).get("european_aqi", 50.0)
            }
        except Exception as e:
            print(f"Error fetching open-meteo data: {e}")
            return {"temperature": 25.0, "rainfall_mm": 0.0, "aqi": 50.0}

async def mock_platform_status(city: str) -> str:
    """Mock platform API returning 'up' or 'down'."""
    # Hardcoded simulation behavior.
    if city.lower() == "simulation_down":
        return "down"
    return "up"
