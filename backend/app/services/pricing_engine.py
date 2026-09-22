"""
Dynamic Pricing Policy & Revenue Management Engine
Separates ML regression baseline from operational business rules and dynamic adjustments.
"""
from typing import Dict, Any, Tuple
import numpy as np

class DynamicPricingEngine:
    def __init__(
        self,
        floor_price: float = 35.0,
        ceiling_price: float = 650.0,
        target_occupancy: float = 0.70,
        max_surge_pct: float = 60.0
    ):
        self.floor_price = floor_price
        self.ceiling_price = ceiling_price
        self.target_occupancy = target_occupancy
        self.max_surge_pct = max_surge_pct

    def calculate_occupancy_multiplier(self, occupancy_rate: float) -> Tuple[float, str]:
        """
        Calculates dynamic multiplier based on current property occupancy.
        Target baseline: 70%.
        """
        occ = np.clip(occupancy_rate, 0.0, 1.0)
        if occ >= 0.90:
            mult = 1.0 + (occ - 0.70) * 0.90  # e.g., 0.95 -> 1.0 + 0.225 = 1.225 (+22.5%)
            status = "High Surge (Critical Occupancy)"
        elif occ >= 0.70:
            mult = 1.0 + (occ - 0.70) * 0.50  # e.g., 0.80 -> 1.0 + 0.05 = 1.05 (+5%)
            status = "Moderate Demand Surge"
        elif occ >= 0.50:
            mult = 1.0 - (0.70 - occ) * 0.30  # e.g., 0.55 -> 1.0 - 0.045 = 0.955 (-4.5%)
            status = "Standard Capacity"
        else:
            mult = 1.0 - (0.70 - occ) * 0.40  # e.g., 0.30 -> 1.0 - 0.16 = 0.84 (-16%)
            status = "Off-Peak Discounting"
        return round(float(mult), 4), status

    def calculate_lead_time_multiplier(self, lead_time_days: int) -> float:
        """
        Calculates urgency / booking window multiplier.
        """
        if lead_time_days <= 2:
            return 1.14  # +14% urgent last-minute
        elif lead_time_days <= 7:
            return 1.06  # +6% short horizon
        elif lead_time_days <= 30:
            return 1.00  # Baseline
        elif lead_time_days <= 90:
            return 0.96  # -4% standard discount
        else:
            return 0.92  # -8% early-bird incentive

    def calculate_season_multiplier(self, season: str) -> float:
        multipliers = {
            'Summer': 1.06,
            'Spring': 1.02,
            'Autumn': 0.98,
            'Winter': 0.94
        }
        return multipliers.get(season, 1.00)

    def compute_dynamic_recommendation(
        self,
        ml_base_price: float,
        occupancy_rate: float = 0.75,
        lead_time_days: int = 30,
        season: str = 'Summer',
        model_predictions: list = None
    ) -> Dict[str, Any]:
        """
        Executes dynamic revenue management policy over ML price prediction.
        """
        occ_mult, demand_status = self.calculate_occupancy_multiplier(occupancy_rate)
        lead_mult = self.calculate_lead_time_multiplier(lead_time_days)
        season_mult = self.calculate_season_multiplier(season)

        # Multiplicative compound adjustment
        raw_recommended = ml_base_price * occ_mult * lead_mult * season_mult

        # Enforce max surge constraint (+max_surge_pct)
        max_allowed_surge_price = ml_base_price * (1.0 + self.max_surge_pct / 100.0)
        raw_recommended = min(raw_recommended, max_allowed_surge_price)

        # Enforce operational bounds (Floor & Ceiling)
        clamped_recommended = max(self.floor_price, min(self.ceiling_price, raw_recommended))
        was_clamped = (clamped_recommended != raw_recommended)

        # Deltas
        occ_delta = (ml_base_price * occ_mult) - ml_base_price
        lead_delta = (ml_base_price * lead_mult) - ml_base_price
        season_delta = (ml_base_price * season_mult) - ml_base_price

        # Uncertainty bounds from model spread
        if model_predictions and len(model_predictions) > 1:
            std_dev = float(np.std(model_predictions))
            ci_low = max(self.floor_price, clamped_recommended - 1.645 * std_dev)
            ci_high = min(self.ceiling_price, clamped_recommended + 1.645 * std_dev)
        else:
            ci_low = clamped_recommended * 0.92
            ci_high = clamped_recommended * 1.08

        return {
            'ml_base_price': round(float(ml_base_price), 2),
            'occupancy_multiplier': round(float(occ_mult), 4),
            'occupancy_delta_eur': round(float(occ_delta), 2),
            'lead_time_multiplier': round(float(lead_mult), 4),
            'lead_time_delta_eur': round(float(lead_delta), 2),
            'season_multiplier': round(float(season_mult), 4),
            'season_delta_eur': round(float(season_delta), 2),
            'clamped': was_clamped,
            'floor_price': self.floor_price,
            'ceiling_price': self.ceiling_price,
            'recommended_dynamic_price': round(float(clamped_recommended), 2),
            'confidence_interval_low': round(float(ci_low), 2),
            'confidence_interval_high': round(float(ci_high), 2),
            'demand_status': demand_status
        }
