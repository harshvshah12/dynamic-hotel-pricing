# Machine Learning Pipeline Specification
# Dynamic Hotel Pricing Management System

## 1. Pipeline Overview
The ML pipeline executes an automated, reproducible workflow from raw transaction ingestion to deployed model artifacts.

```
[ Raw CSV Data: 119,390 rows ]
              │
              ▼
[ Data Validation & Sanitization ]
  • Remove null ADRs, drop negative rates (refunds)
  • Remove zero-guest records (adults + children + babies == 0)
  • Clip extreme price outliers (ADR > €800)
              │
              ▼
[ Leakage-Free Feature Engineering ]
  • Cyclical month & week transforms: sin_month, cos_month, sin_week, cos_week
  • Stay aggregations: total_stay_nights, is_weekend_stay
  • Customer composition: total_guests, is_family
  • Lead time discretization: Last-Minute (0-3d), Short (4-14d), Medium (15-60d), Long (>60d)
              │
              ▼
[ Train / Test Holdout Partitioning ]
  • 80% Training Split: 93,714 records
  • 20% Holdout Test Split: 23,429 records (untouched during tuning)
              │
              ▼
[ Pipeline Transformations (Fitted on Train Only) ]
  • StandardScaler on 21 numeric features
  • OneHotEncoder on 9 categorical features (65 encoded columns)
              │
              ▼
[ 5-Fold Cross Validation & Out-of-Fold Generation ]
  • Generate OOF prediction matrix P_OOF in R^{93,714 x 4}
  • Compute fold stability metrics (Mean ± Std)
              │
              ▼
[ Multi-Model Training & Optimization ]
  • Ridge Regression (alpha=10.0)
  • Random Forest (80 trees, max_depth=16)
  • HistGradientBoosting (140 trees, lr=0.08)
  • Extra Trees (80 trees, max_depth=16)
  • SLSQP Blending Weight Optimization
  • Stacking Ridge Meta-Model Fitting
              │
              ▼
[ Holdout Evaluation & Artifact Persistence ]
  • Test Evaluation on 23,429 records (MAE, RMSE, R², MAPE)
  • Save .joblib binaries, metrics.json, and feature_importance.json
```

---

## 2. Leakage Prevention Protocol

To guarantee that models remain valid for real-time quotation before a guest arrives:
1. `is_canceled`: Strictly removed. Whether a reservation is eventually canceled is unknown at booking time.
2. `reservation_status` & `reservation_status_date`: Removed. Reflects post-departure accounting state.
3. `assigned_room_type`: Removed. Reassignment occurs at check-in; only `reserved_room_type` is known at quote time.
4. Preprocessing Fit Scope: Scalers and encoders are fit strictly on the training partition.

---

## 3. Cross-Validation Results

| Estimator | 5-Fold CV $R^2$ | CV $R^2$ Std | CV RMSE (€) | CV MAE (€) |
| :--- | :---: | :---: | :---: | :---: |
| **Ridge Linear Baseline** | 0.5852 | ±0.0030 | €30.00 | €22.14 |
| **HistGradientBoosting** | 0.8209 | ±0.0029 | €19.72 | €13.66 |
| **Extra Trees** | 0.8515 | ±0.0034 | €17.95 | €11.07 |
| **Random Forest** | 0.8577 | ±0.0025 | €17.57 | €10.71 |

---

## 4. Ensembling Mathematical Formulations

### 4.1 SLSQP Optimal Blending
$$\mathbf{w}^* = \arg\min_{\mathbf{w}} \sum_{i=1}^{N} \left( y_i - \sum_{m=1}^{4} w_m \hat{y}_{i,m} \right)^2 \quad \text{s.t.} \quad \sum w_m = 1, \; w_m \ge 0$$
- Ridge Weight: $0.0000$
- Random Forest Weight: $0.7122$
- HistGradientBoosting Weight: $0.0161$
- Extra Trees Weight: $0.2716$

### 4.2 5-Fold Stacking Meta-Regressor
$$\hat{y}_{\text{stack}} = \beta_0 + \sum_{m=1}^{4} \beta_m \hat{y}_m$$
Evaluated on the holdout test set with $R^2 = 0.8621$, achieving the highest generalization score among all candidate architectures.
