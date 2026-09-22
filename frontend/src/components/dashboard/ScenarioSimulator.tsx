import React, { useState, useEffect } from 'react';
import {
  Sliders,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Layers,
  Info,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { BookingInput } from '../../types';
import { apiService } from '../../services/api';

interface ScenarioSimulatorProps {
  selectedHotel: string;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ selectedHotel }) => {
  const [occupancyRate, setOccupancyRate] = useState<number>(0.75);
  const [leadTime, setLeadTime] = useState<number>(30);
  const [roomType, setRoomType] = useState<string>('A');
  const [season, setSeason] = useState<string>('Summer');
  const [weekendNights, setWeekendNights] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [occCurveData, setOccCurveData] = useState<any[]>([]);
  const [leadCurveData, setLeadCurveData] = useState<any[]>([]);
  const [livePrice, setLivePrice] = useState<number>(128.50);

  const fetchSimulation = async () => {
    setIsSimulating(true);
    try {
      const baseBooking: BookingInput = {
        hotel: selectedHotel,
        reserved_room_type: roomType,
        meal: 'BB',
        arrival_date_month: season === 'Summer' ? 'July' : (season === 'Winter' ? 'January' : 'April'),
        arrival_date_week_number: 28,
        arrival_date_day_of_month: 15,
        lead_time: leadTime,
        stays_in_weekend_nights: weekendNights,
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
        current_occupancy_rate: occupancyRate,
        competitor_rate_index: 1.0,
      };

      const res = await apiService.runScenarioSimulation(baseBooking);
      setOccCurveData(res.occupancy_curve);
      setLeadCurveData(res.lead_time_curve);

      const singleRes = await apiService.predictPrice(baseBooking);
      setLivePrice(singleRes.final_recommended_price);
    } catch (err) {
      console.error('Scenario simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, [selectedHotel, occupancyRate, leadTime, roomType, season, weekendNights]);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Interactive What-If Dynamic Pricing Sandbox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test pricing elasticity live by modulating occupancy levels, booking horizons, and room tiers.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Simulated Dynamic ADR</span>
              <span className="text-xl font-mono font-extrabold text-emerald-400">€{livePrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Live Price Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Console (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Sandbox Controls</h3>
            {isSimulating && <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />}
          </div>

          {/* Occupancy Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-300">Property Occupancy Rate</label>
              <span className="font-mono font-bold text-emerald-400">{(occupancyRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="1.00"
              step="0.05"
              value={occupancyRate}
              onChange={(e) => setOccupancyRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20% (Low demand)</span>
              <span>70% (Target)</span>
              <span>100% (Surge)</span>
            </div>
          </div>

          {/* Lead Time Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-300">Lead Time Horizon</label>
              <span className="font-mono font-bold text-blue-400">{leadTime} days</span>
            </div>
            <input
              type="range"
              min="1"
              max="180"
              value={leadTime}
              onChange={(e) => setLeadTime(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1d (Urgent)</span>
              <span>30d</span>
              <span>180d (Early)</span>
            </div>
          </div>

          {/* Room Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Room Tier</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="A">Tier A (Standard Standard)</option>
              <option value="B">Tier B (Standard Superior)</option>
              <option value="C">Tier C (Deluxe Double)</option>
              <option value="D">Tier D (Executive Suite)</option>
              <option value="E">Tier E (Family Penthouse)</option>
              <option value="F">Tier F (Presidential Suite)</option>
              <option value="G">Tier G (Royal Villa)</option>
            </select>
          </div>

          {/* Season Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Macro Season</label>
            <div className="grid grid-cols-2 gap-2">
              {['Summer', 'Spring', 'Autumn', 'Winter'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                    season === s
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Elasticity Curves (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Occupancy Elasticity Curve */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">Occupancy Elasticity Trajectory</h3>
                <p className="text-[11px] text-slate-400">Shows dynamic price surge responding to capacity saturation</p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-400">Non-Linear Surge</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occCurveData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="occupancy_pct"
                    unit="%"
                    stroke="#94a3b8"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Property Occupancy (%)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    unit="€"
                    tick={{ fontSize: 10 }}
                    domain={['auto', 'auto']}
                    label={{ value: 'Price (€)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                          <p className="font-bold text-white">Occupancy: {d.occupancy_pct}%</p>
                          <p className="text-emerald-400 font-bold mt-1">Recommended ADR: €{d.recommended_adr.toFixed(2)}</p>
                          <p className="text-slate-400">ML Base: €{d.ml_base_adr.toFixed(2)}</p>
                          <p className="text-blue-400">Status: {d.status}</p>
                        </div>
                      );
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="recommended_adr" name="Recommended Dynamic ADR" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="ml_base_adr" name="ML Base (Static)" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Time Elasticity Curve */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">Lead-Time Discount / Surge Decay Curve</h3>
                <p className="text-[11px] text-slate-400">Urgent last-minute premium vs early-bird guaranteed pace</p>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-400">Advance Curve</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadCurveData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="lead_time_days"
                    unit="d"
                    stroke="#94a3b8"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Lead Time (Days)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis stroke="#94a3b8" unit="€" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                          <p className="font-bold text-white">{d.lead_time_days} Days in Advance</p>
                          <p className="text-emerald-400 font-bold mt-1">Recommended ADR: €{d.recommended_adr.toFixed(2)}</p>
                        </div>
                      );
                    }}
                  />
                  <Line type="monotone" dataKey="recommended_adr" name="ADR by Booking Horizon" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
