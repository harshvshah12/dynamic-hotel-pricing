# REST API Documentation
# Dynamic Hotel Pricing Management System

Interactive Swagger OpenAPI UI: `http://127.0.0.1:8000/docs`  
Alternative ReDoc UI: `http://127.0.0.1:8000/redoc`

---

## Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API root & service discovery |
| `GET` | `/api/health` | Service health & loaded model count |
| `GET` | `/api/models` | List all registered model architectures |
| `GET` | `/api/metrics` | Holdout & CV evaluation metrics |
| `POST` | `/api/predict` | Real-time single quote prediction + dynamic policy + XAI |
| `POST` | `/api/predict/batch` | Batch quote predictions for multiple bookings |
| `POST` | `/api/scenario` | Interactive what-if sensitivity curves |
| `GET` | `/api/feature-importance` | Global feature importance rankings |
| `GET` | `/api/dataset-info` | Historical benchmark summaries & distributions |
| `GET` | `/api/eval-samples` | 400 holdout scatter sample points & residual histogram |
| `GET` | `/api/pricing-rules` | Operational guardrails & active surge rules |

---

## 1. Single Price Prediction

### Request: `POST /api/predict`
```json
{
  "hotel": "City Hotel",
  "reserved_room_type": "D",
  "meal": "BB",
  "arrival_date_month": "July",
  "arrival_date_week_number": 28,
  "arrival_date_day_of_month": 15,
  "lead_time": 30,
  "stays_in_weekend_nights": 1,
  "stays_in_week_nights": 3,
  "adults": 2,
  "children": 0,
  "babies": 0,
  "market_segment": "Online TA",
  "distribution_channel": "TA/TO",
  "customer_type": "Transient",
  "deposit_type": "No Deposit",
  "is_repeated_guest": 0,
  "previous_cancellations": 0,
  "previous_bookings_not_canceled": 0,
  "booking_changes": 0,
  "days_in_waiting_list": 0,
  "required_car_parking_spaces": 0,
  "total_of_special_requests": 1,
  "current_occupancy_rate": 0.80,
  "competitor_rate_index": 1.0
}
```

### Response: `200 OK`
```json
{
  "status": "success",
  "models": [
    {
      "model_key": "baseline_ridge",
      "model_name": "Ridge Linear Baseline",
      "model_type": "Linear L2 Regularized",
      "predicted_adr": 125.40,
      "unit": "EUR"
    },
    {
      "model_key": "random_forest",
      "model_name": "Random Forest Regressor",
      "model_type": "Bagging Trees (80 Estimators)",
      "predicted_adr": 138.20,
      "unit": "EUR"
    },
    {
      "model_key": "hist_gradient_boosting",
      "model_name": "HistGradientBoosting Regressor",
      "model_type": "Gradient Tree Boosting",
      "predicted_adr": 136.90,
      "unit": "EUR"
    },
    {
      "model_key": "extra_trees",
      "model_name": "Extra Trees Regressor",
      "model_type": "Extremely Randomized Trees",
      "predicted_adr": 137.50,
      "unit": "EUR"
    }
  ],
  "ensemble_weighted_adr": 137.85,
  "ensemble_stacking_adr": 137.70,
  "final_recommended_price": 144.74,
  "dynamic_breakdown": {
    "ml_base_price": 137.85,
    "occupancy_multiplier": 1.0500,
    "occupancy_delta_eur": 6.89,
    "lead_time_multiplier": 1.0000,
    "lead_time_delta_eur": 0.00,
    "season_multiplier": 1.0600,
    "season_delta_eur": 8.27,
    "clamped": false,
    "floor_price": 35.0,
    "ceiling_price": 650.0,
    "recommended_dynamic_price": 144.74,
    "confidence_interval_low": 133.20,
    "confidence_interval_high": 156.28,
    "demand_status": "Moderate Demand Surge"
  },
  "explainability": {
    "baseline_market_adr": 101.83,
    "predicted_base_adr": 137.85,
    "net_deviation_eur": 36.02,
    "top_contributing_factors": [
      {
        "feature": "Season (Summer / July)",
        "impact_eur": 28.50,
        "direction": "positive",
        "description": "Peak summer leisure demand period in Portugal."
      },
      {
        "feature": "Room Category (D)",
        "impact_eur": 18.50,
        "direction": "positive",
        "description": "Room Tier D premium adjustment."
      }
    ],
    "explanation_summary": "Predicted rate of EUR 137.85 is driven primarily by Season (Summer / July) (+EUR 28.50) and Room Category (D) (+EUR 18.50)."
  },
  "input_summary": {
    "hotel": "City Hotel",
    "room_type": "D",
    "season": "Summer",
    "lead_time": 30,
    "occupancy_rate_pct": 80.0,
    "total_guests": 2
  }
}
```

---

## 2. Scenario Simulation

### Request: `POST /api/scenario`
```json
{
  "base_booking": {
    "hotel": "City Hotel",
    "reserved_room_type": "A",
    "lead_time": 30
  },
  "occupancy_range": [0.30, 0.50, 0.70, 0.85, 0.95],
  "lead_time_range": [1, 7, 14, 30, 60, 90, 180]
}
```

### Response: `200 OK`
Returns `occupancy_curve`, `lead_time_curve`, and `room_type_comparison` arrays with continuous elasticity values.
