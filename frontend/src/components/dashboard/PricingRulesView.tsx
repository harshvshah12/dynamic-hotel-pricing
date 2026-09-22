import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle,
  Lock,
  Zap,
  Info
} from 'lucide-react';

export const PricingRulesView: React.FC = () => {
  const rules = [
    {
      title: 'Occupancy Surge Tier III (> 90%)',
      category: 'Demand Pacing',
      condition: 'Property Occupancy ≥ 90%',
      formula: 'Mult = 1.0 + (Occupancy - 0.70) × 0.90',
      action: '+22.5% to +27.0% Surge Multiplier',
      rationale: 'Maximizes yield during scarce room inventory capacity.',
      status: 'Active'
    },
    {
      title: 'Occupancy Surge Tier II (70% - 90%)',
      category: 'Demand Pacing',
      condition: '70% ≤ Occupancy < 90%',
      formula: 'Mult = 1.0 + (Occupancy - 0.70) × 0.50',
      action: '+0.0% to +10.0% Proportional Surge',
      rationale: 'Progressive yield management above nominal 70% threshold.',
      status: 'Active'
    },
    {
      title: 'Occupancy Discount Tier I (< 50%)',
      category: 'Occupancy Stimulation',
      condition: 'Property Occupancy < 50%',
      formula: 'Mult = 1.0 - (0.70 - Occupancy) × 0.40',
      action: '-8.0% to -16.0% Dynamic Discount',
      rationale: 'Stimulates booking volume and protects room occupancy base.',
      status: 'Active'
    },
    {
      title: 'Urgent Last-Minute Inelasticity (≤ 2 Days)',
      category: 'Horizon Elasticity',
      condition: 'Lead Time ≤ 2 Days',
      formula: 'Mult = 1.14',
      action: '+14.0% Inelastic Surcharge',
      rationale: 'Captures distressed / urgent business traveler willingness-to-pay.',
      status: 'Active'
    },
    {
      title: 'Early-Bird Advance Incentive (> 90 Days)',
      category: 'Horizon Elasticity',
      condition: 'Lead Time > 90 Days',
      formula: 'Mult = 0.92',
      action: '-8.0% Advance Discount',
      rationale: 'Secures base room revenue and builds early booking curve.',
      status: 'Active'
    },
    {
      title: 'Hard Floor & Ceiling Guardrails',
      category: 'Brand & Margin Safety',
      condition: 'Price < €35 OR Price > €650',
      formula: 'Clamp(P, €35, €650)',
      action: 'Enforces hard boundary clamp',
      rationale: 'Protects GOP margin on bottom and brand reputation on top.',
      status: 'Enforced'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Operational Revenue Management & Pricing Guardrails</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic business constraints configured over pure statistical regression outputs.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((r, idx) => (
          <div
            key={idx}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {r.category}
                </span>
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{r.status}</span>
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">{r.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{r.rationale}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Condition:</span>
                <span className="font-mono text-slate-300 font-semibold">{r.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Adjustment:</span>
                <span className="font-mono text-emerald-400 font-bold">{r.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
