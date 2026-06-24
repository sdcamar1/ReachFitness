from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    mongo_url: str = ""
    db_name: str = "reach_fitness"
    jwt_secret: str
    admin_email: str
    admin_password: str
    resend_api_key: str = ""
    sender_email: str = ""
    notify_email: str = ""
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173"]
    studio_timezone: str = "America/Chicago"

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
