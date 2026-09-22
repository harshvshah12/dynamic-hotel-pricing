# System Architecture Specification
# Dynamic Hotel Pricing Management System

## 1. Architectural Philosophy
The **Dynamic Hotel Pricing Management System** separates pure statistical estimation (machine learning regression) from operational business execution (revenue management policy). Rather than forcing an ML model to guess arbitrary business rules (such as minimum floor margins or corporate discount tiers), the architecture decomposes pricing into a two-stage pipeline:
1. **Stage 1 (ML Ensemble Inference)**: Computes the unconstrained market clearing transaction price $\hat{y}_{\text{ens}}$ from multi-dimensional booking and customer features.
2. **Stage 2 (Dynamic Revenue Policy Engine)**: Applies real-time operational context (occupancy velocity, lead-time horizon curves, macro seasonality) subject to hard administrative boundaries.

---

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND PRESENTATION LAYER                      │
│                  (React 18 + TypeScript + Vite + Tailwind CSS)             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Executive Overview  │  Live Predictor  │  Model Benchmark  │  What-If Sandbox  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP REST / JSON
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FASTAPI BACKEND SERVICE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Pydantic v2 Request Validation & Error Handling                          │
│  • Singleton ModelService Lifecycle Loader                                  │
│  • CORS & Middleware Subsystem                                              │
└───────────────────┬─────────────────────────────────────┬───────────────────┘
                    │                                     │
                    ▼                                     ▼
┌─────────────────────────────────────────┐ ┌─────────────────────────────────┐
│     STAGE 1: ML ENSEMBLE INFERENCE      │ │   STAGE 2: DYNAMIC PRICING RM   │
├─────────────────────────────────────────┤ ├─────────────────────────────────┤
│ • StandardScaler & OneHotEncoder        │ │ • Occupancy Multiplier (0.84-1.2)│
│ • Ridge Linear Baseline (€112.40)       │ │ • Lead Time Elasticity (0.92-1.1)│
│ • Random Forest Regressor (€118.20)     │ │ • Seasonal Surge Factor         │
│ • HistGradientBoosting (€116.90)        │ │ • Hard Clamp [€35, €650]       │
│ • Extra Trees Regressor (€117.50)       │ │ • 90% Confidence Interval Band   │
│ • Stacking Meta-Regressor (€116.65)     │ └─────────────────────────────────┘
│ • SLSQP Weighted Blend (€116.80)        │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXPLAINABLE AI ATTRIBUTION ENGINE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Global MDI & Permutation Feature Importances                              │
│ • Local Additive Waterfall Attribution (Baseline Intercept + Feature Deltas)│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Deep Dive

### 3.1 Preprocessing Subsystem (`ml/preprocessing/`)
- Encapsulated within `preprocessor.py`.
- Constructs an immutable `sklearn.compose.ColumnTransformer` containing:
  - `StandardScaler` for 21 numeric/engineered features.
  - `OneHotEncoder(handle_unknown='ignore', sparse_output=False)` for 9 categorical features.
- Strictly fit only on the $80\%$ training split ($N=93,714$).

### 3.2 Machine Learning Regressors (`ml/models/`)
Four distinct algorithmic families ensure orthogonal error profiles:
1. **Ridge Baseline**: Parametric linear model with $L_2$ shrinkage ($\alpha=10.0$).
2. **Random Forest**: Non-parametric bagging ensemble (80 estimators, max depth 16) minimizing variance.
3. **HistGradientBoosting**: Non-parametric boosting ensemble (140 iterations, learning rate 0.08) minimizing bias.
4. **Extra Trees**: Extremely randomized tree bagging ensemble reducing variance further.

### 3.3 Ensembling Engine (`ml/training/`)
- **Weighted Blending**: Formulated as a constrained quadratic optimization problem:
  $$\min_{\mathbf{w}} \frac{1}{N} \sum_{i=1}^{N} \left( y_i - \sum_{m=1}^{M} w_m \hat{y}_{i,m}^{\text{OOF}} \right)^2 \quad \text{s.t.} \quad \sum w_m = 1, \; w_m \ge 0$$
- **Stacking Meta-Regressor**: Uses out-of-fold cross-validated predictions to train a second-stage Ridge meta-learner with zero data leakage.

### 3.4 API Backend Service (`backend/app/`)
- Asynchronous FastAPI framework running on Uvicorn.
- Singleton pattern `ModelService` guarantees sub-50ms inference latency by caching model binaries in memory.
- Validates all requests with Pydantic schemas.

### 3.5 Frontend Architecture (`frontend/src/`)
- Single Page Application built on React 18 and Vite.
- Responsive design crafted with Tailwind CSS and custom dark-theme tokens.
- Interactive charting with Recharts (scatter plots, line graphs, bar charts).
