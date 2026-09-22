"""
FastAPI Route Handlers
Dynamic Hotel Pricing Management System
"""
import os
import json
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends
from backend.app.schemas import (
    BookingInput,
    PredictionResponse,
    ScenarioRequest,
    ScenarioResponse,
    HealthResponse
)
from backend.app.services.model_service import ModelService

router = APIRouter()

def get_model_service() -> ModelService:
    service = ModelService()
    return service

@router.get("/health", response_model=HealthResponse)
def health_check(service: ModelService = Depends(get_model_service)):
    return HealthResponse(
        status="healthy" if service.is_loaded else "initializing",
        app_name="Dynamic Hotel Pricing Management System",
        version="1.0.0",
        models_loaded=service.is_loaded,
        model_count=len(service.models),
        artifacts_ready=service.is_loaded
    )

@router.get("/models")
def list_models(service: ModelService = Depends(get_model_service)):
    return {
        "models": [
            {
                "key": "baseline_ridge",
                "name": "Ridge Linear Baseline",
                "family": "Linear Regularized",
                "description": "L2 Regularized benchmark linear regression establishing baseline accuracy."
            },
            {
                "key": "random_forest",
                "name": "Random Forest Regressor",
                "family": "Bagging Ensemble",
                "description": "Parallel ensemble of 80 randomized decision trees capturing non-linear interactions."
            },
            {
                "key": "hist_gradient_boosting",
                "name": "HistGradientBoosting Regressor",
                "family": "Gradient Boosting",
                "description": "Histogram-binned gradient boosted decision trees optimized for tabular regression."
            },
            {
                "key": "extra_trees",
                "name": "Extra Trees Regressor",
                "family": "Extremely Randomized Trees",
                "description": "Randomized tree bagging ensemble with strong variance reduction."
            },
            {
                "key": "weighted_ensemble",
                "name": "Performance-Weighted Blending Ensemble",
                "family": "Optimized Blending",
                "description": "SLSQP MSE-optimized convex combination of out-of-fold base predictions."
            },
            {
                "key": "stacking_ensemble",
                "name": "Stacking Meta-Regressor",
                "family": "Stacking (Ridge Meta-Learner)",
                "description": "5-Fold Out-of-Fold meta-regressor learning non-linear weight corrections."
            }
        ],
        "metadata": service.metadata
    }

@router.get("/metrics")
def get_metrics(service: ModelService = Depends(get_model_service)):
    if not service.metrics:
        # Load from disk if available
        metrics_file = os.path.join(service.artifacts_dir, 'metrics.json')
        if os.path.exists(metrics_file):
            with open(metrics_file, 'r', encoding='utf-8') as f:
                service.metrics = json.load(f)
    return service.metrics

@router.post("/predict", response_model=PredictionResponse)
def predict_price(booking: BookingInput, service: ModelService = Depends(get_model_service)):
    try:
        response = service.predict_single(booking)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/predict/batch")
def predict_batch(bookings: List[BookingInput], service: ModelService = Depends(get_model_service)):
    try:
        results = [service.predict_single(b) for b in bookings]
        return {
            "total_processed": len(results),
            "predictions": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

@router.post("/scenario", response_model=ScenarioResponse)
def simulate_scenario(scenario: ScenarioRequest, service: ModelService = Depends(get_model_service)):
    try:
        return service.run_scenario_simulation(scenario)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@router.get("/feature-importance")
def get_feature_importance(service: ModelService = Depends(get_model_service)):
    return service.explainer.get_global_feature_importance()

@router.get("/dataset-info")
def get_dataset_info(service: ModelService = Depends(get_model_service)):
    return service.explainer.historical_data

@router.get("/eval-samples")
def get_eval_samples(service: ModelService = Depends(get_model_service)):
    eval_file = os.path.join(service.artifacts_dir, 'eval_results.json')
    if os.path.exists(eval_file):
        with open(eval_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"scatter_samples": [], "residual_distribution": []}

@router.get("/pricing-rules")
def get_pricing_rules(service: ModelService = Depends(get_model_service)):
    engine = service.pricing_engine
    return {
        "floor_price_eur": engine.floor_price,
        "ceiling_price_eur": engine.ceiling_price,
        "target_occupancy_pct": int(engine.target_occupancy * 100),
        "max_surge_pct": engine.max_surge_pct,
        "rules": [
            {"condition": "Occupancy > 90%", "action": "+22.5% Surge Multiplier", "category": "Demand Surge"},
            {"condition": "Occupancy between 70% and 90%", "action": "+5% to +20% Proportional Surge", "category": "Capacity Control"},
            {"condition": "Occupancy < 50%", "action": "-8% to -16% Discount Multiplier", "category": "Occupancy Stimulation"},
            {"condition": "Lead Time <= 2 Days", "action": "+14% Urgent Inelastic Surcharge", "category": "Horizon Premium"},
            {"condition": "Lead Time > 90 Days", "action": "-8% Early-Bird Advance Incentive", "category": "Early Guaranteed Pace"},
            {"condition": "Hard Floor / Ceiling", "action": "Bounds clamped to [€35, €650]", "category": "Margin & Brand Safety"}
        ]
    }
