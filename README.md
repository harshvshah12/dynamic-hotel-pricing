# Dynamic Hotel Pricing Management System 🏨

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.7-F7931E.svg)](https://scikit-learn.org/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Tested-45ba4b.svg)](https://playwright.dev/)

An enterprise-grade, academically defensible **Dynamic Hotel Pricing Management System**. The platform analyzes 119,390 multi-dimensional hotel booking transactions across Portugal resort and city properties to accurately forecast market clearing room rates (Average Daily Rate / ADR) and dynamically recommend optimal yield pricing subject to operational business constraints.

---

## 🌟 Key Highlights

- **Genuine Academic Benchmark Dataset**: Trained on 119,390 transactions (Antonio, de Almeida & Nunes, 2019, *Data in Brief*, Elsevier) across Algarve Resort Hotel (H1) and Lisbon City Hotel (H2).
- **Strict Zero Data Leakage**: Comprehensive audit eliminating post-booking signals (`is_canceled`, `reservation_status`, `assigned_room_type`). All transformers fit strictly on the 80% train split.
- **4 Independent ML Regression Models**:
  1. **Ridge Linear Baseline** ($L_2$ Regularized linear benchmark)
  2. **Random Forest Regressor** (Bagging ensemble of 80 trees)
  3. **HistGradientBoosting Regressor** (Histogram-binned gradient boosting)
  4. **Extra Trees Regressor** (Extremely randomized tree ensemble)
- **Mathematical Ensembling Layer**:
  - **Weighted Blending Ensemble** (SLSQP MSE-Optimized weights on out-of-fold validation)
  - **Stacking Meta-Regressor** (5-Fold Cross-Validated Ridge meta-learner)
  - **Ensemble Generalization**: Holdout Test $R^2 = 0.8619$, RMSE = €17.20, MAE = €10.57.
- **Revenue Management Dynamic Policy**:
  - Occupancy Surge & Discounting Multipliers (>70% target yield)
  - Booking Horizon Lead-Time Decay/Surge Curves
  - Hard Floor (€35) & Ceiling (€650) Guardrails
- **Explainable AI (XAI)**: Global feature importance (MDI) + live additive waterfall feature attribution per quote.
- **Interactive Analytics Dashboard**: React 18 + TypeScript + Vite + Tailwind CSS with What-If Scenario Sandbox, Model Benchmark Hub, and Residual Visualizations.
- **Automated QA**: 20 Unit & Integration tests (`pytest`) + End-to-End browser automation (`Playwright`).

---

## 🏛️ System Architecture

```
[ Antonio et al. Dataset (119,390 rows) ]
                 │
                 ▼
[ Data Cleaning & Leakage Audit ]
  - Exclude post-stay features
  - Impute missing values, prune ADR outliers (> €800)
                 │
                 ▼
[ Feature Engineering & Preprocessor ]
  - Cyclical temporal features (sin_month, cos_month, sin_week, cos_week)
  - Stay duration, family indicator, lead-time buckets, guest totals
  - StandardScaler (Numeric) + OneHotEncoder (Categorical)
                 │
                 ▼
[ 5-Fold Cross Validation & Model Training ]
  ├── Ridge Baseline (CV R²: 0.5852)
  ├── Random Forest (CV R²: 0.8577)
  ├── HistGradientBoosting (CV R²: 0.8209)
  └── Extra Trees (CV R²: 0.8515)
                 │
                 ▼
[ Ensemble Layer ]
  ├── SLSQP Weighted Blending (Holdout R²: 0.8619 | RMSE: €17.20)
  └── 5-Fold Stacking Meta-Learner (Holdout R²: 0.8621 | RMSE: €17.19)
                 │
                 ▼
[ Revenue Management Dynamic Policy Engine ]
  - Occupancy Multipliers (+5% to +27% surge above 70% capacity)
  - Lead-Time Curve (+14% urgent, -8% early bird)
  - Safety Clamp [€35 Floor, €650 Ceiling]
                 │
                 ▼
[ FastAPI Backend API ] ◄── REST ──► [ React + TypeScript UI Dashboard ]
  - /health, /models, /metrics          - Executive Overview
  - /predict, /predict/batch            - Price Predictor
  - /scenario (What-if simulator)       - Model Benchmark Hub
  - /feature-importance, /pricing-rules - Explainable AI Studio
                                        - Scenario Sandbox
```

---

## 📊 Academic Model Evaluation & Leaderboard (Holdout Test Set)

| Rank | Model Name | Model Family | MAE (€) | RMSE (€) | $R^2$ Score | MAPE (%) | Explained Variance |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 🥇 | **Weighted Blending Ensemble** | Blending (SLSQP MSE-Optimized) | **€10.57** | **€17.20** | **0.8619** | **11.26%** | **0.8620** |
| 🥈 | **Stacking Meta-Regressor** | 5-Fold OOF Meta-Learner (Ridge) | €10.56 | €17.19 | 0.8621 | 11.21% | 0.8621 |
| 🥉 | **Random Forest Regressor** | Bagging (80 Trees) | €10.53 | €17.25 | 0.8612 | 11.20% | 0.8613 |
| 4 | **Extra Trees Regressor** | Extremely Randomized Trees | €10.88 | €17.68 | 0.8541 | 11.58% | 0.8542 |
| 5 | **HistGradientBoosting** | Histogram Gradient Boosting | €13.58 | €19.36 | 0.8251 | 14.89% | 0.8252 |
| 6 | **Ridge Linear Baseline** | Linear L2 Regularized | €22.03 | €29.87 | 0.5835 | 24.75% | 0.5835 |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 2. Backend Setup
```bash
# Navigate to project root
cd X:\dynamic-hotel-pricing

# Run ML Pipeline & train all models (downloads dataset automatically)
python ml/data/download_data.py
python ml/training/train.py

# Start FastAPI Backend Server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Interactive OpenAPI Swagger documentation available at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd X:\dynamic-hotel-pricing\frontend

# Start Vite Development Server
npm run dev
# or preview production bundle
node node_modules/vite/bin/vite.js preview --port 5173
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Validation

### Backend Unit & Integration Tests (pytest)
```bash
python -m pytest tests/ -v
```
Output: `20 passed in 12.54s`

### Playwright End-to-End Browser Automation
```bash
npx playwright test
```
Validates full user journey: executive KPIs, multi-model predictions, sandbox sliders, benchmark tables, and XAI attribution.

---

## 📂 Repository Structure

```
dynamic-hotel-pricing/
├── backend/                    # FastAPI REST API & Services
│   └── app/
│       ├── api/endpoints.py    # Route handlers
│       ├── services/           # ModelService & DynamicPricingEngine
│       ├── schemas.py          # Pydantic v2 validation models
│       └── main.py             # FastAPI entrypoint
├── frontend/                   # Modern React + TS + Tailwind UI
│   └── src/
│       ├── components/         # ExecutiveSummary, PricePredictor, etc.
│       ├── services/api.ts     # Typed API client
│       └── types/index.ts      # TypeScript interfaces
├── ml/                         # Data science & ML pipeline
│   ├── data/                   # Data downloader
│   ├── preprocessing/          # Feature engineering & preprocessors
│   ├── training/train.py       # 5-fold CV, model fitting & ensembling
│   └── explainability/         # Global & local XAI attribution
├── datasets/                   # Raw & processed benchmark datasets
├── model_artifacts/            # Saved .joblib binaries & metadata JSON
├── tests/                      # Unit, Integration & Playwright E2E tests
├── docs/                       # Screenshots & architecture guides
├── PRD.md                      # 30-section Product Requirements Document
├── datasets.md                 # Data provenance & schema dictionary
├── model_comparison.md         # Academic model benchmark report
├── architecture.md             # System architecture specification
└── README.md                   # Project overview & guide
```

---

## 📜 License
Released under the MIT License.
