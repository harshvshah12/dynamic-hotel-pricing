# Academic Model Evaluation & Ensemble Comparison Report
# Dynamic Hotel Pricing Management System

**Dataset**: Hotel Booking Demand Benchmark (119,390 records, 93,714 Train / 23,429 Test)  
**Evaluation Protocol**: 5-Fold Stratified Cross-Validation on Training Split + Strict Holdout Test Evaluation (20%)  
**Target Variable**: Average Daily Rate (ADR in EUR per night)  
**Zero Data Leakage**: All scalers and encoders fit strictly on train split  

---

## 1. Executive Model Leaderboard (Holdout Test Set)

| Rank | Model Name | Model Family | MAE (EUR) | RMSE (EUR) | R2 Score | MAPE (%) | Explained Variance |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | **Weighted Blending Ensemble** | Blending (SLSQP MSE-Optimized) | **EUR 10.573** | **EUR 17.2015** | **0.8619** | **11.26%** | **0.8619** |
| 2 | **Stacking Meta-Regressor** | 5-Fold OOF Meta-Learner (Ridge) | EUR 10.5639 | EUR 17.193 | 0.8621 | 11.21% | 0.8621 |
| 3 | **HistGradientBoosting** | Tree Boosting | EUR 13.5771 | EUR 19.3609 | 0.8251 | 14.89% | 0.8251 |
| 4 | **Random Forest Regressor** | Bagging (80 Trees) | EUR 10.5299 | EUR 17.2471 | 0.8612 | 11.2% | 0.8612 |
| 5 | **Extra Trees Regressor** | Extremely Randomized Trees | EUR 10.8835 | EUR 17.6829 | 0.8541 | 11.58% | 0.8541 |
| 6 | **Ridge Baseline** | Linear L2 Regularized | EUR 22.0334 | EUR 29.874 | 0.5835 | 24.75% | 0.5836 |

---

## 2. 5-Fold Cross-Validation Stability Analysis (Training Set)

| Base Model | CV Mean MAE (EUR) | CV MAE Std (EUR) | CV Mean RMSE (EUR) | CV RMSE Std (EUR) | CV Mean R2 | CV R2 Std |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Ridge Linear Baseline** | EUR 22.1352 | +/- EUR 0.0874 | EUR 30.0013 | +/- EUR 0.2077 | 0.5852 | +/- 0.003 |
| **Random Forest** | EUR 10.707 | +/- EUR 0.0618 | EUR 17.5736 | +/- EUR 0.254 | 0.8577 | +/- 0.0025 |
| **HistGradientBoosting** | EUR 13.6629 | +/- EUR 0.0691 | EUR 19.7175 | +/- EUR 0.2725 | 0.8209 | +/- 0.0029 |
| **Extra Trees** | EUR 11.0703 | +/- EUR 0.1007 | EUR 17.9492 | +/- EUR 0.3018 | 0.8515 | +/- 0.0034 |

---

## 3. Mathematical Ensembling Formulations

### Approach A: Performance-Weighted Blending
The optimal blending weights were derived by minimizing out-of-fold validation Mean Squared Error subject to simplex constraints:
- Ridge Baseline Weight: 0.0
- Random Forest Weight: 0.7122
- HistGradientBoosting Weight: 0.0161
- Extra Trees Weight: 0.2716

### Approach B: 5-Fold Stacking Meta-Regressor
The stacking meta-model utilizes Ridge regression trained on the 5-fold out-of-fold cross-validation predictions:
- Ridge Meta-Model Intercept: EUR -1.9879
- Meta-Weights: Ridge=-0.0117, RF=0.7023, HGB=0.0497, ET=0.2785

---

## 4. Academic Insights & Justification

1. **Non-Linear Dominance over Baseline**: The non-linear tree and gradient boosted models achieve substantial improvement over the linear Ridge baseline (R2 jumps from 0.5835 to > 0.8251). This confirms strong non-linear interactions between room types, seasons, and lead times.
2. **Ensemble Variance Reduction**: Both the Weighted Blending and Stacking Meta-Regressor reduce holdout RMSE compared to individual estimators by combining orthogonal error profiles from Bagging (RF/ET) and Boosting (HGB).
3. **Reproducibility**: Experiments executed with fixed seed `random_state=42` and strict 80/20 train/test separation.
