"""
Configuration module for the Translation API
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv("config.env")


class Settings:
    """Application settings"""

    # API Configuration — Chipp AI (existing text translation)
    api_key: str = os.getenv("API_KEY", "")
    chipp_base_url: str = os.getenv("CHIPP_BASE_URL", "https://app.chipp.ai/api/v1/chat/completions")
    chipp_model: str = os.getenv("CHIPP_MODEL", "translationforfree-10024994")

    # API Configuration — Gemini (subtitle translation)
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")

    # Server Configuration
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    # Application Configuration
    app_name: str = "Translation API"
    app_version: str = "1.1.0"
    description: str = "A FastAPI-based translation service"

    # CORS Configuration — locked to known origins
    allowed_origins: list = [
        "https://translationforfree.com",
        "http://localhost:8080",
        "http://localhost:5173",
    ]
    allowed_methods: list = ["GET", "POST"]
    allowed_headers: list = ["*"]

    @property
    def is_production(self) -> bool:
        return not self.debug


# Global settings instance
settings = Settings()
