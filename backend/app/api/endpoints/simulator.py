from fastapi import APIRouter
from app.worker.tasks import _poll_and_commit
from app.services.weather_service import mock_platform_status
import httpx # mock patching not implemented strictly here, we will just call poll_and_commit

router = APIRouter()

@router.post("/trigger")
async def trigger_simulation(city: str = "Mumbai"):
    """
    Forces an immediate trigger execution cycle for Demo Mode.
    Normally this runs every 15 minutes via Celery.
    """
    await _poll_and_commit()
    return {"message": "Simulation cycle completed. Triggers and claims assessed."}
