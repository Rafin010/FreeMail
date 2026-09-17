from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine
from app.core.exceptions import AppException, app_exception_handler
from app.api.v1 import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup
    print(f"Starting {settings.APP_NAME} in {settings.ENVIRONMENT} mode...")
    yield
    # Teardown
    await engine.dispose()
    print(f"Stopping {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="FreeMail Email Marketing API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_exception_handler(AppException, app_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.ENVIRONMENT}

@app.get("/")
async def root():
    return {"message": f"Welcome to the {settings.APP_NAME} API"}
