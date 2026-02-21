from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Second Brain API"
    app_env: str = "dev"
    database_url: str = "sqlite:///./second_brain.db"
    upload_dir: str = "./uploads"
    ollama_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"
    default_news_feeds: list[str] = Field(
        default_factory=lambda: [
            "https://news.ycombinator.com/rss",
            "https://www.theverge.com/rss/index.xml",
        ]
    )

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
