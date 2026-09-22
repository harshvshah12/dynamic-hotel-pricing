# Mathematical Foundations & Algorithmic Formulations
# Dynamic Hotel Pricing Management System

This document details all mathematical formulations, loss functions, optimization algorithms, statistical ensembling methods, dynamic pricing policies, and explainability metrics implemented across the system.

---

## Table of Contents
1. [Feature Engineering & Preprocessing Mathematics](#1-feature-engineering--preprocessing-mathematics)
2. [Model 1: Ridge Linear Regression (L2 Benchmark)](#2-model-1-ridge-linear-regression-l2-benchmark)
3. [Model 2: Random Forest Regressor (Bagging Ensemble)](#3-model-2-random-forest-regressor-bagging-ensemble)
4. [Model 3: HistGradientBoosting Regressor (Histogram Tree Boosting)](#4-model-3-histgradientboosting-regressor-histogram-tree-boosting)
5. [Model 4: Extra Trees Regressor (Extremely Randomized Trees)](#5-model-4-extra-trees-regressor-extremely-randomized-trees)
6. [Ensemble Optimization: SLSQP Performance-Weighted Blending](#6-ensemble-optimization-slsqp-performance-weighted-blending)
7. [Ensemble Strategy: 5-Fold Cross-Validated Stacking](#7-ensemble-strategy-5-fold-cross-validated-stacking)
8. [Statistical Evaluation Metrics](#8-statistical-evaluation-metrics)
9. [Revenue Management (RM) Dynamic Pricing Layer](#9-revenue-management-rm-dynamic-pricing-layer)
10. [Explainable AI (XAI) Attribution Mathematics](#10-explainable-ai-xai-attribution-mathematics)

---

## 1. Feature Engineering & Preprocessing Mathematics

### 1.1 Cyclical Temporal Encodings
Standard integer representations of calendar features create an artificial discontinuity between the end and beginning of cycles (e.g., December $12 \to$ January $1$, or Sunday $52 \to$ Monday $1$). 

To preserve cyclical temporal geometry in Euclidean space, trigonometric coordinate projections map periodic values onto the 2D unit circle:

$$\text{sin\_month} = \sin\left(\frac{2\pi \cdot m}{12}\right), \quad \text{cos\_month} = \cos\left(\frac{2\pi \cdot m}{12}\right), \quad \text{where } m \in \{1, 2, \dots, 12\}$$

$$\text{sin\_week} = \sin\left(\frac{2\pi \cdot w}{53}\right), \quad \text{cos\_week} = \cos\left(\frac{2\pi \cdot w}{53}\right), \quad \text{where } w \in \{1, 2, \dots, 53\}$$

Distance invariance property between consecutive cycles:
$$\left( \sin\left(\frac{2\pi \cdot 12}{12}\right) - \sin\left(\frac{2\pi \cdot 1}{12}\right) \right)^2 + \left( \cos\left(\frac{2\pi \cdot 12}{12}\right) - \cos\left(\frac{2\pi \cdot 1}{12}\right) \right)^2 = 2 - 2\cos\left(\frac{2\pi}{12}\right) \approx 0.2679$$

### 1.2 Continuous Feature Standardization (Z-Score)
Continuous variables are standardized using empirical sample moments computed strictly on the training partition $D_{\text{train}}$:

$$\mu_j = \frac{1}{N_{\text{train}}} \sum_{i=1}^{N_{\text{train}}} x_{i,j}, \qquad \sigma_j = \sqrt{\frac{1}{N_{\text{train}} - 1} \sum_{i=1}^{N_{\text{train}}} (x_{i,j} - \mu_j)^2}$$

$$z_{i,j} = \frac{x_{i,j} - \mu_j}{\sigma_j + \epsilon}, \quad \text{where } \epsilon = 10^{-8}$$

---

## 2. Model 1: Ridge Linear Regression (L2 Benchmark)

### 2.1 Regularized Cost Function
Ridge Regression minimizes the Residual Sum of Squares (RSS) penalized by the squared Euclidean norm ($L_2$) of the weight vector $\mathbf{w} \in \mathbb{R}^D$:

$$\mathcal{L}_{\text{Ridge}}(\mathbf{w}, b) = \frac{1}{2N} \sum_{i=1}^{N} \left( y_i - (\mathbf{w}^T \mathbf{x}_i + b) \right)^2 + \alpha \|\mathbf{w}\|_2^2$$

In matrix-vector notation (centering $\mathbf{X}$ and $\mathbf{y}$ to absorb intercept $b$):

$$\mathcal{L}_{\text{Ridge}}(\mathbf{w}) = \frac{1}{2N} \|\mathbf{y} - \mathbf{X}\mathbf{w}\|_2^2 + \alpha \mathbf{w}^T \mathbf{w}$$

### 2.2 Analytical Closed-Form Solution
Taking the matrix derivative with respect to $\mathbf{w}$ and setting to zero:

$$\nabla_{\mathbf{w}} \mathcal{L}_{\text{Ridge}} = -\frac{1}{N} \mathbf{X}^T (\mathbf{y} - \mathbf{X}\mathbf{w}) + 2\alpha \mathbf{w} = \mathbf{0}$$

$$\mathbf{X}^T \mathbf{X}\mathbf{w} + 2N\alpha \mathbf{I}\mathbf{w} = \mathbf{X}^T \mathbf{y}$$

$$\mathbf{w}^* = \left( \mathbf{X}^T \mathbf{X} + 2N\alpha \mathbf{I} \right)^{-1} \mathbf{X}^T \mathbf{y}$$

Where:
- $\alpha = 10.0$ imposes shrinkage on non-informative coefficients, ensuring numerical stability when one-hot encoded dummy variables induce multicollinearity.

---

## 3. Model 2: Random Forest Regressor (Bagging Ensemble)

### 3.1 Decision Tree Splitting Criterion (Variance Reduction)
For a node containing subset $S \subseteq D$, the optimal split $(j^*, t^*)$ for feature $j$ and threshold $t$ maximizes empirical variance reduction (Mean Squared Error impurity decrease):

$$\Delta \mathcal{I}(S, j, t) = \text{Var}(S) - \left( \frac{|S_L|}{|S|} \text{Var}(S_L) + \frac{|S_R|}{|S|} \text{Var}(S_R) \right)$$

Where:
$$S_L = \{(\mathbf{x}_i, y_i) \in S : x_{i,j} \le t\}, \quad S_R = \{(\mathbf{x}_i, y_i) \in S : x_{i,j} > t\}$$

$$\text{Var}(S) = \frac{1}{|S|} \sum_{i \in S} (y_i - \bar{y}_S)^2, \quad \bar{y}_S = \frac{1}{|S|} \sum_{i \in S} y_i$$

### 3.2 Bootstrap Aggregation (Bagging) Formula
Given $B = 80$ bootstrap replicates $D_1, D_2, \dots, D_B$ sampled uniformly with replacement ($|D_b| = N$):

$$\hat{y}_{\text{RF}}(\mathbf{x}) = \frac{1}{B} \sum_{b=1}^{B} T_b(\mathbf{x}; \Theta_b)$$

Where $\Theta_b$ parameterizes tree $b$ trained on random feature subsets of size $K = \lfloor 0.60 \times D \rfloor$.

### 3.3 Theoretical Variance Reduction
For $B$ identically distributed trees with individual prediction variance $\sigma^2$ and pairwise correlation $\rho \in (0, 1)$:

$$\text{Var}\left(\hat{y}_{\text{RF}}(\mathbf{x})\right) = \rho \sigma^2 + \frac{1 - \rho}{B} \sigma^2$$

As $B \to \infty$, the second term approaches zero, yielding a theoretical variance upper bound of $\rho \sigma^2$.

---

## 4. Model 3: HistGradientBoosting Regressor (Histogram Tree Boosting)

### 4.1 Forward Stage-Wise Additive Expansion
HistGradientBoosting constructs an additive model by fitting shallow regression trees to the pseudo-residuals of the squared-error loss $\mathcal{L}(y, \hat{y}) = \frac{1}{2}(y - \hat{y})^2$:

$$\hat{y}^{(0)}(\mathbf{x}) = \arg\min_c \sum_{i=1}^N \mathcal{L}(y_i, c) = \bar{y}$$

For iteration $m = 1, 2, \dots, M$ (where $M = 140$):

$$\hat{y}^{(m)}(\mathbf{x}) = \hat{y}^{(m-1)}(\mathbf{x}) + \eta \cdot h_m(\mathbf{x})$$

Where $\eta = 0.08$ is the shrinkage learning rate.

### 4.2 Negative Gradient (Pseudo-Residuals)
$$r_{i,m} = -\left[ \frac{\partial \mathcal{L}(y_i, \hat{y})}{\partial \hat{y}} \right]_{\hat{y} = \hat{y}^{(m-1)}(\mathbf{x}_i)} = y_i - \hat{y}^{(m-1)}(\mathbf{x}_i)$$

### 4.3 Histogram-Binned Split Gain with L2 Regularization
Continuous features are mapped into 256 discrete integer bins $B(x) \in \{0, 1, \dots, 255\}$. For a candidate split at bin $k$:

$$\mathcal{G}(I_L, I_R) = \frac{1}{2} \left[ \frac{\left(\sum_{i \in I_L} g_i\right)^2}{|I_L| + \lambda} + \frac{\left(\sum_{i \in I_R} g_i\right)^2}{|I_R| + \lambda} - \frac{\left(\sum_{i \in I} g_i\right)^2}{|I| + \lambda} \right] - \gamma$$

Where $g_i = -r_{i,m}$, $\lambda = 1.0$ is the $L_2$ leaf weight regularization, and $\gamma$ is the minimum gain required to split.

---

## 5. Model 4: Extra Trees Regressor (Extremely Randomized Trees)

### 5.1 Randomized Cut-Point Generation
Unlike standard Decision Trees which evaluate all possible thresholds for a selected feature, Extra Trees chooses cut-points completely at random from a uniform distribution between the feature's minimum and maximum within the node:

$$t_k \sim \text{Uniform}\left(\min_{i \in S} x_{i,k}, \; \max_{i \in S} x_{i,k}\right)$$

The best among $K$ randomly generated splits is selected according to variance reduction:

$$k^* = \arg\max_{k \in \{1, \dots, K\}} \Delta \mathcal{I}(S, k, t_k)$$

### 5.2 Ensemble Prediction
$$\hat{y}_{\text{ET}}(\mathbf{x}) = \frac{1}{B} \sum_{b=1}^{B} T_b^{\text{extra}}(\mathbf{x})$$

This randomized thresholding decorrelates the base estimators further ($\rho_{\text{ET}} < \rho_{\text{RF}}$), resulting in superior smoothing and reduced variance on continuous target variables like ADR.

---

## 6. Ensemble Optimization: SLSQP Performance-Weighted Blending

### 6.1 Constrained Quadratic Optimization Formulation
Let $\hat{\mathbf{P}}_{\text{OOF}} \in \mathbb{R}^{N_{\text{train}} \times 4}$ denote the Out-Of-Fold cross-validated prediction matrix for our 4 base regressors. We solve for the optimal weight vector $\mathbf{w}^* = [w_1, w_2, w_3, w_4]^T$:

$$\min_{\mathbf{w}} \mathcal{J}(\mathbf{w}) = \frac{1}{N_{\text{train}}} \sum_{i=1}^{N_{\text{train}}} \left( y_i - \sum_{m=1}^{4} w_m \hat{P}_{i,m}^{\text{OOF}} \right)^2$$

$$\text{subject to} \quad \sum_{m=1}^{4} w_m = 1 \quad \text{and} \quad w_m \ge 0, \; \forall m \in \{1, 2, 3, 4\}$$

Expanding into quadratic matrix form:

$$\mathcal{J}(\mathbf{w}) = \frac{1}{2} \mathbf{w}^T \mathbf{Q} \mathbf{w} - \mathbf{c}^T \mathbf{w} + \text{const}$$

Where:
$$\mathbf{Q} = \frac{2}{N_{\text{train}}} \hat{\mathbf{P}}_{\text{OOF}}^T \hat{\mathbf{P}}_{\text{OOF}} \in \mathbb{R}^{4 \times 4}, \qquad \mathbf{c} = \frac{2}{N_{\text{train}}} \hat{\mathbf{P}}_{\text{OOF}}^T \mathbf{y}$$

### 6.2 Karush-Kuhn-Tucker (KKT) Optimality Conditions
The Lagrangian function is:

$$\mathcal{L}(\mathbf{w}, \lambda, \boldsymbol{\mu}) = \frac{1}{2} \mathbf{w}^T \mathbf{Q} \mathbf{w} - \mathbf{c}^T \mathbf{w} + \lambda \left( \sum_{m=1}^4 w_m - 1 \right) - \sum_{m=1}^4 \mu_m w_m$$

The necessary and sufficient conditions for global minimum $\mathbf{w}^*$:
1. **Stationarity**: $\nabla_{\mathbf{w}} \mathcal{L} = \mathbf{Q} \mathbf{w}^* - \mathbf{c} + \lambda^* \mathbf{1} - \boldsymbol{\mu}^* = \mathbf{0}$
2. **Primal Feasibility**: $\sum_{m=1}^4 w_m^* = 1$ and $w_m^* \ge 0$
3. **Dual Feasibility**: $\mu_m^* \ge 0$
4. **Complementary Slackness**: $\mu_m^* w_m^* = 0, \; \forall m \in \{1, 2, 3, 4\}$

### 6.3 Empirical Optimal Weights
Solved via Sequential Least Squares Programming (`scipy.optimize.minimize(method='SLSQP')`):

$$\mathbf{w}^* = \begin{bmatrix} w_{\text{Ridge}} \\ w_{\text{RandomForest}} \\ w_{\text{HistGradientBoosting}} \\ w_{\text{ExtraTrees}} \end{bmatrix} = \begin{bmatrix} 0.0000 \\ 0.7122 \\ 0.0161 \\ 0.2716 \end{bmatrix}$$

---

## 7. Ensemble Strategy: 5-Fold Cross-Validated Stacking

### 7.1 Out-of-Fold Matrix Generation Protocol
To prevent meta-level data leakage, the training set $D_{\text{train}}$ is partitioned into 5 disjoint folds $F_1, F_2, \dots, F_5$.

For each fold $k \in \{1, \dots, 5\}$ and base model $m \in \{1, \dots, 4\}$:
1. Fit estimator on $D_{\text{train}} \setminus F_k$:
   $$\hat{f}_{m}^{(-k)} = \text{Train}(D_{\text{train}} \setminus F_k)$$
2. Generate predictions on validation fold $F_k$:
   $$\hat{P}_{i,m}^{\text{OOF}} = \hat{f}_{m}^{(-k)}(\mathbf{x}_i), \quad \forall i \in F_k$$

### 7.2 Second-Stage Ridge Meta-Regressor
The meta-model $\mathcal{M}$ is trained to map the 4-dimensional OOF feature space to the target ADR:

$$\min_{\boldsymbol{\beta}, \beta_0} \frac{1}{N_{\text{train}}} \sum_{i=1}^{N_{\text{train}}} \left( y_i - \left( \beta_0 + \sum_{m=1}^{4} \beta_m \hat{P}_{i,m}^{\text{OOF}} \right) \right)^2 + \lambda_{\text{meta}} \|\boldsymbol{\beta}\|_2^2$$

### 7.3 Final Stacking Prediction
At inference time on new query vector $\mathbf{x}_{\text{new}}$:

$$\hat{y}_{\text{stack}}(\mathbf{x}_{\text{new}}) = \beta_0 + \sum_{m=1}^{4} \beta_m \cdot \hat{f}_m^{\text{full}}(\mathbf{x}_{\text{new}})$$

Where $\hat{f}_m^{\text{full}}$ is the base estimator retrained on all $N_{\text{train}} = 93,714$ records.

---

## 8. Statistical Evaluation Metrics

Given ground-truth prices $y_i$ and predicted prices $\hat{y}_i$ across test set $N = 23,429$:

### 8.1 Mean Absolute Error (MAE)
Measures average magnitude of errors in raw currency units (€):
$$\text{MAE} = \frac{1}{N} \sum_{i=1}^{N} |y_i - \hat{y}_i|$$

### 8.2 Root Mean Squared Error (RMSE)
Penalizes large outlier pricing errors quadratically:
$$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (y_i - \hat{y}_i)^2}$$

### 8.3 Coefficient of Determination ($R^2$)
Quantifies the proportion of target variance explained by the model:
$$R^2 = 1 - \frac{\text{SS}_{\text{res}}}{\text{SS}_{\text{tot}}} = 1 - \frac{\sum_{i=1}^{N} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{N} (y_i - \bar{y})^2}, \quad \text{where } \bar{y} = \frac{1}{N} \sum_{i=1}^N y_i$$

### 8.4 Mean Absolute Percentage Error (MAPE)
Measures relative scale-independent pricing accuracy:
$$\text{MAPE} = \frac{100\%}{N} \sum_{i=1}^{N} \left| \frac{y_i - \hat{y}_i}{y_i} \right|$$

### 8.5 Explained Variance Score ($EV$)
Measures agreement between variance of true ADR and predicted ADR residuals:
$$\text{EV}(y, \hat{y}) = 1 - \frac{\text{Var}(y - \hat{y})}{\text{Var}(y)}$$

---

## 9. Revenue Management (RM) Dynamic Pricing Layer

The dynamic pricing policy decouples statistical prediction from operational business execution.

### 9.1 Multiplicative Composite Pricing Equation
$$\text{Price}_{\text{rec}} = \text{Clamp}\left( \hat{y}_{\text{ens}} \times \mathcal{M}_{\text{occ}}(\text{Occ}) \times \mathcal{M}_{\text{lead}}(\text{LT}) \times \mathcal{M}_{\text{season}}(S), \quad P_{\text{floor}}, \quad P_{\text{ceiling}} \right)$$

### 9.2 Piecewise Continuous Occupancy Velocity Function
Target capacity benchmark is established at $\text{Occ}^* = 0.70$ (70% occupancy):

$$\mathcal{M}_{\text{occ}}(\text{Occ}) = \begin{cases} 
1.0 + (\text{Occ} - 0.70) \times 0.90, & \text{if } \text{Occ} \ge 0.90 \quad \text{(Critical Surge: } +22.5\% \text{ to } +27.0\%) \\
1.0 + (\text{Occ} - 0.70) \times 0.50, & \text{if } 0.70 \le \text{Occ} < 0.90 \quad \text{(Standard Yield Surge: } +0.0\% \text{ to } +10.0\%) \\
1.0, & \text{if } 0.50 \le \text{Occ} < 0.70 \quad \text{(Equilibrium Neutral)} \\
1.0 - (0.70 - \text{Occ}) \times 0.40, & \text{if } \text{Occ} < 0.50 \quad \text{(Demand Stimulation: } -8.0\% \text{ to } -16.0\%)
\end{cases}$$

### 9.3 Booking Horizon Lead-Time Elasticity Function
$$\mathcal{M}_{\text{lead}}(\text{LT}) = \begin{cases}
1.14, & \text{if } \text{LT} \le 2 \quad \text{(Last-Minute Inelastic Surcharge } +14\%) \\
1.06, & \text{if } 3 \le \text{LT} \le 7 \quad \text{(Near-Term Surcharge } +6\%) \\
1.00, & \text{if } 8 \le \text{LT} \le 30 \quad \text{(Baseline Window)} \\
0.96, & \text{if } 31 \le \text{LT} \le 90 \quad \text{(Advance Booking Discount } -4\%) \\
0.92, & \text{if } \text{LT} > 90 \quad \text{(Early-Bird Incentive } -8\%)
\end{cases}$$

### 9.4 Hard Bounding Function (Clamping)
$$\text{Clamp}(P, P_{\text{floor}}, P_{\text{ceiling}}) = \max\left( P_{\text{floor}}, \; \min\left( P, \; P_{\text{ceiling}} \right) \right)$$
Where:
- $P_{\text{floor}} = €35.00$ (Protects Marginal Operating Cost)
- $P_{\text{ceiling}} = €650.00$ (Protects Brand Equity against Price-Gouging)

### 9.5 90% Confidence Interval Band (Model Epistemic Uncertainty)
Computed via the sample standard deviation of the distinct base estimator predictions:

$$\bar{y}_{\text{models}} = \frac{1}{M} \sum_{m=1}^{M} \hat{y}_m, \qquad s_{\text{models}} = \sqrt{\frac{1}{M - 1} \sum_{m=1}^{M} (\hat{y}_m - \bar{y}_{\text{models}})^2}$$

$$\text{CI}_{90\%} = \left[ \text{Price}_{\text{rec}} - 1.645 \cdot s_{\text{models}}, \quad \text{Price}_{\text{rec}} + 1.645 \cdot s_{\text{models}} \right]$$

---

## 10. Explainable AI (XAI) Attribution Mathematics

### 10.1 Global Mean Decrease in Impurity (MDI)
For an ensemble of $B$ trees, the total Gini/MSE importance for feature $x_j$ is the sum over all nodes $t$ split on $x_j$, weighted by the fraction of samples $p(t) = \frac{N_t}{N}$ reaching node $t$:

$$\text{MDI}(x_j) = \frac{1}{B} \sum_{b=1}^{B} \sum_{t \in T_b : v(t) = j} p(t) \cdot \Delta \text{Var}(t)$$

Normalized to sum to $1.0$:
$$\text{Importance}_{\text{norm}}(x_j) = \frac{\text{MDI}(x_j)}{\sum_{k=1}^{D} \text{MDI}(x_k)}$$

### 10.2 Local Additive Waterfall Attribution
For any individual transaction quote $\mathbf{x}$, the final prediction is decomposed additively relative to the global empirical training baseline mean $\bar{y}_{\text{market}} = €101.83$:

$$\hat{y}(\mathbf{x}) = \bar{y}_{\text{market}} + \sum_{k=1}^{K} \phi_k(\mathbf{x})$$

Where $\phi_k(\mathbf{x})$ represents the directional contribution in euros (€) of feature group $k$:
- **Efficiency Axiom**: $\sum_{k=1}^K \phi_k(\mathbf{x}) = \hat{y}(\mathbf{x}) - \bar{y}_{\text{market}}$
- **Additivity**: Positive factors ($\phi_k > 0$) increase rate above market average; negative factors ($\phi_k < 0$) apply downward adjustments.
