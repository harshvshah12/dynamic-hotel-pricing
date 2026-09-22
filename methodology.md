# Academic Research & Machine Learning Methodology
# Dynamic Hotel Pricing Management System

## 1. Research Question & Hypothesis
- **Research Question**: Can a multi-family ensemble of regression models (combining Bagging, Histogram Boosting, and Extremely Randomized Trees) statistically outperform individual base estimators and linear baselines in predicting transaction Average Daily Rate (ADR), and can transparent revenue management policies be effectively integrated without data leakage?
- **Hypothesis**: Non-linear tree-based ensembles will reduce generalization error by $>25\%$ relative to $L_2$ regularized linear regression due to high-order interactions between room categories, seasonal demand peaks, and advance lead times. Furthermore, out-of-fold convex ensembling will achieve lower residual variance than any standalone model.

---

## 2. Experimental Design & Data Partitioning
1. **Dataset**: Antonio et al. (2019) benchmark dataset ($N=119,390$).
2. **Sanitization**: Removed zero-guest anomalies, negative rates, and extreme outliers ($ADR > €800$). Final sample size: $N=117,143$.
3. **Partitioning**: Stratified 80/20 train/test split:
   - Training Partition: $N_{\text{train}} = 93,714$
   - Holdout Test Partition: $N_{\text{test}} = 23,429$
4. **Zero Data Leakage**: All preprocessors (`StandardScaler`, `OneHotEncoder`) were fit exclusively on $N_{\text{train}}$. The holdout test set was transformed without parameter fitting.

---

## 3. Evaluated Algorithmic Families

| Model ID | Family | Loss Function | Regularization / Hyperparameters |
| :--- | :--- | :--- | :--- |
| `baseline_ridge` | Linear L2 | $\min \|y - Xw\|_2^2 + \alpha \|w\|_2^2$ | $\alpha = 10.0$ |
| `random_forest` | Bagging Trees | Squared Error | $n=80$, max_depth=16, max_features=0.6 |
| `hist_gradient_boosting` | Histogram Boosting | Squared Error | max_iter=140, max_depth=12, lr=0.08, l2=1.0 |
| `extra_trees` | Randomized Trees | Squared Error | $n=80$, max_depth=16, max_features=0.6 |
| `weighted_ensemble` | Blending (SLSQP) | MSE on OOF Predictions | Convex weights $\sum w_i = 1, w_i \ge 0$ |
| `stacking_ensemble` | Stacking Meta | Ridge Meta Loss | Ridge meta-learner fit on 5-Fold OOF matrix |

---

## 4. Key Empirical Findings
1. **Linear Model Inadequacy**: Ridge achieved $R^2 = 0.5835$ and RMSE = €29.87. It failed to capture non-linear rate surges during peak summer months.
2. **Tree Boosting & Bagging Dominance**: Random Forest achieved $R^2 = 0.8612$ (RMSE €17.25), and HistGradientBoosting achieved $R^2 = 0.8251$ (RMSE €19.36).
3. **Ensemble Superiority**: The 5-Fold Stacking Meta-Regressor achieved the best generalization score ($R^2 = 0.8621$, RMSE = €17.19), followed closely by the SLSQP Weighted Blend ($R^2 = 0.8619$, RMSE = €17.20).
