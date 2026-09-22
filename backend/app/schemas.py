"""
Pydantic Schemas for Dynamic Hotel Pricing API
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class BookingInput(BaseModel):
    hotel: str = Field(default="City Hotel", description="Property type: 'City Hotel' or 'Resort Hotel'")
    reserved_room_type: str = Field(default="A", description="Room Category: 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'")
    meal: str = Field(default="BB", description="Meal Plan: 'BB' (Bed & Breakfast), 'HB' (Half Board), 'FB' (Full Board), 'SC' (Self Catering)")
    arrival_date_month: str = Field(default="July", description="Arrival Month: 'January' to 'December'")
    arrival_date_week_number: int = Field(default=28, ge=1, le=53, description="Calendar week number (1-53)")
    arrival_date_day_of_month: int = Field(default=15, ge=1, le=31, description="Day of arrival (1-31)")
    lead_time: int = Field(default=30, ge=0, le=730, description="Lead time in days before check-in")
    stays_in_weekend_nights: int = Field(default=1, ge=0, le=14, description="Weekend nights")
    stays_in_week_nights: int = Field(default=2, ge=0, le=30, description="Weekday nights")
    adults: int = Field(default=2, ge=1, le=10, description="Number of adults")
    children: int = Field(default=0, ge=0, le=10, description="Number of children")
    babies: int = Field(default=0, ge=0, le=5, description="Number of babies")
    market_segment: str = Field(default="Online TA", description="Market segment: 'Direct', 'Online TA', 'Offline TA/TO', 'Corporate', 'Groups', 'Aviation'")
    distribution_channel: str = Field(default="TA/TO", description="Distribution channel: 'Direct', 'TA/TO', 'Corporate', 'GDS'")
    customer_type: str = Field(default="Transient", description="Customer Type: 'Transient', 'Contract', 'Transient-Party', 'Group'")
    deposit_type: str = Field(default="No Deposit", description="Deposit: 'No Deposit', 'Non Refund', 'Refundable'")
    is_repeated_guest: int = Field(default=0, ge=0, le=1, description="1 if repeated guest, 0 otherwise")
    previous_cancellations: int = Field(default=0, ge=0, description="Previous cancellations")
    previous_bookings_not_canceled: int = Field(default=0, ge=0, description="Previous completed bookings")
    booking_changes: int = Field(default=0, ge=0, description="Booking amendments")
    days_in_waiting_list: int = Field(default=0, ge=0, description="Days in waitlist")
    required_car_parking_spaces: int = Field(default=0, ge=0, le=5, description="Parking spaces requested")
    total_of_special_requests: int = Field(default=1, ge=0, le=5, description="Special requests count")
    # Dynamic context inputs
    current_occupancy_rate: Optional[float] = Field(default=0.75, ge=0.0, le=1.0, description="Current property occupancy rate (0.0 to 1.0)")
    competitor_rate_index: Optional[float] = Field(default=1.0, ge=0.5, le=2.0, description="Competitor price index multiplier")

class ModelPrediction(BaseModel):
    model_key: str
    model_name: str
    model_type: str
    predicted_adr: float
    unit: str = "EUR"

class PricingFactor(BaseModel):
    feature: str
    impact_eur: float
    direction: str
    description: str

class DynamicPricingBreakdown(BaseModel):
    ml_base_price: float
    occupancy_multiplier: float
    occupancy_delta_eur: float
    lead_time_multiplier: float
    lead_time_delta_eur: float
    season_multiplier: float
    season_delta_eur: float
    clamped: bool
    floor_price: float
    ceiling_price: float
    recommended_dynamic_price: float
    confidence_interval_low: float
    confidence_interval_high: float
    demand_status: str

class PredictionResponse(BaseModel):
    status: str = "success"
    models: List[ModelPrediction]
    ensemble_weighted_adr: float
    ensemble_stacking_adr: float
    final_recommended_price: float
    dynamic_breakdown: DynamicPricingBreakdown
    explainability: Dict[str, Any]
    input_summary: Dict[str, Any]

class ScenarioRequest(BaseModel):
    base_booking: BookingInput
    occupancy_range: List[float] = Field(default=[0.30, 0.50, 0.70, 0.85, 0.95], description="Occupancy steps for sensitivity analysis")
    lead_time_range: List[int] = Field(default=[1, 7, 14, 30, 60, 90, 180], description="Lead time steps in days")

class ScenarioResponse(BaseModel):
    occupancy_curve: List[Dict[str, Any]]
    lead_time_curve: List[Dict[str, Any]]
    room_type_comparison: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    models_loaded: bool
    model_count: int
    artifacts_ready: bool
