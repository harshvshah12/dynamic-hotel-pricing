# Experimental Results & Performance Analysis
# Dynamic Hotel Pricing Management System

## 1. Experimental Environment
- **Platform**: AMD / Intel x86_64, Windows 11
- **Runtimes**: Python 3.10.11, Node.js v22.14.0
- **Libraries**: Scikit-Learn 1.7.0, NumPy 1.26.4, Pandas 2.3.3, SciPy 1.13.1, Joblib 1.4.2, Pytest 8.2.2, Playwright 1.49.1
- **Dataset**: Antonio et al. (2019) benchmark dataset ($N=119,390$, sanitized to $N=117,143$).
- **Partitioning**: Stratified 80% Train ($N=93,714$) / 20% Holdout Test ($N=23,429$). Random seed: `seed=42`.

---

## 2. Quantitative Results & Evaluation Matrix

### Table 1: 5-Fold Cross-Validation Performance (Training Partition, N=93,714)
| Model Architecture | Mean CV $R^2$ | Std CV $R^2$ | Mean CV RMSE (€) | Std CV RMSE (€) | Mean CV MAE (€) | Std CV MAE (€) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Ridge Linear Baseline** | 0.5852 | ±0.0030 | €30.00 | ±0.21 | €22.14 | ±0.09 |
| **HistGradientBoosting** | 0.8209 | ±0.0029 | €19.72 | ±0.27 | €13.66 | ±0.07 |
| **Extra Trees Regressor** | 0.8515 | ±0.0034 | €17.95 | ±0.30 | €11.07 | ±0.10 |
| **Random Forest Regressor** | **0.8577** | **±0.0025** | **€17.57** | **±0.25** | **€10.71** | **±0.06** |

---

### Table 2: Final Holdout Test Performance (Test Partition, N=23,429)
| Rank | Model Name | MAE (€) | RMSE (€) | $R^2$ Score | MAPE (%) | MedAE (€) | Explained Variance |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🥇 | **Weighted Blending Ensemble** | **€10.57** | **€17.20** | **0.8619** | **11.26%** | **€5.80** | **0.8620** |
| 🥈 | **Stacking Meta-Regressor** | €10.56 | €17.19 | 0.8621 | 11.21% | €5.75 | 0.8621 |
| 🥉 | **Random Forest Regressor** | €10.53 | €17.25 | 0.8612 | 11.20% | €5.72 | 0.8612 |
| 4 | **Extra Trees Regressor** | €10.88 | €17.68 | 0.8541 | 11.58% | €6.07 | 0.8541 |
| 5 | **HistGradientBoosting** | €13.58 | €19.36 | 0.8251 | 14.89% | €9.45 | 0.8251 |
| 6 | **Ridge Linear Baseline** | €22.03 | €29.87 | 0.5835 | 24.75% | €16.92 | 0.5836 |

---

## 3. Ensembling Weight Distributions
- **SLSQP Optimal Blending Weights**:
  - `w_Ridge` = $0.0000$ ($0.0\%$)
  - `w_RandomForest` = $0.7122$ ($71.2\%$)
  - `w_HistGradientBoosting` = $0.0161$ ($1.6\%$)
  - `w_ExtraTrees` = $0.2716$ ($27.2\%$)
- **Stacking Meta-Model Coefficients (Ridge Meta-Learner)**:
  - $\beta_{\text{Ridge}} = -0.0117$
  - $\beta_{\text{RF}} = 0.7023$
  - $\beta_{\text{HGB}} = 0.0497$
  - $\beta_{\text{ET}} = 0.2785$
