"""
Unit Tests for Dynamic Pricing Engine
"""
import pytest
from backend.app.services.pricing_engine import DynamicPricingEngine

def test_occupancy_multipliers():
    engine = DynamicPricingEngine()

    mult_high, status_high = engine.calculate_occupancy_multiplier(0.95)
    assert mult_high > 1.20
    assert "High Surge" in status_high

    mult_mid, status_mid = engine.calculate_occupancy_multiplier(0.70)
    assert mult_mid == 1.0

    mult_low, status_low = engine.calculate_occupancy_multiplier(0.40)
    assert mult_low < 1.0
    assert "Off-Peak" in status_low

def test_lead_time_multiplier():
    engine = DynamicPricingEngine()
    assert engine.calculate_lead_time_multiplier(1) == 1.14
    assert engine.calculate_lead_time_multiplier(20) == 1.00
    assert engine.calculate_lead_time_multiplier(120) == 0.92

def test_clamping_and_bounds():
    engine = DynamicPricingEngine(floor_price=40.0, ceiling_price=500.0, max_surge_pct=50.0)

    # Test extreme low base price clamping to floor
    rec_low = engine.compute_dynamic_recommendation(ml_base_price=20.0, occupancy_rate=0.30)
    assert rec_low['recommended_dynamic_price'] == 40.0
    assert rec_low['clamped'] is True

    # Test extreme high base price clamping to ceiling
    rec_high = engine.compute_dynamic_recommendation(ml_base_price=600.0, occupancy_rate=0.98)
    assert rec_high['recommended_dynamic_price'] == 500.0
    assert rec_high['clamped'] is True

def test_confidence_interval():
    engine = DynamicPricingEngine()
    rec = engine.compute_dynamic_recommendation(
        ml_base_price=100.0,
        occupancy_rate=0.75,
        model_predictions=[95.0, 100.0, 102.0, 98.0]
    )
    assert rec['confidence_interval_low'] < rec['recommended_dynamic_price']
    assert rec['confidence_interval_high'] > rec['recommended_dynamic_price']
