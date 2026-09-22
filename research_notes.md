# Research Notes & Literature Survey
# Dynamic Hotel Pricing Management System

## 1. Domain Overview & Revenue Management Theory
Hotel revenue management systems (RMS) aim to maximize total room revenue from perishable room inventory. Originating in the airline sector following US deregulation (Weatherford & Bodily, 1992; Talluri & van Ryzin, 2004), dynamic pricing models adjust room rates based on stochastic demand, remaining inventory, customer price elasticity, and booking horizon lead times.

### Key Literature Benchmarks:
1. **Talluri & van Ryzin (2004)**: Foundational treatise on dynamic pricing, capacity control, and expected marginal seat/room revenue.
2. **Bitran & Caldentey (2003)**: Classification of dynamic pricing into deterministic vs stochastic demand models.
3. **Cross, Higbie & Cross (2009)**: Evolution of revenue management from simple rule-based yield multipliers to data-driven micro-segmentation.
4. **Antonio, de Almeida & Nunes (2019)**: Published the canonical 119,390 hotel booking transaction dataset (*Data in Brief*, Elsevier) covering H1 (Resort Hotel in Algarve) and H2 (City Hotel in Lisbon).

---

## 2. Identified Research Gap
While commercial RMS (e.g., IDeaS G3, Duetto) employ proprietary statistical engines, existing academic literature in hospitality pricing frequently exhibits three major flaws:
1. **Target Data Leakage**: Many studies inadvertently include post-booking or post-stay features such as cancellation state (`is_canceled`), final reservation outcome (`reservation_status`), or post-checkin room upgrades (`assigned_room_type`), resulting in artificially inflated test accuracy that cannot be deployed in real-time quoting engines.
2. **Lack of Comparative Ensembling**: Prior works typically compare standalone estimators (e.g., Single Decision Tree vs Linear Regression) without exploring constrained out-of-fold convex optimization (SLSQP blending) or multi-family stacking meta-regressors.
3. **Black-Box Opacity**: High-performing tree ensembles are rarely paired with transparent revenue management guardrails (hard price bounds, confidence intervals) or localized feature attribution (waterfall breakdown).

---

## 3. Scientific Hypotheses & Proposed Solutions
- **Hypothesis 1 (Non-Linearity Advantage)**: Tree-based bagging (Random Forest, Extra Trees) and gradient boosting (HistGradientBoosting) will reduce test prediction error (RMSE) by $>35\%$ compared to $L_2$-regularized linear baselines due to complex interactions between room categories, seasonality waves, and advance lead-time categories.
- **Hypothesis 2 (Convex Ensembling Advantage)**: Solving a constrained quadratic minimization problem on out-of-fold cross-validated predictions will lower holdout error variance relative to any single constituent model.
- **Hypothesis 3 (Operational Decoupling)**: Decoupling ML transaction rate prediction from dynamic capacity multipliers guarantees strict administrative compliance (floor and ceiling bounds) while responding dynamically to real-time occupancy velocity.
