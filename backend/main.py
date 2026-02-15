#!/usr/bin/env python3
"""
FastAPI Translation Web Application
Entry point for the translation service
"""

import uvicorn
from app.main import app
from app.config import settings

def main():
    """Run the FastAPI application"""
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Server will be available at: http://{settings.host}:{settings.port}")
    print(f"API documentation: http://{settings.host}:{settings.port}/docs")
    print(f"Debug mode: {settings.debug}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if settings.debug else "warning"
    )

if __name__ == "__main__":
    main()
