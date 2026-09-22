"""
Integration Tests for FastAPI REST API Endpoints
"""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert "Dynamic Hotel Pricing" in data["message"]

def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["models_loaded"] is True
    assert data["model_count"] >= 4

def test_models_endpoint():
    resp = client.get("/api/models")
    assert resp.status_code == 200
    data = resp.json()
    assert "models" in data
    assert len(data["models"]) >= 4

def test_metrics_endpoint():
    resp = client.get("/api/metrics")
    assert resp.status_code == 200
    data = resp.json()
    assert "baseline_ridge" in data
    assert "random_forest" in data
    assert "hist_gradient_boosting" in data
    assert "weighted_ensemble" in data
    assert data["weighted_ensemble"]["test_metrics"]["r2"] > 0.80

def test_predict_endpoint():
    payload = {
        "hotel": "Resort Hotel",
        "reserved_room_type": "C",
        "meal": "HB",
        "arrival_date_month": "August",
        "arrival_date_week_number": 32,
        "arrival_date_day_of_month": 15,
        "lead_time": 10,
        "stays_in_weekend_nights": 2,
        "stays_in_week_nights": 5,
        "adults": 2,
        "children": 1,
        "babies": 0,
        "market_segment": "Direct",
        "distribution_channel": "Direct",
        "customer_type": "Transient",
        "current_occupancy_rate": 0.85
    }
    resp = client.post("/api/predict", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["final_recommended_price"] > 0
    assert len(data["models"]) == 4
    assert data["dynamic_breakdown"]["demand_status"] != ""

def test_batch_predict_endpoint():
    bookings = [
        {"hotel": "City Hotel", "reserved_room_type": "A", "lead_time": 5},
        {"hotel": "Resort Hotel", "reserved_room_type": "E", "lead_time": 45}
    ]
    resp = client.post("/api/predict/batch", json=bookings)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_processed"] == 2
    assert len(data["predictions"]) == 2

def test_scenario_endpoint():
    payload = {
        "base_booking": {
            "hotel": "City Hotel",
            "reserved_room_type": "A",
            "lead_time": 20
        },
        "occupancy_range": [0.4, 0.7, 0.9],
        "lead_time_range": [5, 30, 90]
    }
    resp = client.post("/api/scenario", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["occupancy_curve"]) == 3
    assert len(data["lead_time_curve"]) == 3

def test_feature_importance_endpoint():
    resp = client.get("/api/feature-importance")
    assert resp.status_code == 200
    data = resp.json()
    assert "top_feature_groups" in data

def test_dataset_info_endpoint():
    resp = client.get("/api/dataset-info")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_records"] > 100000

def test_pricing_rules_endpoint():
    resp = client.get("/api/pricing-rules")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["rules"]) >= 5
