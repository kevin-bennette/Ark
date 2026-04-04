from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "ark"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/ark"
    REDIS_URL: str = "redis://redis:6379/0"
    GEMINI_API_KEY: str = ""
    
    class Config:
        env_file = "../.env"

settings = Settings()
