"""
Model Inference & Dynamic Pricing Service Singleton
Dynamic Hotel Pricing Management System
"""
import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, PROJECT_ROOT)

from ml.preprocessing.preprocessor import clean_and_engineer_features, ALL_FEATURE_COLUMNS, NUMERIC_FEATURES, CATEGORICAL_FEATURES
from ml.explainability.explainability import PricingExplainer
from backend.app.schemas import BookingInput, PredictionResponse, ModelPrediction, DynamicPricingBreakdown, ScenarioRequest, ScenarioResponse
from backend.app.services.pricing_engine import DynamicPricingEngine

class ModelService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, artifacts_dir: str = None):
        if self._initialized and self.is_loaded:
            return
        if artifacts_dir is None:
            artifacts_dir = os.path.join(PROJECT_ROOT, 'model_artifacts')
        self.artifacts_dir = artifacts_dir
        self.models = {}
        self.preprocessor = None
        self.weighted_config = {}
        self.metrics = {}
        self.metadata = {}
        self.pricing_engine = DynamicPricingEngine()
        self.explainer = PricingExplainer(artifacts_dir=artifacts_dir)
        self.is_loaded = False
        self.load_artifacts()
        self._initialized = True

    def load_artifacts(self):
        try:
            print(f"Loading ML model artifacts from {self.artifacts_dir}...")
            preprocessor_path = os.path.join(self.artifacts_dir, 'preprocessor.joblib')
            if os.path.exists(preprocessor_path):
                self.preprocessor = joblib.load(preprocessor_path)

            model_keys = ['baseline_ridge', 'random_forest', 'hist_gradient_boosting', 'extra_trees', 'stacking_meta_model']
            for k in model_keys:
                model_file = os.path.join(self.artifacts_dir, f"{k}.joblib")
                if os.path.exists(model_file):
                    self.models[k] = joblib.load(model_file)
                    print(f"  [OK] Loaded model: {k}")

            weighted_path = os.path.join(self.artifacts_dir, 'weighted_ensemble_config.json')
            if os.path.exists(weighted_path):
                with open(weighted_path, 'r', encoding='utf-8') as f:
                    self.weighted_config = json.load(f)

            metrics_path = os.path.join(self.artifacts_dir, 'metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r', encoding='utf-8') as f:
                    self.metrics = json.load(f)

            meta_path = os.path.join(self.artifacts_dir, 'metadata.json')
            if os.path.exists(meta_path):
                with open(meta_path, 'r', encoding='utf-8') as f:
                    self.metadata = json.load(f)

            self.is_loaded = (self.preprocessor is not None and len(self.models) >= 4)
            print(f"Model service ready: {self.is_loaded} (Loaded {len(self.models)} models)")
        except Exception as e:
            print(f"Error loading model artifacts: {e}")
            self.is_loaded = False

    def predict_single(self, booking: BookingInput) -> PredictionResponse:
        if not self.is_loaded:
            self.load_artifacts()
            if not self.is_loaded:
                raise RuntimeError("ML model artifacts are not loaded.")

        booking_dict = booking.model_dump()
        df_input = pd.DataFrame([booking_dict])

        df_proc = clean_and_engineer_features(df_input, is_training=False)
        X_features = df_proc[ALL_FEATURE_COLUMNS]
        X_trans = self.preprocessor.transform(X_features)

        pred_ridge = float(self.models['baseline_ridge'].predict(X_trans)[0])
        pred_rf = float(self.models['random_forest'].predict(X_trans)[0])
        pred_hgb = float(self.models['hist_gradient_boosting'].predict(X_trans)[0])
        pred_et = float(self.models['extra_trees'].predict(X_trans)[0])

        model_preds_list = [
            ModelPrediction(
                model_key="baseline_ridge",
                model_name="Ridge Linear Baseline",
                model_type="Linear L2 Regularized",
                predicted_adr=round(pred_ridge, 2)
            ),
            ModelPrediction(
                model_key="random_forest",
                model_name="Random Forest Regressor",
                model_type="Bagging Trees (80 Estimators)",
                predicted_adr=round(pred_rf, 2)
            ),
            ModelPrediction(
                model_key="hist_gradient_boosting",
                model_name="HistGradientBoosting Regressor",
                model_type="Gradient Tree Boosting",
                predicted_adr=round(pred_hgb, 2)
            ),
            ModelPrediction(
                model_key="extra_trees",
                model_name="Extra Trees Regressor",
                model_type="Extremely Randomized Trees",
                predicted_adr=round(pred_et, 2)
            )
        ]

        if 'stacking_meta_model' in self.models:
            X_meta = np.array([[pred_ridge, pred_rf, pred_hgb, pred_et]])
            stacking_adr = float(self.models['stacking_meta_model'].predict(X_meta)[0])
        else:
            stacking_adr = (pred_rf + pred_hgb + pred_et) / 3.0

        weights = self.weighted_config.get('weights', {
            'baseline_ridge': 0.0,
            'random_forest': 0.7122,
            'hist_gradient_boosting': 0.0161,
            'extra_trees': 0.2716
        })
        weighted_adr = (
            weights.get('baseline_ridge', 0.0) * pred_ridge +
            weights.get('random_forest', 0.7122) * pred_rf +
            weights.get('hist_gradient_boosting', 0.0161) * pred_hgb +
            weights.get('extra_trees', 0.2716) * pred_et
        )

        occupancy = booking.current_occupancy_rate or 0.75
        lead_time = booking.lead_time
        season = df_proc['season'].iloc[0]

        dynamic_breakdown = self.pricing_engine.compute_dynamic_recommendation(
            ml_base_price=weighted_adr,
            occupancy_rate=occupancy,
            lead_time_days=lead_time,
            season=season,
            model_predictions=[pred_ridge, pred_rf, pred_hgb, pred_et, stacking_adr]
        )

        explainability = self.explainer.explain_single_prediction(
            booking_input=df_proc.iloc[0].to_dict(),
            base_predicted_price=weighted_adr
        )

        return PredictionResponse(
            status="success",
            models=model_preds_list,
            ensemble_weighted_adr=round(weighted_adr, 2),
            ensemble_stacking_adr=round(stacking_adr, 2),
            final_recommended_price=dynamic_breakdown['recommended_dynamic_price'],
            dynamic_breakdown=DynamicPricingBreakdown(**dynamic_breakdown),
            explainability=explainability,
            input_summary={
                'hotel': booking.hotel,
                'room_type': booking.reserved_room_type,
                'season': season,
                'lead_time': lead_time,
                'occupancy_rate_pct': round(occupancy * 100, 1),
                'total_guests': booking.adults + booking.children + booking.babies
            }
        )

    def run_scenario_simulation(self, scenario: ScenarioRequest) -> ScenarioResponse:
        base_booking = scenario.base_booking
        occ_curve = []
        lt_curve = []
        room_curve = []

        for occ in scenario.occupancy_range:
            b_copy = base_booking.model_copy()
            b_copy.current_occupancy_rate = occ
            res = self.predict_single(b_copy)
            occ_curve.append({
                'occupancy_pct': int(occ * 100),
                'recommended_adr': res.final_recommended_price,
                'ml_base_adr': res.dynamic_breakdown.ml_base_price,
                'occupancy_multiplier': res.dynamic_breakdown.occupancy_multiplier,
                'status': res.dynamic_breakdown.demand_status
            })

        for lt in scenario.lead_time_range:
            b_copy = base_booking.model_copy()
            b_copy.lead_time = lt
            res = self.predict_single(b_copy)
            lt_curve.append({
                'lead_time_days': lt,
                'recommended_adr': res.final_recommended_price,
                'ml_base_adr': res.dynamic_breakdown.ml_base_price,
                'lead_multiplier': res.dynamic_breakdown.lead_time_multiplier
            })

        for r_type in ['A', 'B', 'C', 'D', 'E', 'F', 'G']:
            b_copy = base_booking.model_copy()
            b_copy.reserved_room_type = r_type
            res = self.predict_single(b_copy)
            room_curve.append({
                'room_type': r_type,
                'recommended_adr': res.final_recommended_price,
                'ml_base_adr': res.dynamic_breakdown.ml_base_price
            })

        return ScenarioResponse(
            occupancy_curve=occ_curve,
            lead_time_curve=lt_curve,
            room_type_comparison=room_curve
        )
