from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import List, Union
import json


class Settings(BaseSettings):
    # Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "ark"
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@db:5432/ark"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: str) -> str:
        if v:
            # Ensure it uses the psycopg driver (works with PgBouncer)
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+psycopg://", 1)
            elif v.startswith("postgresql://") and "+" not in v.split("://")[0]:
                return v.replace("postgresql://", "postgresql+psycopg://", 1)
            elif "+asyncpg" in v:
                return v.replace("+asyncpg", "+psycopg")
        return v

    # Redis / Celery
    REDIS_URL: str = "redis://redis:6379/0"

    @field_validator("REDIS_URL", mode="before")
    @classmethod
    def clean_redis_url(cls, v: str) -> str:
        if v is not None and str(v).strip():
            return str(v).strip()
        # Default to a generic redis url if empty
        return "redis://localhost:6379/0"

    # Gemini AI
    GEMINI_API_KEY: str = ""

    # Auth
    SECRET_KEY: str = "change-this-to-a-random-secret-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[List[str], str]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
