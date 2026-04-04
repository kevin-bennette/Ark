import asyncio
from app.core.celery_app import celery_app
from app.services.weather_service import fetch_weather_and_aqi, mock_platform_status
from app.database import AsyncSessionLocal
from app.models import Trigger

@celery_app.task
def poll_environmental_triggers():
    """Periodic Celery Task to evaluate environment for risk triggers."""
    asyncio.run(_poll_and_commit())

async def _poll_and_commit():
    city = "Mumbai" # Default for global checking
    data = await fetch_weather_and_aqi()
    platform_state = await mock_platform_status(city)
    
    triggers = []
    
    # Logic for trigger assessment:
    if data["rainfall_mm"] > 10.0:
        triggers.append({"type": "rain", "severity": data["rainfall_mm"]})
        
    if data["temperature"] > 40.0:
        triggers.append({"type": "heat", "severity": data["temperature"]})
        
    if data["aqi"] > 150:
        triggers.append({"type": "pollution", "severity": float(data["aqi"])})
        
    if platform_state == "down":
        triggers.append({"type": "platform_down", "severity": 1.0})
        
    if not triggers:
        print("No threshold breaches detected. System nominal.")
        return
        
    # Write triggers to the database
    async with AsyncSessionLocal() as session:
        for t in triggers:
            trigger_row = Trigger(
                trigger_type=t["type"],
                severity=t["severity"],
                zone=city
            )
            session.add(trigger_row)
        await session.commit()
        print(f"Recorded {len(triggers)} triggers into the database.")
