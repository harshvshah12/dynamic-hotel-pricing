export interface BookingInput {
  hotel: string;
  reserved_room_type: string;
  meal: string;
  arrival_date_month: string;
  arrival_date_week_number: number;
  arrival_date_day_of_month: number;
  lead_time: number;
  stays_in_weekend_nights: number;
  stays_in_week_nights: number;
  adults: number;
  children: number;
  babies: number;
  market_segment: string;
  distribution_channel: string;
  customer_type: string;
  deposit_type: string;
  is_repeated_guest: number;
  previous_cancellations: number;
  previous_bookings_not_canceled: number;
  booking_changes: number;
  days_in_waiting_list: number;
  required_car_parking_spaces: number;
  total_of_special_requests: number;
  current_occupancy_rate: number;
  competitor_rate_index: number;
}

export interface ModelPrediction {
  model_key: string;
  model_name: string;
  model_type: string;
  predicted_adr: number;
  unit: string;
}

export interface DynamicPricingBreakdown {
  ml_base_price: number;
  occupancy_multiplier: number;
  occupancy_delta_eur: number;
  lead_time_multiplier: number;
  lead_time_delta_eur: number;
  season_multiplier: number;
  season_delta_eur: number;
  clamped: boolean;
  floor_price: number;
  ceiling_price: number;
  recommended_dynamic_price: number;
  confidence_interval_low: number;
  confidence_interval_high: number;
  demand_status: string;
}

export interface PricingFactor {
  feature: string;
  impact_eur: number;
  direction: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface ExplainabilityData {
  baseline_market_adr: number;
  predicted_base_adr: number;
  net_deviation_eur: number;
  top_contributing_factors: PricingFactor[];
  explanation_summary: string;
}

export interface PredictionResponse {
  status: string;
  models: ModelPrediction[];
  ensemble_weighted_adr: number;
  ensemble_stacking_adr: number;
  final_recommended_price: number;
  dynamic_breakdown: DynamicPricingBreakdown;
  explainability: ExplainabilityData;
  input_summary: Record<string, any>;
}

export interface ModelMetricItem {
  name: string;
  type: string;
  cv_metrics: Record<string, any>;
  test_metrics: {
    mae: number;
    rmse: number;
    r2: number;
    mape_pct: number;
    explained_variance: number;
    medae: number;
  };
}

export interface ScatterSample {
  id: number;
  actual_adr: number;
  ridge_pred: number;
  rf_pred: number;
  hgb_pred: number;
  et_pred: number;
  stacking_pred: number;
  weighted_pred: number;
  residual: number;
  lead_time: number;
  hotel: string;
  reserved_room_type: string;
  season: string;
}

export interface FeatureImportanceItem {
  feature: string;
  importance_pct: number;
  raw_score: number;
}

export interface HistoricalTrends {
  total_records: number;
  resort_records: number;
  city_records: number;
  overall_mean_adr: number;
  overall_median_adr: number;
  overall_min_adr: number;
  overall_max_adr: number;
  monthly_trends: Array<{
    month: string;
    month_num: number;
    resort_adr: number;
    city_adr: number;
    overall_adr: number;
  }>;
  room_type_distribution: Array<{
    room_type: string;
    avg_adr: number;
    count: number;
  }>;
  market_segment_distribution: Array<{
    segment: string;
    avg_adr: number;
    count: number;
  }>;
}
