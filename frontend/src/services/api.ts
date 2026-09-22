import {
  BookingInput,
  PredictionResponse,
  ModelMetricItem,
  HistoricalTrends,
  ScatterSample,
  FeatureImportanceItem
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const apiService = {
  async checkHealth(): Promise<{ status: string; models_loaded: boolean; model_count: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'offline', models_loaded: false, model_count: 0 };
    }
  },

  async getMetrics(): Promise<Record<string, ModelMetricItem>> {
    const res = await fetch(`${API_BASE_URL}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch model metrics');
    return await res.json();
  },

  async predictPrice(booking: BookingInput): Promise<PredictionResponse> {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Prediction request failed' }));
      throw new Error(err.detail || 'Prediction failed');
    }
    return await res.json();
  },

  async runScenarioSimulation(baseBooking: BookingInput): Promise<{
    occupancy_curve: Array<{ occupancy_pct: number; recommended_adr: number; ml_base_adr: number; occupancy_multiplier: number; status: string }>;
    lead_time_curve: Array<{ lead_time_days: number; recommended_adr: number; ml_base_adr: number; lead_multiplier: number }>;
    room_type_comparison: Array<{ room_type: string; recommended_adr: number; ml_base_adr: number }>;
  }> {
    const res = await fetch(`${API_BASE_URL}/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_booking: baseBooking,
        occupancy_range: [0.20, 0.35, 0.50, 0.65, 0.75, 0.85, 0.95, 1.00],
        lead_time_range: [1, 3, 7, 14, 30, 60, 90, 120, 180]
      })
    });
    if (!res.ok) throw new Error('Scenario simulation failed');
    return await res.json();
  },

  async getFeatureImportance(): Promise<{
    top_feature_groups: FeatureImportanceItem[];
    detailed_encoded_features: Array<{ name: string; importance: number }>;
  }> {
    const res = await fetch(`${API_BASE_URL}/feature-importance`);
    if (!res.ok) throw new Error('Failed to fetch feature importance');
    return await res.json();
  },

  async getDatasetInfo(): Promise<HistoricalTrends> {
    const res = await fetch(`${API_BASE_URL}/dataset-info`);
    if (!res.ok) throw new Error('Failed to fetch dataset summary');
    return await res.json();
  },

  async getEvalSamples(): Promise<{
    scatter_samples: ScatterSample[];
    residual_distribution: Array<{ bin: string; count: number }>;
    error_summary: Record<string, number>;
  }> {
    const res = await fetch(`${API_BASE_URL}/eval-samples`);
    if (!res.ok) throw new Error('Failed to fetch evaluation samples');
    return await res.json();
  },

  async getPricingRules(): Promise<{
    floor_price_eur: number;
    ceiling_price_eur: number;
    target_occupancy_pct: number;
    max_surge_pct: number;
    rules: Array<{ condition: string; action: string; category: string }>;
  }> {
    const res = await fetch(`${API_BASE_URL}/pricing-rules`);
    if (!res.ok) throw new Error('Failed to fetch pricing rules');
    return await res.json();
  }
};
