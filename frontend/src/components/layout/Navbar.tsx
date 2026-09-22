import React from 'react';
import {
  Hotel,
  TrendingUp,
  Cpu,
  Sliders,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendHealthy: boolean;
  selectedHotel: string;
  setSelectedHotel: (hotel: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendHealthy,
  selectedHotel,
  setSelectedHotel,
}) => {
  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Activity },
    { id: 'predict', label: 'Price Predictor', icon: TrendingUp },
    { id: 'models', label: 'Model Benchmark & Ensembles', icon: Cpu },
    { id: 'simulator', label: 'Scenario Simulator', icon: Sliders },
    { id: 'explainability', label: 'Explainable AI (XAI)', icon: HelpCircle },
    { id: 'analytics', label: 'Demand & History', icon: BarChart3 },
    { id: 'rules', label: 'Revenue Rules', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Hotel className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">
                  Lumina
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  RMS v1.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Hospitality Revenue Intelligence & Multi-Model Ensemble
              </p>
            </div>
          </div>

          {/* Hotel Filter & System Status Badge */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg p-1">
              <button
                onClick={() => setSelectedHotel('City Hotel')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedHotel === 'City Hotel'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                City Hotel (Lisbon)
              </button>
              <button
                onClick={() => setSelectedHotel('Resort Hotel')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedHotel === 'Resort Hotel'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Resort Hotel (Algarve)
              </button>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendHealthy
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                }`}
              />
              <span className="text-slate-300 font-mono text-[11px]">
                {isBackendHealthy ? 'API: 4 Models + 2 Ensembles' : 'Connecting API...'}
              </span>
            </div>
            
            <button
              onClick={() => setActiveTab('explanation')}
              className="ml-2 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/30 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Used 4 Models + 2 Ensemble</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
