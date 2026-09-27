import React, { useState } from 'react';
import {
  Network,
  Shield,
  Layers,
  Cpu,
  ArrowRight,
  ExternalLink,
  Lock,
  Maximize2,
  Minimize2,
  RefreshCw,
  Server,
  Zap,
  Globe,
  Database,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const reloadIframe = () => setIframeKey((prev) => prev + 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Network className="w-3.5 h-3.5" />
              <span>Showcase Architecture Specification • Archify v2.17</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              High-Level Runtime Architecture & Trust Boundaries
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Formal structural decomposition of <strong className="text-white">Lumina RMS</strong>. 
              Featuring 11 orthogonal runtime components, a single primary synchronous prediction pipeline, 
              strict perimeter trust boundaries, and zero-data-leakage model serialization.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
            <button
              onClick={reloadIframe}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all"
              title="Reset Diagram State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Canvas</span>
            </button>

            <a
              href="/runtime-architecture.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-400 hover:from-indigo-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <span>Open Standalone Viewer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Core Components</span>
            <span className="text-lg font-mono font-bold text-white">11 Orthogonal Nodes</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Primary Execution Path</span>
            <span className="text-lg font-mono font-bold text-emerald-400">1 Synchronous Flow</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Security Perimeters</span>
            <span className="text-lg font-mono font-bold text-indigo-400">3 Trust Boundaries</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Inference Latency Budget</span>
            <span className="text-lg font-mono font-bold text-teal-400">&lt;50ms (In-Memory)</span>
          </div>
        </div>
      </div>

      {/* Embedded Archify Interactive Diagram */}
      <div className={`relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)]' : ''
      }`}>
        <div className="bg-slate-950/90 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">
              Archify Vector Runtime • Pan / Zoom / Guided Views
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-xs flex items-center space-x-1"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className={isFullscreen ? 'h-[calc(100%-48px)] w-full' : 'h-[560px] w-full'}>
          <iframe
            key={iframeKey}
            src="/runtime-architecture.html"
            title="Lumina RMS Architecture Diagram"
            className="w-full h-full border-0 bg-slate-950"
            loading="lazy"
          />
        </div>
      </div>

      {/* 3 Pillar Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Edge & Ingress */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Edge Ingress & Client Layer</h3>
              <span className="text-[11px] text-cyan-400 font-mono">Untrusted Perimeter</span>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed pt-1">
            <li><strong className="text-white">Vercel Edge Global CDN:</strong> Fronts static bundle with automated TLS 1.3 encryption and sub-30ms global DNS routing.</li>
            <li><strong className="text-white">React 18 + Vite SPA:</strong> High-performance UI engine handling what-if parameter sliders and live quote requests.</li>
            <li><strong className="text-white">PMS & Channel Feeds:</strong> External booking aggregators ingest transactional events via authenticated REST endpoints.</li>
          </ul>
        </div>

        {/* Card 2: ML Inference Core */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">ML Ensemble Inference Core</h3>
              <span className="text-[11px] text-emerald-400 font-mono">Trusted Compute Zone</span>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed pt-1">
            <li><strong className="text-white">ColumnTransformer Pipeline:</strong> StandardScaler (21 features) and OneHotEncoder (9 features) fit strictly on 80% train split.</li>
            <li><strong className="text-white">4 Diverse Base Regressors:</strong> Ridge Baseline (L2), Random Forest (Bagging), HistGradientBoosting, and Extra Trees.</li>
            <li><strong className="text-white">Stacking & SLSQP Blending:</strong> Second-stage meta-regressor combines out-of-fold estimates achieving peak R²=0.862.</li>
          </ul>
        </div>

        {/* Card 3: Revenue Policy & Security */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-all">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Revenue Policy & Security</h3>
              <span className="text-[11px] text-rose-400 font-mono">Enforced Boundaries</span>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed pt-1">
            <li><strong className="text-white">Decoupled Operational Policy:</strong> Statistical estimation is separated from dynamic multipliers and margin logic.</li>
            <li><strong className="text-white">Hard Safety Clamping:</strong> Prices are rigorously constrained to [€35 floor, €650 ceiling] to protect margins and brand equity.</li>
            <li><strong className="text-white">Tamper-Proof Artifacts:</strong> Scikit-learn model binaries (.joblib) are mounted read-only with cryptographic validation.</li>
          </ul>
        </div>
      </div>

      {/* Primary Path Walkthrough */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Primary Synchronous Execution Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Step-by-step transaction flow from client input to final clamped ADR quote
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            End-to-End Latency: ~38ms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">1</span>
              <span className="text-slate-500 font-mono">Edge Ingress</span>
            </div>
            <h4 className="font-bold text-white text-sm">Quote Dispatch</h4>
            <p className="text-slate-400 leading-relaxed">
              Client submits reservation payload (24 raw booking features) via HTTPS POST to <code>/api/predict</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">2</span>
              <span className="text-slate-500 font-mono">Validation</span>
            </div>
            <h4 className="font-bold text-white text-sm">Pydantic Guard</h4>
            <p className="text-slate-400 leading-relaxed">
              FastAPI executes strict schema sanitization, type-checking, and range bounds on lead time, month, and guest counts.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">3</span>
              <span className="text-slate-500 font-mono">Feature Encoding</span>
            </div>
            <h4 className="font-bold text-white text-sm">ColumnTransformer</h4>
            <p className="text-slate-400 leading-relaxed">
              Raw features are transformed into a dense 65-dimensional numerical tensor using cached scalers and one-hot encodings.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">4</span>
              <span className="text-slate-500 font-mono">Parallel ML</span>
            </div>
            <h4 className="font-bold text-white text-sm">4-Model Inference</h4>
            <p className="text-slate-400 leading-relaxed">
              In-memory models evaluate concurrently: Ridge (€112.40), RF (€118.20), HistGB (€116.90), ExtraTrees (€117.50).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">5</span>
              <span className="text-slate-500 font-mono">Meta-Ensemble</span>
            </div>
            <h4 className="font-bold text-white text-sm">SLSQP Synthesis</h4>
            <p className="text-slate-400 leading-relaxed">
              Constrained quadratic weights and second-stage Stacking meta-regressor generate consensus base ADR (€116.80).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">6</span>
              <span className="text-slate-500 font-mono">Policy Engine</span>
            </div>
            <h4 className="font-bold text-white text-sm">Dynamic Surge</h4>
            <p className="text-slate-400 leading-relaxed">
              Applies occupancy surge (e.g. 1.050x at 80% capacity) and advance lead-time elasticity multipliers.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">7</span>
              <span className="text-slate-500 font-mono">Safety Boundary</span>
            </div>
            <h4 className="font-bold text-white text-sm">Hard Clamp [€35, €650]</h4>
            <p className="text-slate-400 leading-relaxed">
              Ensures quoted rates never violate cost floor or brand luxury ceilings, maintaining strict commercial viability.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">8</span>
              <span className="text-slate-500 font-mono">Delivery</span>
            </div>
            <h4 className="font-bold text-white text-sm">JSON Response</h4>
            <p className="text-slate-400 leading-relaxed">
              Returns recommended ADR, 90% confidence intervals, model breakdown, and waterfall explainability back to client.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Boundaries & Isolation Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Trust Boundaries & Security Classification Matrix</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Defense-in-Depth</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Boundary Zone</th>
                <th className="py-3 px-4">Wrapped Components</th>
                <th className="py-3 px-4">Trust Level</th>
                <th className="py-3 px-4">Enforcement Mechanism</th>
                <th className="py-3 px-4">Threat Protection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-cyan-400">Untrusted Client Zone</td>
                <td className="py-3 px-4 text-white">Web/Mobile Browser, PMS Feeds</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px]">Zero Trust</span></td>
                <td className="py-3 px-4 text-slate-400">Strict HTTPS / CORS origin restriction</td>
                <td className="py-3 px-4 text-slate-300">Prevents unauthorized direct socket access or MITM eavesdropping</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-indigo-400">Edge Ingress Boundary</td>
                <td className="py-3 px-4 text-white">Vercel Edge Global CDN</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px]">Perimeter Gate</span></td>
                <td className="py-3 px-4 text-slate-400">TLS 1.3 termination, DDoS scrubbing, WAF</td>
                <td className="py-3 px-4 text-slate-300">Absorbs traffic surges and blocks malformed HTTP flood attacks</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors bg-emerald-500/5">
                <td className="py-3 px-4 font-bold text-emerald-400">Trusted Compute Perimeter</td>
                <td className="py-3 px-4 text-white font-medium">FastAPI, Preprocessor, ModelService, 4 Regressors, Pricing Engine</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">Fully Trusted</span></td>
                <td className="py-3 px-4 text-slate-400">Pydantic v2 validation, memory isolation, read-only .joblib mounts</td>
                <td className="py-3 px-4 text-slate-300">Guarantees zero model poisoning, zero code injection, and sub-50ms execution</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
