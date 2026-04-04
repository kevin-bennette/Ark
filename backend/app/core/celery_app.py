from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "ark_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.worker.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# 15 minute interval schedule
celery_app.conf.beat_schedule = {
    "poll-triggers-every-15-min": {
        "task": "app.worker.tasks.poll_environmental_triggers",
        "schedule": crontab(minute='*/15'),
    },
}
