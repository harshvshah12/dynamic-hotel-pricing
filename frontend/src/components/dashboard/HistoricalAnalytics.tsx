import React from 'react';
import {
  BarChart3,
  Calendar,
  Layers,
  TrendingUp,
  Building,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { HistoricalTrends } from '../../types';

interface HistoricalAnalyticsProps {
  historicalData: HistoricalTrends | null;
}

export const HistoricalAnalytics: React.FC<HistoricalAnalyticsProps> = ({ historicalData }) => {
  const monthlyData = historicalData?.monthly_trends || [
    { month: 'Jan', resort_adr: 48.5, city_adr: 82.3, overall_adr: 70.2 },
    { month: 'Feb', resort_adr: 54.2, city_adr: 87.5, overall_adr: 74.8 },
    { month: 'Mar', resort_adr: 57.1, city_adr: 91.2, overall_adr: 81.3 },
    { month: 'Apr', resort_adr: 76.4, city_adr: 111.4, overall_adr: 100.2 },
    { month: 'May', resort_adr: 78.9, city_adr: 121.2, overall_adr: 108.9 },
    { month: 'Jun', resort_adr: 110.5, city_adr: 124.5, overall_adr: 118.8 },
    { month: 'Jul', resort_adr: 155.2, city_adr: 118.9, overall_adr: 129.4 },
    { month: 'Aug', resort_adr: 186.4, city_adr: 120.3, overall_adr: 142.1 },
    { month: 'Sep', resort_adr: 98.2, city_adr: 115.6, overall_adr: 109.8 },
    { month: 'Oct', resort_adr: 62.4, city_adr: 103.5, overall_adr: 90.1 },
    { month: 'Nov', resort_adr: 46.8, city_adr: 88.2, overall_adr: 73.5 },
    { month: 'Dec', resort_adr: 68.9, city_adr: 91.0, overall_adr: 83.2 },
  ];

  const roomTypeData = historicalData?.room_type_distribution || [
    { room_type: 'Tier H (Presidential)', avg_adr: 198.5, count: 620 },
    { room_type: 'Tier G (Royal Villa)', avg_adr: 176.2, count: 2090 },
    { room_type: 'Tier F (Family Suite)', avg_adr: 162.8, count: 2880 },
    { room_type: 'Tier E (Executive)', avg_adr: 124.1, count: 6470 },
    { room_type: 'Tier D (Deluxe Double)', avg_adr: 120.8, count: 19150 },
    { room_type: 'Tier C (Standard Sup)', avg_adr: 112.4, count: 930 },
    { room_type: 'Tier B (Standard Dbl)', avg_adr: 90.5, count: 1110 },
    { room_type: 'Tier A (Standard Standard)', avg_adr: 90.2, count: 83800 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Historical Hospitality & Demand Analytics</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-year ADR and demand dynamics across 117,143 Portugal resort and city hotel transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Monthly Seasonality Curve & Room Tier Dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Seasonality Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Monthly ADR Seasonality (Resort vs. City)</h3>
              <p className="text-[11px] text-slate-400">Notice extreme July/August coastal surge vs steady urban profile</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">12-Month Cycle</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" unit="€" tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl space-y-1">
                        <p className="font-bold text-white">{d.month} Historical ADR</p>
                        <p className="text-emerald-400 font-bold">Resort Hotel: €{d.resort_adr.toFixed(2)}</p>
                        <p className="text-blue-400 font-bold">City Hotel: €{d.city_adr.toFixed(2)}</p>
                        <p className="text-slate-300">Market Mean: €{d.overall_adr.toFixed(2)}</p>
                      </div>
                    );
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="resort_adr" name="Resort Hotel (Algarve)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="city_adr" name="City Hotel (Lisbon)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Category Price Dispersion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Room Tier Price Dispersion</h3>
              <p className="text-[11px] text-slate-400">Mean executed transaction rate across room categories</p>
            </div>
            <span className="text-[11px] font-mono text-purple-400 font-semibold">Tiers A to H</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roomTypeData}
                margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="room_type" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <YAxis stroke="#94a3b8" unit="€" tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                        <p className="font-bold text-white">{d.room_type}</p>
                        <p className="text-emerald-400 font-bold mt-1">Mean ADR: €{d.avg_adr.toFixed(2)}</p>
                        <p className="text-slate-400">Transaction Volume: {d.count.toLocaleString()} bookings</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="avg_adr" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
