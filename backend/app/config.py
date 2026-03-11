from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Database
    database_url: str = "sqlite:///./compliance.db"
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    
    # CORS
    allowed_origins: Union[List[str], str] = ["http://localhost:3000", "http://localhost:5173"]
    
    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            # Remove quotes if present and split by comma
            v = v.strip('"\'')
            return [item.strip() for item in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
