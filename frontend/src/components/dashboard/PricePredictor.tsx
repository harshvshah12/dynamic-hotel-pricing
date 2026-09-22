import React, { useState } from 'react';
import {
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Info,
  Calendar,
  Users,
  Building,
  RefreshCw,
  Award
} from 'lucide-react';
import { BookingInput, PredictionResponse } from '../../types';

interface PricePredictorProps {
  prediction: PredictionResponse | null;
  isLoading: boolean;
  onPredict: (booking: BookingInput) => void;
  selectedHotel: string;
}

export const PricePredictor: React.FC<PricePredictorProps> = ({
  prediction,
  isLoading,
  onPredict,
  selectedHotel,
}) => {
  const [formData, setFormData] = useState<BookingInput>({
    hotel: selectedHotel,
    reserved_room_type: 'A',
    meal: 'BB',
    arrival_date_month: 'July',
    arrival_date_week_number: 28,
    arrival_date_day_of_month: 15,
    lead_time: 30,
    stays_in_weekend_nights: 1,
    stays_in_week_nights: 3,
    adults: 2,
    children: 0,
    babies: 0,
    market_segment: 'Online TA',
    distribution_channel: 'TA/TO',
    customer_type: 'Transient',
    deposit_type: 'No Deposit',
    is_repeated_guest: 0,
    previous_cancellations: 0,
    previous_bookings_not_canceled: 0,
    booking_changes: 0,
    days_in_waiting_list: 0,
    required_car_parking_spaces: 0,
    total_of_special_requests: 1,
    current_occupancy_rate: 0.80,
    competitor_rate_index: 1.0,
  });

  const handleChange = (field: keyof BookingInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict({ ...formData, hotel: selectedHotel });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Interactive Booking Input Form (5 cols) */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Building className="w-5 h-5 text-emerald-400" />
              <span>Quote Configuration</span>
            </h2>
            <p className="text-xs text-slate-400">Configure reservation attributes for dynamic price quoting</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 text-emerald-400 border border-emerald-500/30">
            {selectedHotel}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Room Tier & Meal Plan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Room Category</label>
              <select
                value={formData.reserved_room_type}
                onChange={(e) => handleChange('reserved_room_type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="A">Tier A (Standard Standard)</option>
                <option value="B">Tier B (Standard Superior)</option>
                <option value="C">Tier C (Deluxe Double)</option>
                <option value="D">Tier D (Executive Suite)</option>
                <option value="E">Tier E (Family Penthouse)</option>
                <option value="F">Tier F (Presidential Suite)</option>
                <option value="G">Tier G (Royal Villa)</option>
                <option value="H">Tier H (Luxury Penthouse)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meal Package</label>
              <select
                value={formData.meal}
                onChange={(e) => handleChange('meal', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="BB">Bed & Breakfast (BB)</option>
                <option value="HB">Half Board (HB)</option>
                <option value="FB">Full Board (FB)</option>
                <option value="SC">Self Catering (SC)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Arrival Month & Day */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Arrival Month</label>
              <select
                value={formData.arrival_date_month}
                onChange={(e) => handleChange('arrival_date_month', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Arrival Day (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.arrival_date_day_of_month}
                onChange={(e) => handleChange('arrival_date_day_of_month', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Row 3: Lead Time Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Booking Lead Time</label>
              <span className="font-mono font-bold text-emerald-400">{formData.lead_time} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={formData.lead_time}
              onChange={(e) => handleChange('lead_time', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0d (Same-day)</span>
              <span>30d (Standard)</span>
              <span>200d (Early Bird)</span>
            </div>
          </div>

          {/* Row 4: Property Occupancy Level */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Current Property Occupancy</label>
              <span className="font-mono font-bold text-emerald-400">
                {(formData.current_occupancy_rate * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.20"
              max="1.00"
              step="0.05"
              value={formData.current_occupancy_rate}
              onChange={(e) => handleChange('current_occupancy_rate', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>20% (Low)</span>
              <span>70% (Target Baseline)</span>
              <span>100% (Full Surge)</span>
            </div>
          </div>

          {/* Row 5: Stay Length (Weekend & Weekdays) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Weekend Nights</label>
              <input
                type="number"
                min="0"
                max="7"
                value={formData.stays_in_weekend_nights}
                onChange={(e) => handleChange('stays_in_weekend_nights', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Weekday Nights</label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.stays_in_week_nights}
                onChange={(e) => handleChange('stays_in_week_nights', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Row 6: Guest Composition */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Adults</label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.adults}
                onChange={(e) => handleChange('adults', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Children</label>
              <input
                type="number"
                min="0"
                max="4"
                value={formData.children}
                onChange={(e) => handleChange('children', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Special Req</label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.total_of_special_requests}
                onChange={(e) => handleChange('total_of_special_requests', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Row 7: Market Segment & Customer Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Market Segment</label>
              <select
                value={formData.market_segment}
                onChange={(e) => handleChange('market_segment', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Online TA">Online TA (Booking.com/Expedia)</option>
                <option value="Direct">Direct Hotel Website</option>
                <option value="Corporate">Corporate Account</option>
                <option value="Offline TA/TO">Offline Tour Operator</option>
                <option value="Groups">Group Contracting</option>
                <option value="Aviation">Aviation Crew</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Type</label>
              <select
                value={formData.customer_type}
                onChange={(e) => handleChange('customer_type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Transient">Transient (Individual)</option>
                <option value="Contract">Contractual Rate</option>
                <option value="Transient-Party">Transient-Party</option>
                <option value="Group">Group</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Multi-Model Inference...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Ensemble Price Prediction</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right: Multi-Model Predictions & Dynamic Breakdown (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Hero Recommended Price Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-2 border-emerald-500/40 p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4" />
                <span>Recommended Dynamic ADR</span>
              </span>
              <div className="mt-1 flex items-baseline space-x-3">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  €{prediction ? prediction.final_recommended_price.toFixed(2) : '128.50'}
                </span>
                <span className="text-sm text-slate-400 font-medium">/ night</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-right">
              <span className="text-[11px] text-slate-400 block font-medium">90% Confidence Interval</span>
              <span className="text-sm font-mono font-bold text-emerald-300">
                €{prediction?.dynamic_breakdown ? prediction.dynamic_breakdown.confidence_interval_low.toFixed(2) : '118.20'} – €{prediction?.dynamic_breakdown ? prediction.dynamic_breakdown.confidence_interval_high.toFixed(2) : '138.80'}
              </span>
            </div>
          </div>

          {/* Dynamic Policy Multiplier Breakdown */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Ensemble ML Base</span>
              <span className="text-sm font-mono font-bold text-white">
                €{prediction ? prediction.ensemble_weighted_adr.toFixed(2) : '116.80'}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Occupancy Multiplier</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                x{prediction ? prediction.dynamic_breakdown.occupancy_multiplier.toFixed(3) : '1.050'}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Lead Time Multiplier</span>
              <span className="text-sm font-mono font-bold text-blue-400">
                x{prediction ? prediction.dynamic_breakdown.lead_time_multiplier.toFixed(3) : '1.000'}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Operational Bounds</span>
              <span className="text-xs font-mono font-semibold text-slate-300">
                [€35 – €650]
              </span>
            </div>
          </div>
        </div>

        {/* 4-Model Predictions Grid */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Independent Model Predictions</span>
            </h3>
            <span className="text-xs text-slate-400">All 4 models evaluated simultaneously</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prediction?.models?.map((m) => (
              <div
                key={m.model_key}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 hover:border-slate-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">{m.model_name}</span>
                  <span className="text-xs text-slate-500 font-mono">{m.model_type}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-mono font-extrabold text-white">€{m.predicted_adr.toFixed(2)}</span>
                  <span className="text-[11px] text-slate-400">
                    Δ {((m.predicted_adr - (prediction.ensemble_weighted_adr || 116.8)) >= 0 ? '+' : '')}
                    {(m.predicted_adr - (prediction.ensemble_weighted_adr || 116.8)).toFixed(2)} vs Ens
                  </span>
                </div>
              </div>
            )) || (
              <>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold">
                    <span>Ridge Linear Baseline</span>
                    <span className="text-slate-500">Linear L2</span>
                  </div>
                  <div className="mt-2 text-xl font-mono font-bold text-white">€112.40</div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold">
                    <span>Random Forest Regressor</span>
                    <span className="text-slate-500">Bagging Trees</span>
                  </div>
                  <div className="mt-2 text-xl font-mono font-bold text-white">€118.20</div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold">
                    <span>HistGradientBoosting</span>
                    <span className="text-slate-500">Gradient Boosting</span>
                  </div>
                  <div className="mt-2 text-xl font-mono font-bold text-white">€116.90</div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold">
                    <span>Extra Trees Regressor</span>
                    <span className="text-slate-500">Randomized Trees</span>
                  </div>
                  <div className="mt-2 text-xl font-mono font-bold text-white">€117.50</div>
                </div>
              </>
            )}
          </div>

          {/* Ensembles Comparison Footer */}
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
              <span className="text-emerald-400 font-bold block">Weighted Blending Ensemble (Selected)</span>
              <span className="text-lg font-mono font-extrabold text-white">
                €{prediction ? prediction.ensemble_weighted_adr.toFixed(2) : '116.80'}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">SLSQP MSE-Optimized weights</span>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <span className="text-blue-400 font-bold block">Stacking Meta-Regressor</span>
              <span className="text-lg font-mono font-extrabold text-white">
                €{prediction ? prediction.ensemble_stacking_adr.toFixed(2) : '116.65'}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">5-Fold OOF Ridge Meta-Learner</span>
            </div>
          </div>
        </div>

        {/* NEW: Explainability & Calculation Verification */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Decision Explainability & Verification</span>
            </h3>
            <span className="text-xs text-slate-400">Step-by-step math breakdown</span>
          </div>
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-slate-400">1. Base Ensemble ADR (ML Output)</span>
              <span className="font-bold text-white">€{prediction ? prediction.ensemble_weighted_adr.toFixed(2) : '116.80'}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-slate-400">2. Occupancy Multiplier ({formData.current_occupancy_rate * 100}% occupancy)</span>
              <span className="text-emerald-400 font-bold">× {prediction ? prediction.dynamic_breakdown.occupancy_multiplier.toFixed(3) : '1.050'}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-slate-400">3. Lead Time Multiplier ({formData.lead_time} days)</span>
              <span className="text-blue-400 font-bold">× {prediction ? prediction.dynamic_breakdown.lead_time_multiplier.toFixed(3) : '1.000'}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-slate-400">4. Calculated Unbounded Price (1 × 2 × 3)</span>
              <span className="font-bold text-slate-200">€{prediction ? prediction.dynamic_breakdown.unbounded_price.toFixed(2) : '122.64'}</span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-purple-400 font-bold">5. Final Constrained Price (Clamped)</span>
              <span className="font-bold text-purple-300 text-sm">€{prediction ? prediction.final_recommended_price.toFixed(2) : '122.64'}</span>
            </div>
            
            {(prediction?.dynamic_breakdown.is_clamped_to_floor || prediction?.dynamic_breakdown.is_clamped_to_ceiling || prediction?.dynamic_breakdown.surge_capped) && (
              <div className="mt-2 bg-amber-500/10 text-amber-400 p-2 rounded border border-amber-500/20 text-[10px]">
                <strong>Rule Applied:</strong> 
                {prediction.dynamic_breakdown.is_clamped_to_floor && ' Price was raised to meet the minimum floor threshold.'}
                {prediction.dynamic_breakdown.is_clamped_to_ceiling && ' Price was reduced to respect the maximum ceiling threshold.'}
                {prediction.dynamic_breakdown.surge_capped && ' Maximum daily surge limit (+60%) was applied.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
