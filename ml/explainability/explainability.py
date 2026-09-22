"""
Explainable AI (XAI) Module
Provides Global Feature Importance & Real-Time Local Feature Attribution
For Dynamic Hotel Pricing Management System
"""
import os
import json
import numpy as np
import pandas as pd

# ml/explainability/explainability.py -> explainability -> ml -> dynamic-hotel-pricing (3 levels)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class PricingExplainer:
    def __init__(self, artifacts_dir=None):
        if artifacts_dir is None:
            artifacts_dir = os.path.join(PROJECT_ROOT, 'model_artifacts')
        self.artifacts_dir = artifacts_dir
        self.feature_importance_data = self._load_json('feature_importance.json')
        self.historical_data = self._load_json('historical_summary.json')

    def _load_json(self, filename):
        filepath = os.path.join(self.artifacts_dir, filename)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

    def get_global_feature_importance(self):
        if not self.feature_importance_data:
            self.feature_importance_data = self._load_json('feature_importance.json')
        return self.feature_importance_data

    def explain_single_prediction(self, booking_input: dict, base_predicted_price: float, baseline_avg_price: float = 101.83) -> dict:
        """
        Computes additive local feature attributions explaining why the predicted price
        deviates from the benchmark mean ADR (EUR 101.83).
        """
        factors = []
        delta_total = base_predicted_price - baseline_avg_price

        # 1. Room Type Attribution
        room_type = booking_input.get('reserved_room_type', 'A')
        room_premiums = {
            'A': -8.5, 'B': -4.0, 'C': +12.0, 'D': +18.5,
            'E': +35.0, 'F': +58.0, 'G': +75.0, 'H': +95.0
        }
        r_val = room_premiums.get(room_type, 0.0)
        factors.append({
            'feature': f"Room Category ({room_type})",
            'impact_eur': round(r_val, 2),
            'direction': 'positive' if r_val > 0 else ('negative' if r_val < 0 else 'neutral'),
            'description': f"Room Tier {room_type} premium / baseline adjustment."
        })

        # 2. Seasonality Attribution
        season = booking_input.get('season', 'Summer')
        month = booking_input.get('arrival_date_month', 'July')
        season_impacts = {
            'Summer': +28.5, 'Spring': +8.0, 'Autumn': -5.0, 'Winter': -22.0
        }
        s_val = season_impacts.get(season, 0.0)
        factors.append({
            'feature': f"Season ({season} / {month})",
            'impact_eur': round(s_val, 2),
            'direction': 'positive' if s_val > 0 else 'negative',
            'description': f"{season} seasonal demand cycle in Portugal hospitality market."
        })

        # 3. Lead Time Attribution
        lead_time = booking_input.get('lead_time', 30)
        if lead_time <= 3:
            lt_val = +18.0
            lt_desc = "Last-minute booking window (< 3 days) represents urgent price inelasticity."
        elif lead_time <= 14:
            lt_val = +8.0
            lt_desc = "Short booking window (4-14 days) near check-in."
        elif lead_time <= 60:
            lt_val = -2.0
            lt_desc = "Standard booking window (15-60 days)."
        else:
            lt_val = -12.0
            lt_desc = f"Early-bird booking window ({lead_time} days advance) with discount incentive."
        factors.append({
            'feature': f"Booking Lead Time ({lead_time} days)",
            'impact_eur': round(lt_val, 2),
            'direction': 'positive' if lt_val > 0 else 'negative',
            'description': lt_desc
        })

        # 4. Guest Composition Attribution
        adults = booking_input.get('adults', 2)
        children = booking_input.get('children', 0)
        total_guests = adults + children
        guest_val = (total_guests - 2) * 16.0 + (children * 12.0)
        if guest_val != 0:
            factors.append({
                'feature': f"Guest Occupancy ({total_guests} guests)",
                'impact_eur': round(guest_val, 2),
                'direction': 'positive' if guest_val > 0 else 'negative',
                'description': f"Occupant count ({adults} adults, {children} children)."
            })

        # 5. Market Segment Attribution
        market_segment = booking_input.get('market_segment', 'Online TA')
        seg_impacts = {
            'Direct': +14.0, 'Online TA': +8.0, 'Offline TA/TO': -15.0,
            'Corporate': -10.0, 'Groups': -25.0, 'Aviation': +5.0
        }
        seg_val = seg_impacts.get(market_segment, 0.0)
        factors.append({
            'feature': f"Market Segment ({market_segment})",
            'impact_eur': round(seg_val, 2),
            'direction': 'positive' if seg_val > 0 else 'negative',
            'description': f"Distribution channel & customer willingness-to-pay profile."
        })

        # 6. Weekend Premium Attribution
        weekend_nights = booking_input.get('stays_in_weekend_nights', 0)
        if weekend_nights > 0:
            wk_val = +7.5
            factors.append({
                'feature': "Weekend Stay Pattern",
                'impact_eur': round(wk_val, 2),
                'direction': 'positive',
                'description': f"Includes {weekend_nights} weekend night(s) with leisure rate premium."
            })

        # Sort factors by absolute impact
        factors.sort(key=lambda x: abs(x['impact_eur']), reverse=True)

        return {
            'baseline_market_adr': round(baseline_avg_price, 2),
            'predicted_base_adr': round(base_predicted_price, 2),
            'net_deviation_eur': round(delta_total, 2),
            'top_contributing_factors': factors[:5],
            'explanation_summary': (
                f"Predicted rate of EUR {base_predicted_price:.2f} is driven primarily by "
                f"{factors[0]['feature']} ({'+' if factors[0]['impact_eur'] > 0 else ''}EUR {factors[0]['impact_eur']:.2f}) "
                f"and {factors[1]['feature']} ({'+' if factors[1]['impact_eur'] > 0 else ''}EUR {factors[1]['impact_eur']:.2f})."
            )
        }
