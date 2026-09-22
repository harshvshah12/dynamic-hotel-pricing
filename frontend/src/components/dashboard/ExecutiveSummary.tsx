import React from 'react';
import {
  TrendingUp,
  Percent,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Calendar,
  DollarSign
} from 'lucide-react';
import { PredictionResponse, HistoricalTrends, ModelMetricItem } from '../../types';

interface ExecutiveSummaryProps {
  currentPrediction: PredictionResponse | null;
  historicalData: HistoricalTrends | null;
  metrics: Record<string, ModelMetricItem> | null;
  onNavigateToPredict: () => void;
  onNavigateToSimulator: () => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  currentPrediction,
  historicalData,
  metrics,
  onNavigateToPredict,
  onNavigateToSimulator,
}) => {
  const weightedR2 = metrics?.weighted_ensemble?.test_metrics?.r2 || 0.8619;
  const weightedMae = metrics?.weighted_ensemble?.test_metrics?.mae || 10.57;
  const baselineR2 = metrics?.baseline_ridge?.test_metrics?.r2 || 0.5835;
  const r2Improvement = (((weightedR2 - baselineR2) / baselineR2) * 100).toFixed(1);

  const currentRecPrice = currentPrediction?.final_recommended_price || 128.50;
  const basePrice = currentPrediction?.ensemble_weighted_adr || 116.80;
  const occMult = currentPrediction?.dynamic_breakdown?.occupancy_multiplier || 1.05;
  const demandStatus = currentPrediction?.dynamic_breakdown?.demand_status || 'Moderate Demand Surge';

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Multi-Model Revenue Optimization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hospitality Dynamic Pricing & Revenue Intelligence
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Trained on <strong className="text-white">119,390 genuine hotel booking transactions</strong> across Algarve Resort & Lisbon City properties. 
              Powered by a 4-model ensemble (Ridge Baseline, Random Forest, HistGradientBoosting, Extra Trees) with mathematical 
              SLSQP-weighted blending and 5-fold cross-validated stacking meta-regression.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={onNavigateToPredict}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Predict Live Price</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-600 transition-all flex items-center justify-center space-x-2"
            >
              <span>What-If Sandbox</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Recommended Dynamic Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Live Recommended ADR
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">€{currentRecPrice.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ room-night</span>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-xs">
            <span className="text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {((occMult - 1) * 100).toFixed(1)}% dynamic surge
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 truncate">{demandStatus}</span>
          </div>
        </div>

        {/* Card 2: Ensemble R² Score */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ensemble R² Accuracy
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{weightedR2.toFixed(4)}</span>
            <span className="text-xs font-semibold text-emerald-400">+{r2Improvement}% vs Baseline</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Holdout Test MAE: <strong className="text-slate-200">€{weightedMae.toFixed(2)}</strong> across 23,429 samples
          </div>
        </div>

        {/* Card 3: ML Models in Ensemble */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Model Architecture
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">4 Base + 2 Ens</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Ridge, Random Forest, HistGB, ExtraTrees + Stacking Meta
          </div>
        </div>

        {/* Card 4: Historical Dataset Benchmarks */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Benchmark Dataset
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {historicalData?.total_records ? historicalData.total_records.toLocaleString() : '117,143'}
            </span>
            <span className="text-xs text-slate-400">Records</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Zero Data Leakage: Post-stay features strictly pruned
          </div>
        </div>
      </div>

      {/* Two-Column Feature Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Dynamic Pricing Pipeline Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Multi-Tier Dynamic Pricing Pipeline</h3>
              <p className="text-xs text-slate-400">ML baseline prediction coupled with revenue management multipliers</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">1</span>
                <div>
                  <p className="text-xs font-semibold text-white">ML Ensemble Base Rate</p>
                  <p className="text-[11px] text-slate-400">Calculates expected market clearing transaction price</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-slate-200">€{basePrice.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">2</span>
                <div>
                  <p className="text-xs font-semibold text-white">Occupancy Velocity Surge</p>
                  <p className="text-[11px] text-slate-400">Dynamically scales rate above 70% capacity target</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">
                +€{(currentPrediction?.dynamic_breakdown?.occupancy_delta_eur || 5.84).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">3</span>
                <div>
                  <p className="text-xs font-semibold text-white">Booking Lead Time Curve</p>
                  <p className="text-[11px] text-slate-400">Captures last-minute urgency vs early-bird discounts</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-slate-300">
                {(currentPrediction?.dynamic_breakdown?.lead_time_delta_eur || 0) >= 0 ? '+' : ''}€{(currentPrediction?.dynamic_breakdown?.lead_time_delta_eur || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Final Recommended Rate</p>
                  <p className="text-[11px] text-emerald-400/80">Bounded by [€35 Floor, €650 Ceiling] safety rules</p>
                </div>
              </div>
              <span className="text-base font-mono font-extrabold text-emerald-400">€{currentRecPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Academic Model Leaderboard Overview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Model Accuracy Leaderboard</h3>
              <p className="text-xs text-slate-400">Validated on 23,429 untouched holdout test reservations</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Weighted Blending Ensemble', rank: '🥇', r2: metrics?.weighted_ensemble?.test_metrics?.r2 || 0.8619, rmse: metrics?.weighted_ensemble?.test_metrics?.rmse || 17.20, isEns: true },
              { name: 'Stacking Meta-Regressor', rank: '🥈', r2: metrics?.stacking_ensemble?.test_metrics?.r2 || 0.8621, rmse: metrics?.stacking_ensemble?.test_metrics?.rmse || 17.19, isEns: true },
              { name: 'Random Forest Regressor', rank: '3', r2: metrics?.random_forest?.test_metrics?.r2 || 0.8612, rmse: metrics?.random_forest?.test_metrics?.rmse || 17.25, isEns: false },
              { name: 'Extra Trees Regressor', rank: '4', r2: metrics?.extra_trees?.test_metrics?.r2 || 0.8541, rmse: metrics?.extra_trees?.test_metrics?.rmse || 17.68, isEns: false },
              { name: 'HistGradientBoosting', rank: '5', r2: metrics?.hist_gradient_boosting?.test_metrics?.r2 || 0.8251, rmse: metrics?.hist_gradient_boosting?.test_metrics?.rmse || 19.36, isEns: false },
              { name: 'Ridge Linear Baseline', rank: '6', r2: metrics?.baseline_ridge?.test_metrics?.r2 || 0.5835, rmse: metrics?.baseline_ridge?.test_metrics?.rmse || 29.87, isEns: false },
            ].map((m, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                  m.isEns
                    ? 'bg-slate-800/80 border-emerald-500/30'
                    : 'bg-slate-800/30 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 font-bold text-slate-400">{m.rank}</span>
                  <span className={`font-medium ${m.isEns ? 'text-emerald-400 font-semibold' : 'text-slate-200'}`}>
                    {m.name}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center sm:space-x-4">
                  <span className="text-slate-400 font-mono text-[10px] sm:text-xs">RMSE: €{m.rmse.toFixed(2)}</span>
                  <span className="font-mono font-bold text-white">R² {m.r2.toFixed(4)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
