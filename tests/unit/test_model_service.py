"""
Unit Tests for Model Service and Inference
"""
import pytest
from backend.app.services.model_service import ModelService
from backend.app.schemas import BookingInput, ScenarioRequest

def test_model_service_loading():
    service = ModelService()
    assert service.is_loaded is True
    assert len(service.models) >= 4
    assert 'baseline_ridge' in service.models
    assert 'random_forest' in service.models
    assert 'hist_gradient_boosting' in service.models
    assert 'extra_trees' in service.models

def test_predict_single():
    service = ModelService()
    booking = BookingInput(
        hotel="City Hotel",
        reserved_room_type="A",
        meal="BB",
        arrival_date_month="July",
        lead_time=45,
        adults=2,
        children=0,
        market_segment="Online TA",
        current_occupancy_rate=0.80
    )
    res = service.predict_single(booking)
    assert res.status == "success"
    assert len(res.models) == 4
    assert res.final_recommended_price > 30.0
    assert res.ensemble_weighted_adr > 0.0
    assert res.dynamic_breakdown.occupancy_multiplier >= 1.0
    assert "top_contributing_factors" in res.explainability

def test_scenario_simulation():
    service = ModelService()
    booking = BookingInput(hotel="Resort Hotel", reserved_room_type="D", lead_time=15)
    scenario = ScenarioRequest(
        base_booking=booking,
        occupancy_range=[0.40, 0.70, 0.90],
        lead_time_range=[2, 30, 90]
    )
    res = service.run_scenario_simulation(scenario)
    assert len(res.occupancy_curve) == 3
    assert len(res.lead_time_curve) == 3
    assert len(res.room_type_comparison) == 7
    # Higher occupancy should lead to higher recommended ADR
    assert res.occupancy_curve[2]['recommended_adr'] > res.occupancy_curve[0]['recommended_adr']
