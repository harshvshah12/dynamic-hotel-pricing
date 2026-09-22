# Product Requirements Document (PRD)
# Dynamic Hotel Pricing Management System

**Document Version**: 1.0.0  
**Status**: Approved / Production Ready  
**System**: Dynamic Hotel Pricing Management System  

---

## 1. Executive Summary
The **Dynamic Hotel Pricing Management System** is an enterprise-grade, academically defensible machine learning platform designed to optimize hospitality revenue management. By analyzing multi-dimensional historical hotel booking data, temporal demand patterns, lead-time dynamics, customer composition, and market friction, the system accurately predicts the baseline market clearing room rate (Average Daily Rate / ADR) and recommends dynamic, context-aware pricing subject to operational business constraints.

The system incorporates four distinct regression models (Ridge Baseline, Random Forest, HistGradientBoosting, Extra Trees) combined via a mathematical **Weighted Blending Ensemble** and an out-of-fold **Stacking Meta-Regressor**. It provides explainable AI (XAI) feature attributions, dynamic price bounds, and an interactive what-if revenue simulation studio.

---

## 2. Problem Statement
Hotel revenue management faces high price volatility and complex non-linear demand structures:
1. **Demand Stochasticity**: Booking velocity fluctuates heavily based on season, days until arrival (lead time), day of the week, and customer segments.
2. **Suboptimal Fixed Pricing**: Traditional static pricing fails to capture willingness-to-pay surges during high-demand windows or stimulate occupancy during low-demand troughs.
3. **Black-Box Skepticism**: Hotel general managers and revenue directors reject opaque automated recommendations without clear, interpretable contributing factors.
4. **Data Leakage in Research**: Many academic pricing models inadvertently train on post-booking signals (such as eventual cancellation status or check-in room reassignment), rendering them invalid in real-time inference.

---

## 3. Motivation
In modern hospitality revenue management, pricing directly influences revenue per available room (RevPAR = ADR x Occupancy Rate). Developing a multi-model ensemble with rigorous cross-validation and transparent feature attribution provides an academically robust and commercially viable solution that bridges theoretical machine learning and practical revenue operations.

---

## 4. Target Users
1. **Hotel Revenue Managers & Directors**: Monitor real-time dynamic pricing recommendations, evaluate model predictions, and configure rate guardrails.
2. **Hotel General Managers & Executives**: Review macro revenue KPIs, demand trends, and pricing performance benchmarks.
3. **Academic Evaluators & Viva Examiners**: Audit data science methodology, verify absence of data leakage, inspect cross-validation results, and evaluate ensemble superiority.

---

## 5. Goals
- **G1 (Multi-Model Regression)**: Train at least three distinct non-linear ML models plus one linear baseline on genuine historical booking data.
- **G2 (Defensible Ensembling)**: Combine base models using both an MSE-optimized weighted blend and a 5-fold cross-validated stacking meta-learner.
- **G3 (Zero Data Leakage)**: Ensure every feature in the training and inference pipeline represents state available strictly at quote/booking time.
- **G4 (Explainable AI)**: Provide both global feature importance and real-time local waterfall feature attributions for every single room price quote.
- **G5 (Dynamic Pricing Policy)**: Apply operational multipliers (demand pace, occupancy velocity, lead-time decay/surge) with hard safety bounds.
- **G6 (High-Fidelity UI/UX)**: Deliver a responsive, modern analytics dashboard featuring what-if simulation, residual analysis, and executive KPIs.
- **G7 (Automated QA)**: Guarantee end-to-end reliability via Unit tests, Integration tests, and Playwright E2E browser automation.

---

## 6. Non-Goals
- Real-time PMS (Property Management System) database sync via live two-way WebSockets (scoped for Future Scope).
- Automated payment gateway processing and credit card charging.
- Multi-currency live forex arbitrage conversion (all pricing standardized in Euros/USD).

---

## 7. Functional Requirements
- **FR-1**: Ingest and preprocess raw hotel booking data with complete validation and cleaning.
- **FR-2**: Provide single-quote price prediction and batch-quote CSV prediction.
- **FR-3**: Expose individual predictions from Baseline, Random Forest, Gradient Boosting, Extra Trees, and the Ensemble.
- **FR-4**: Calculate dynamic multipliers based on occupancy rate, lead time, and seasonal demand.
- **FR-5**: Enforce configurable business guardrails (floor price, ceiling price, maximum daily price shift).
- **FR-6**: Compute local feature contribution scores for each generated quote.
- **FR-7**: Support real-time parameter tweaking via an interactive Scenario Simulator.
- **FR-8**: Present comprehensive model performance comparisons (MAE, RMSE, R², MAPE, residuals).

---

## 8. Non-Functional Requirements
- **NFR-1 (Inference Latency)**: Single-quote prediction and local explainability generated in under 50ms.
- **NFR-2 (Reproducibility)**: Deterministic pipeline execution with fixed random seeds (random_state=42).
- **NFR-3 (Code Quality)**: Modular architecture separating data engineering, ML training, API endpoints, and UI components.
- **NFR-4 (Accessibility & UX)**: WCAG AA contrast compliance, responsive layouts (mobile, tablet, desktop), fluid state transitions.

---

## 9. ML Requirements
- Predict continuous target variable: Average Daily Rate (ADR in real currency).
- Implement proper 80/20 train/test split.
- Execute 5-Fold Stratified/K-Fold Cross-Validation on training data.
- Ensure all preprocessing transformations (StandardScaler, OneHotEncoder) are fit strictly on training splits.

---

## 10. Dataset Requirements
- **Source**: Canonical Hotel Booking Demand Dataset (Antonio, de Almeida, & Nunes, 2019, Data in Brief).
- **Size**: 119,390 genuine hotel reservation records.
- **Properties**: Resort Hotel (Algarve, Portugal) and City Hotel (Lisbon, Portugal).
- **Target Variable**: adr (Average Daily Rate per room night).
- **Audit**: All post-booking features removed to eliminate data leakage.

---

## 11. Feature Engineering Requirements
1. **Property & Accommodation**: hotel, reserved_room_type, meal.
2. **Customer & Group Structure**: adults, children, babies, total_guests, is_repeated_guest, customer_type, is_family.
3. **Temporal Signals**: arrival_date_month, arrival_date_week_number, arrival_date_day_of_month, sin_month, cos_month, season, is_weekend.
4. **Stay Duration**: stays_in_weekend_nights, stays_in_week_nights, total_stay_nights.
5. **Booking Pace**: lead_time, lead_time_bucket (Last-minute, Short, Medium, Long), market_segment, distribution_channel, deposit_type.
6. **Operational Context**: required_car_parking_spaces, total_of_special_requests, estimated_occupancy_rate.

---

## 12. Model Requirements
1. **Baseline Model**: Ridge Regression (L2 Regularized linear model).
2. **Model 1**: Random Forest Regressor (Bagging with 150 estimators, max depth 20).
3. **Model 2**: HistGradientBoostingRegressor / GradientBoosting (Boosting with early stopping).
4. **Model 3**: Extra Trees Regressor (Extremely randomized tree ensemble).

---

## 13. Ensemble Requirements
- **Technique 1 (Performance-Weighted Blending)**:
  Weights optimized via validation MSE minimization.
- **Technique 2 (Stacking Regressor)**:
  Out-of-fold predictions from base models feed a Ridge Meta-Learner.
- **Comparative Analysis**: Validate whether ensemble strictly achieves lower generalization error than individual base models.

---

## 14. Explainability Requirements (XAI)
- **Global Feature Importance**: Permutation Importance & Mean Decrease in Impurity ranking top predictive features across the dataset.
- **Local Explainability**: Additive feature attribution decomposition showing baseline intercept and individual positive/negative delta contributions for each input field.

---

## 15. Dynamic Pricing Engine & Policy
- **Formula**:
  Recommended Price = Clamp( Ensemble Price x (1 + delta_occupancy) x (1 + delta_lead_time) x (1 + delta_season), Min Price, Max Price )
- **Parameters**:
  - Occupancy multiplier: delta_occupancy = (occupancy - 0.70) x 0.5 for occupancy > 70%.
  - Lead time surge: +15% for lead_time < 3 days (urgent/last-minute), -10% for lead_time > 90 days (early bird).
  - Business constraints: Floor price = €35, Ceiling price = €550, Max surge = +60%.

---

## 16. Backend Architecture (FastAPI)
- **Framework**: FastAPI (Python 3.10+), Pydantic v2, Uvicorn.
- **Modularity**:
  - backend/app/api/: Routing endpoints.
  - backend/app/services/: Inference service, pricing engine, dataset analytics.
  - backend/app/schemas.py: Request & response validation models.
- **Endpoints**:
  - GET /health: Health check and model readiness.
  - GET /models: Metadata of all registered models.
  - GET /metrics: Academic benchmark evaluation metrics (MAE, RMSE, R², MAPE).
  - POST /predict: Real-time single quote prediction with dynamic pricing and XAI.
  - POST /predict/batch: Batch pricing prediction.
  - POST /scenario: What-if simulation curve generator.
  - GET /feature-importance: Global feature importance data.
  - GET /dataset-info: Summary statistics and distribution metadata.

---

## 17. Frontend Architecture (React + TypeScript + Tailwind)
- **Framework**: React 18 / 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts.
- **Design System**: Enterprise Revenue Intelligence console (slate/zinc palette, subtle borders, high information density, crisp typography).
- **Core Views**:
  1. Executive Overview: High-level KPIs, model health, revenue velocity.
  2. Price Predictor: Interactive booking configuration with live multi-model and ensemble breakdown.
  3. Model Benchmark & Comparison: Comprehensive metric tables, actual vs predicted plots, error residuals.
  4. Explainable AI Studio: Global importance bar chart, local waterfall attribution cards.
  5. Historical & Seasonal Analytics: ADR trends by month, room type price distributions.
  6. Scenario Simulator: Dynamic multi-variable sandbox with real-time elasticity response curves.

---

## 18. API Specification
*(Full OpenAPI specifications implemented in FastAPI and documented in api.md)*.

---

## 19. Data Storage & Artifacts
- Raw data stored in datasets/raw/hotel_bookings.csv.
- Processed train/test splits stored in datasets/processed/.
- Model binaries (.joblib), pipeline transformers, and metadata JSON stored in model_artifacts/.

---

## 20. Testing Requirements
- Unit Tests: Test data transformations, feature derivations, clamp functions, and pricing multipliers.
- Integration Tests: Test FastAPI endpoint request/response contracts and error handling.
- E2E Tests: Playwright browser automation validating full end-to-end user workflows, form inputs, dynamic updates, and visual components.

---

## 21. Security Considerations
- Input sanitization and bounds checking via Pydantic schemas.
- Strict CORS configuration.
- Zero credential exposure (.env.example template provided).

---

## 22. Performance Requirements
- Model loading on startup under 2.5 seconds.
- API inference response under 50ms per single request.
- Frontend initial render under 500ms.

---

## 23. Deployment Strategy
- Backend runnable via uvicorn backend.app.main:app --port 8000.
- Frontend runnable via npm run dev (Vite dev server) or npm run build static bundle.

---

## 24. Project Architecture
`
dynamic-hotel-pricing/
├── backend/            # FastAPI REST API & Services
├── frontend/           # React + TypeScript + Vite + Tailwind UI
├── ml/                 # Data engineering, training, pipelines, XAI
├── datasets/           # Raw and processed benchmark data
├── model_artifacts/    # Saved .joblib models, scalers, metadata
├── tests/              # Unit, Integration, Playwright E2E tests
└── docs/               # Technical and academic documentation
`

---

## 25. Success Metrics
- Baseline vs Advanced Model R² improvement: > 25% relative boost.
- Ensemble RMSE reduction over best individual model.
- Test suite pass rate: 100% across unit, integration, and E2E tests.

---

## 26. Risks & Mitigations
- Risk: Outlier room rates skewing regression error.  
  Mitigation: Filter non-positive rates and extreme outliers (> €1000) during data cleaning.
- Risk: Overfitting on dominant categorical features.  
  Mitigation: Robust 5-Fold cross-validation and regularized meta-learners.

---

## 27. Limitations
- Dataset originates from Portuguese properties; global generalization requires regional recalibration.
- Real-time competitor pricing is simulated based on market segment indices rather than live web scrapers.

---

## 28. Future Scope
- Reinforcement learning (Contextual Bandits / Q-learning) for autonomous price discovery.
- Integration with live OTA (Online Travel Agency) distribution APIs.

---

## 29. Academic Evaluation Criteria
- Clear problem formulation and literature grounding.
- Rigorous leakage-free feature engineering.
- Transparent multi-model comparison and justified ensemble technique.
- Mathematical rigor in XAI and dynamic pricing formulation.

---

## 30. Acceptance Criteria
- [x] Legitimate public dataset used and documented in datasets.md.
- [x] At least 3 independent ML models + 1 baseline model trained and evaluated.
- [x] Validated ensembling strategy implemented and saved.
- [x] Zero data leakage verified via automated tests.
- [x] FastAPI backend operational with full validation.
- [x] Polished React analytics dashboard with what-if simulator.
- [x] Playwright E2E test suite passing with visual verification.
- [x] Complete suite of markdown documentation files created.
