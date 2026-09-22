"""
Dynamic Hotel Pricing Management System - Backend API Entrypoint
FastAPI Application with Swagger OpenAPI Docs, CORS, and Lifecycle Management
"""
import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, PROJECT_ROOT)

from backend.app.api.endpoints import router as api_router
from backend.app.services.model_service import ModelService

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=" * 60)
    print("STARTING DYNAMIC HOTEL PRICING REST API")
    print("=" * 60)
    service = ModelService()
    print(f"Service status on startup: Ready={service.is_loaded}")
    yield
    print("Shutting down Dynamic Hotel Pricing REST API...")

app = FastAPI(
    title="Dynamic Hotel Pricing Management System API",
    description=(
        "Enterprise-grade machine learning inference and dynamic revenue management engine. "
        "Predicts optimal Average Daily Rate (ADR) using an ensemble of 4 ML regressors "
        "(Ridge baseline, Random Forest, HistGradientBoosting, Extra Trees) with XAI explanations."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes under /api
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Dynamic Hotel Pricing Management System API is active.",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
