import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ExecutiveSummary } from './components/dashboard/ExecutiveSummary';
import { PricePredictor } from './components/dashboard/PricePredictor';
import { ModelComparison } from './components/dashboard/ModelComparison';
import { ExplainabilityView } from './components/dashboard/ExplainabilityView';
import { ScenarioSimulator } from './components/dashboard/ScenarioSimulator';
import { HistoricalAnalytics } from './components/dashboard/HistoricalAnalytics';
import { PricingRulesView } from './components/dashboard/PricingRulesView';
import { ModelsExplanationView } from './components/dashboard/ModelsExplanationView';
import { apiService } from './services/api';
import {
  BookingInput,
  PredictionResponse,
  ModelMetricItem,
  HistoricalTrends,
  ScatterSample,
  FeatureImportanceItem
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedHotel, setSelectedHotel] = useState<string>('City Hotel');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);

  const [currentPrediction, setCurrentPrediction] = useState<PredictionResponse | null>(null);
  const [metrics, setMetrics] = useState<Record<string, ModelMetricItem> | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalTrends | null>(null);
  const [evalSamples, setEvalSamples] = useState<{
    scatter_samples: ScatterSample[];
    residual_distribution: Array<{ bin: string; count: number }>;
    error_summary: Record<string, number>;
  } | null>(null);
  const [featureImportance, setFeatureImportance] = useState<{
    top_feature_groups: FeatureImportanceItem[];
    detailed_encoded_features: Array<{ name: string; importance: number }>;
  } | null>(null);

  // Initialize Data on Mount
  useEffect(() => {
    const initData = async () => {
      const health = await apiService.checkHealth();
      setIsBackendHealthy(health.models_loaded);

      try {
        const [m, hist, evals, fi] = await Promise.all([
          apiService.getMetrics().catch(() => null),
          apiService.getDatasetInfo().catch(() => null),
          apiService.getEvalSamples().catch(() => null),
          apiService.getFeatureImportance().catch(() => null),
        ]);
        if (m) setMetrics(m);
        if (hist) setHistoricalData(hist);
        if (evals) setEvalSamples(evals);
        if (fi) setFeatureImportance(fi);

        // Run default initial prediction
        const defaultBooking: BookingInput = {
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
        };
        const initialPred = await apiService.predictPrice(defaultBooking).catch(() => null);
        if (initialPred) setCurrentPrediction(initialPred);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };
    initData();
  }, [selectedHotel]);

  const handlePredict = async (booking: BookingInput) => {
    setIsLoadingPrediction(true);
    try {
      const pred = await apiService.predictPrice(booking);
      setCurrentPrediction(pred);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendHealthy={isBackendHealthy}
        selectedHotel={selectedHotel}
        setSelectedHotel={setSelectedHotel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <ExecutiveSummary
            currentPrediction={currentPrediction}
            historicalData={historicalData}
            metrics={metrics}
            onNavigateToPredict={() => setActiveTab('predict')}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'predict' && (
          <PricePredictor
            prediction={currentPrediction}
            isLoading={isLoadingPrediction}
            onPredict={handlePredict}
            selectedHotel={selectedHotel}
          />
        )}

        {activeTab === 'models' && (
          <ModelComparison metrics={metrics} evalSamples={evalSamples} />
        )}

        {activeTab === 'simulator' && (
          <ScenarioSimulator selectedHotel={selectedHotel} />
        )}

        {activeTab === 'explainability' && (
          <ExplainabilityView
            featureImportance={featureImportance}
            currentPrediction={currentPrediction}
          />
        )}

        {activeTab === 'analytics' && (
          <HistoricalAnalytics historicalData={historicalData} />
        )}

        {activeTab === 'rules' && <PricingRulesView />}

        {activeTab === 'explanation' && <ModelsExplanationView />}
      </main>

      {/* System Status Footer */}
      <footer className="sticky bottom-0 z-50 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 py-2 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[10px] uppercase tracking-wider font-mono text-slate-500">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-2" />
              LUMINA RMS ONLINE
            </span>
            <span>DATASET: Antonio (2019)</span>
          </div>
          <div className="flex items-center space-x-6 hidden sm:flex">
            <span>LATENCY: &lt;50ms</span>
            <span className="text-indigo-400">MODEL ENSEMBLE: V1.4.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
