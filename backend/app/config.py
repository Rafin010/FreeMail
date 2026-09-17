"""Application configuration loaded from environment variables."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration — every value can be overridden via env vars."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────
    APP_NAME: str = "FreeMail"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # ── Database ─────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:your_password@db.your-supabase-project.supabase.co:5432/postgres"
    DATABASE_URL_SYNC: str = "postgresql://postgres:your_password@db.your-supabase-project.supabase.co:5432/postgres"

    # ── Redis ────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Celery ───────────────────────────────────────────
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── JWT / Auth ───────────────────────────────────────
    JWT_SECRET: str = "super-secret-jwt-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── CORS ─────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    # ── Email Provider ───────────────────────────────────
    EMAIL_PROVIDER: str = "mock"  # mock | ses | sendgrid | mailgun
    SENDGRID_API_KEY: str = ""
    MAILGUN_API_KEY: str = ""
    MAILGUN_DOMAIN: str = ""
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"

    # ── AI Provider ──────────────────────────────────────
    AI_PROVIDER: str = "mock"  # mock | openai | gemini
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # ── Storage ──────────────────────────────────────────
    STORAGE_PROVIDER: str = "local"  # local | s3 | r2
    UPLOAD_DIR: str = "uploads"


settings = Settings()
