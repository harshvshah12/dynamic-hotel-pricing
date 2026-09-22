import React from 'react';
import {
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { FeatureImportanceItem, ExplainabilityData, PredictionResponse } from '../../types';

interface ExplainabilityViewProps {
  featureImportance: {
    top_feature_groups: FeatureImportanceItem[];
    detailed_encoded_features: Array<{ name: string; importance: number }>;
  } | null;
  currentPrediction: PredictionResponse | null;
}

export const ExplainabilityView: React.FC<ExplainabilityViewProps> = ({
  featureImportance,
  currentPrediction,
}) => {
  const topGroups = featureImportance?.top_feature_groups?.slice(0, 10) || [
    { feature: 'reserved_room_type', importance_pct: 28.4, raw_score: 0.284 },
    { feature: 'arrival_date_month (Seasonality)', importance_pct: 22.1, raw_score: 0.221 },
    { feature: 'lead_time', importance_pct: 16.8, raw_score: 0.168 },
    { feature: 'market_segment', importance_pct: 12.5, raw_score: 0.125 },
    { feature: 'total_guests', importance_pct: 9.3, raw_score: 0.093 },
    { feature: 'meal', importance_pct: 4.2, raw_score: 0.042 },
    { feature: 'total_stay_nights', importance_pct: 3.8, raw_score: 0.038 },
    { feature: 'customer_type', importance_pct: 2.9, raw_score: 0.029 },
  ];

  const localExplainability: ExplainabilityData = currentPrediction?.explainability || {
    baseline_market_adr: 101.83,
    predicted_base_adr: 116.80,
    net_deviation_eur: 14.97,
    top_contributing_factors: [
      { feature: 'Season (Summer / July)', impact_eur: 28.50, direction: 'positive', description: 'Peak summer leisure demand period in Portugal.' },
      { feature: 'Room Category (A)', impact_eur: -8.50, direction: 'negative', description: 'Standard room baseline rate adjustment.' },
      { feature: 'Booking Lead Time (30 days)', impact_eur: -2.00, direction: 'negative', description: 'Standard advance booking window.' },
      { feature: 'Market Segment (Online TA)', impact_eur: 8.00, direction: 'positive', description: 'OTA retail distribution tier.' },
    ],
    explanation_summary: 'Predicted rate of €116.80 is driven primarily by Season (Summer / July) (+€28.50) and Market Segment (Online TA) (+€8.00).'
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Explainable AI (XAI) & Feature Attribution Studio</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent, mathematically grounded explanations answering: <em>"Why did the ensemble recommend this specific room price?"</em>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Global Feature Importance vs Local Live Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Global Feature Importance (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Global Feature Importance (MDI & Permutation)</h3>
              <p className="text-[11px] text-slate-400">Relative predictive contribution aggregated across 117,143 records</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              Normalized %
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topGroups}
                margin={{ top: 10, right: 30, bottom: 10, left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" unit="%" domain={[0, 35]} tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11, fill: '#cbd5e1' }}
                  width={110}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                        <p className="font-bold text-white">{d.feature}</p>
                        <p className="text-emerald-400 font-bold mt-1">Impact: {d.importance_pct}%</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="importance_pct" fill="#10b981" radius={[0, 6, 6, 0]}>
                  {topGroups.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? '#10b981' : idx === 1 ? '#34d399' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Local Live Waterfall Attribution (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Live Quote Attribution Breakdown</h3>
              <p className="text-[11px] text-slate-400">Stepwise feature contributions for the active prediction</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Baseline Benchmark</span>
              <span className="text-xs font-bold text-slate-200">€{localExplainability.baseline_market_adr.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {localExplainability.top_contributing_factors.map((factor, idx) => {
              const isPos = factor.impact_eur > 0;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isPos
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className={`p-1.5 rounded-lg mt-0.5 ${isPos ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {isPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{factor.feature}</span>
                      <span className="text-[11px] text-slate-300 leading-snug">{factor.description}</span>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-sm ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}€{factor.impact_eur.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Explanation Summary Box */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 mt-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-white mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Attribution Synthesis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {localExplainability.explanation_summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
