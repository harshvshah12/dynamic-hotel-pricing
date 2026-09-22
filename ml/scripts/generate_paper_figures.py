"""
Generate Publication-Quality IEEE Research Figures
Dynamic Hotel Pricing Management System
"""
import os
import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, PROJECT_ROOT)

OUTPUT_DIR = os.path.join(PROJECT_ROOT, 'paper_figures')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Publication visual style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['Arial', 'Helvetica', 'DejaVu Sans'],
    'font.size': 10,
    'axes.labelsize': 11,
    'axes.titlesize': 12,
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'legend.fontsize': 9,
    'figure.titlesize': 13,
    'figure.dpi': 300,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight'
})

def generate_system_architecture_diagram():
    print("Generating Figure 1: System Architecture Diagram...")
    fig, ax = plt.subplots(figsize=(10, 4.8))
    ax.axis('off')

    # Draw boxes
    boxes = [
        ("Data Ingestion\n(Antonio et al., 119k rows)", 0.05, 0.65, 0.18, 0.25, '#d9edf7'),
        ("Leakage-Free Preprocessing\n(StandardScaler, OneHot)", 0.28, 0.65, 0.20, 0.25, '#dff0d8'),
        ("Multi-Family ML Models\n(Ridge, RF, HGB, ET)", 0.53, 0.65, 0.20, 0.25, '#fcf8e3'),
        ("Ensemble Engine\n(SLSQP Blend + Stacking)", 0.77, 0.65, 0.19, 0.25, '#f2dede'),
        ("FastAPI Backend Service\n(REST Endpoints, Swagger)", 0.28, 0.15, 0.22, 0.25, '#e8eaf6'),
        ("Dynamic Pricing Engine\n(Occupancy, Lead Time, Bounds)", 0.53, 0.15, 0.22, 0.25, '#fce4ec'),
        ("React + TS Dashboard\n(What-If Sandbox, XAI)", 0.78, 0.15, 0.18, 0.25, '#e0f2f1'),
    ]

    for text, x, y, w, h, color in boxes:
        rect = plt.Rectangle((x, y), w, h, facecolor=color, edgecolor='#333333', linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#111111')

    # Add arrows
    arrow_props = dict(facecolor='#444444', edgecolor='#444444', arrowstyle="->", lw=1.75)
    ax.annotate('', xy=(0.28, 0.775), xytext=(0.23, 0.775), arrowprops=arrow_props)
    ax.annotate('', xy=(0.53, 0.775), xytext=(0.48, 0.775), arrowprops=arrow_props)
    ax.annotate('', xy=(0.77, 0.775), xytext=(0.73, 0.775), arrowprops=arrow_props)
    
    # Downward arrow from Ensemble to Dynamic RM
    ax.annotate('', xy=(0.64, 0.40), xytext=(0.865, 0.65), arrowprops=arrow_props)
    # Arrow from Dynamic RM to FastAPI
    ax.annotate('', xy=(0.50, 0.275), xytext=(0.53, 0.275), arrowprops=arrow_props)
    # Arrow between FastAPI and Frontend
    ax.annotate('', xy=(0.78, 0.275), xytext=(0.50, 0.275), arrowprops=arrow_props)

    ax.set_title("End-to-End System Architecture of Dynamic Hotel Pricing Platform", pad=10, fontsize=11, fontweight='bold')
    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig1_system_architecture.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

def generate_ensemble_schematic():
    print("Generating Figure 3: Ensemble Architecture Schematic...")
    fig, ax = plt.subplots(figsize=(9, 4.5))
    ax.axis('off')

    # Draw Model Inputs
    models = [
        ("Ridge Linear Baseline\n(L2 Benchmark)", 0.05, 0.75, 0.22, 0.16, '#e0e0e0'),
        ("Random Forest Regressor\n(Bagging 80 Trees)", 0.05, 0.52, 0.22, 0.16, '#c8e6c9'),
        ("HistGradientBoosting\n(Histogram Boosting)", 0.05, 0.29, 0.22, 0.16, '#b3e5fc'),
        ("Extra Trees Regressor\n(Randomized Trees)", 0.05, 0.06, 0.22, 0.16, '#ffe0b2'),
    ]
    for text, x, y, w, h, color in models:
        rect = plt.Rectangle((x, y), w, h, facecolor=color, edgecolor='#333333', linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=8, fontweight='bold')

    # Ensemble Box
    rect_ens = plt.Rectangle((0.40, 0.25), 0.26, 0.50, facecolor='#f8bbd0', edgecolor='#880e4f', linewidth=2.0)
    ax.add_patch(rect_ens)
    ax.text(0.53, 0.58, "SLSQP Performance-Weighted\nBlending Optimization", ha='center', va='center', fontsize=9, fontweight='bold')
    ax.text(0.53, 0.38, "w* = argmin sum(y - sum(w_m P_m))^2\nw_RF: 71.2% | w_ET: 27.2%\nw_HGB: 1.6% | w_Ridge: 0.0%", ha='center', va='center', fontsize=7.5, family='monospace')

    # Final Output
    rect_out = plt.Rectangle((0.76, 0.35), 0.20, 0.30, facecolor='#d1c4e9', edgecolor='#4a148c', linewidth=2.0)
    ax.add_patch(rect_out)
    ax.text(0.86, 0.55, "Ensemble Predicted Rate\n(y_ens = €137.85)", ha='center', va='center', fontsize=8.5, fontweight='bold')
    ax.text(0.86, 0.42, "Holdout R² = 0.8619\nRMSE = €17.20", ha='center', va='center', fontsize=8, family='monospace')

    # Arrows
    arrow_props = dict(facecolor='#333333', edgecolor='#333333', arrowstyle="->", lw=1.5)
    ax.annotate('', xy=(0.40, 0.83), xytext=(0.27, 0.83), arrowprops=arrow_props)
    ax.annotate('', xy=(0.40, 0.60), xytext=(0.27, 0.60), arrowprops=arrow_props)
    ax.annotate('', xy=(0.40, 0.37), xytext=(0.27, 0.37), arrowprops=arrow_props)
    ax.annotate('', xy=(0.40, 0.14), xytext=(0.27, 0.14), arrowprops=arrow_props)
    ax.annotate('', xy=(0.76, 0.50), xytext=(0.66, 0.50), arrowprops=arrow_props)

    ax.set_title("SLSQP Performance-Weighted Blending Optimization Framework", pad=10, fontsize=11, fontweight='bold')
    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig3_ensemble_architecture.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

def generate_eda_figures():
    print("Generating Figure 4: EDA Price Distributions...")
    csv_path = os.path.join(PROJECT_ROOT, 'datasets', 'raw', 'hotel_bookings.csv')
    if not os.path.exists(csv_path):
        print("Dataset not found at", csv_path)
        return
    df = pd.read_csv(csv_path)
    df_clean = df[(df['adr'] > 0) & (df['adr'] <= 500)].copy()

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2))

    # Subplot A: ADR Distribution by Hotel Type
    sns.kdeplot(data=df_clean, x='adr', hue='hotel', common_norm=False, fill=True, alpha=0.35,
                palette=['#1f77b4', '#ff7f0e'], ax=ax1)
    ax1.set_title('(a) Empirical ADR Density by Property Type')
    ax1.set_xlabel('Average Daily Rate (ADR in €)')
    ax1.set_ylabel('Probability Density')
    ax1.axvline(df_clean[df_clean['hotel'] == 'Resort Hotel']['adr'].median(), color='#1f77b4', linestyle='--', label='Resort Median (€75.0)')
    ax1.axvline(df_clean[df_clean['hotel'] == 'City Hotel']['adr'].median(), color='#ff7f0e', linestyle='--', label='City Median (€100.0)')
    ax1.legend(loc='upper right')

    # Subplot B: Monthly Seasonality Boxplot
    months_order = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December']
    short_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    sns.boxplot(data=df_clean, x='arrival_date_month', y='adr', order=months_order, 
                showfliers=False, palette='crest', ax=ax2)
    ax2.set_title('(b) Monthly ADR Seasonality Dynamics')
    ax2.set_xlabel('Arrival Month')
    ax2.set_ylabel('Average Daily Rate (€)')
    ax2.set_xticklabels(short_months, rotation=45)

    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig4_eda_distributions.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

def generate_correlation_heatmap():
    print("Generating Figure 5: Feature Correlation Matrix...")
    csv_path = os.path.join(PROJECT_ROOT, 'datasets', 'raw', 'hotel_bookings.csv')
    df = pd.read_csv(csv_path)
    df_clean = df[(df['adr'] > 0) & (df['adr'] <= 500)].copy()

    # Preprocess a subset of numerical features
    df_clean['total_stay'] = df_clean['stays_in_weekend_nights'] + df_clean['stays_in_week_nights']
    df_clean['total_guests'] = df_clean['adults'] + df_clean['children'].fillna(0) + df_clean['babies']

    corr_cols = [
        'adr', 'lead_time', 'total_stay', 'stays_in_week_nights', 'stays_in_weekend_nights',
        'adults', 'children', 'total_guests', 'is_repeated_guest', 'previous_cancellations',
        'booking_changes', 'total_of_special_requests'
    ]
    col_labels = [
        'ADR (€)', 'Lead Time', 'Total Stay', 'Week Nights', 'W/E Nights',
        'Adults', 'Children', 'Guests', 'Repeat Guest', 'Prev Cancels',
        'Bk Changes', 'Special Reqs'
    ]

    corr_matrix = df_clean[corr_cols].corr()

    fig, ax = plt.subplots(figsize=(8, 6.5))
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    sns.heatmap(corr_matrix, mask=mask, annot=True, fmt=".2f", cmap='vlag', vmin=-0.3, vmax=0.8,
                xticklabels=col_labels, yticklabels=col_labels, cbar_kws={'label': 'Pearson Correlation (r)'}, ax=ax)
    ax.set_title('Feature Correlation Matrix with ADR Target', pad=12)
    plt.xticks(rotation=45, ha='right')

    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig5_correlation_heatmap.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

def generate_model_comparison_charts():
    print("Generating Figure 6: Model Performance Comparison...")
    metrics_path = os.path.join(PROJECT_ROOT, 'model_artifacts', 'metrics.json')
    with open(metrics_path, 'r', encoding='utf-8') as f:
        metrics = json.load(f)

    models = [
        'Ridge Baseline', 'HistGradient\nBoosting', 'Extra Trees', 
        'Random Forest', 'SLSQP Weighted\nEnsemble', 'Stacking Meta\nRegressor'
    ]
    model_keys = [
        'baseline_ridge', 'hist_gradient_boosting', 'extra_trees', 
        'random_forest', 'weighted_ensemble', 'stacking_ensemble'
    ]

    r2_scores = [metrics[k]['test_metrics']['r2'] for k in model_keys]
    rmse_scores = [metrics[k]['test_metrics']['rmse'] for k in model_keys]
    mae_scores = [metrics[k]['test_metrics']['mae'] for k in model_keys]
    mape_scores = [metrics[k]['test_metrics']['mape_pct'] for k in model_keys]

    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(10, 7.5))

    colors = ['#7f7f7f', '#17becf', '#2ca02c', '#1f77b4', '#d62728', '#9467bd']

    # Subplot 1: R2
    bars1 = ax1.bar(models, r2_scores, color=colors, edgecolor='black', alpha=0.85)
    ax1.set_ylabel('Coefficient of Determination ($R^2$)')
    ax1.set_title('(a) Holdout $R^2$ Variance Explained (Higher is Better)')
    ax1.set_ylim(0.5, 0.92)
    for b in bars1:
        ax1.text(b.get_x() + b.get_width()/2, b.get_height() + 0.008, f"{b.get_height():.4f}", ha='center', fontsize=8, fontweight='bold')
    ax1.tick_params(axis='x', rotation=30)

    # Subplot 2: RMSE
    bars2 = ax2.bar(models, rmse_scores, color=colors, edgecolor='black', alpha=0.85)
    ax2.set_ylabel('RMSE (€)')
    ax2.set_title('(b) Root Mean Squared Error (Lower is Better)')
    ax2.set_ylim(0, 35)
    for b in bars2:
        ax2.text(b.get_x() + b.get_width()/2, b.get_height() + 0.6, f"€{b.get_height():.2f}", ha='center', fontsize=8, fontweight='bold')
    ax2.tick_params(axis='x', rotation=30)

    # Subplot 3: MAE
    bars3 = ax3.bar(models, mae_scores, color=colors, edgecolor='black', alpha=0.85)
    ax3.set_ylabel('MAE (€)')
    ax3.set_title('(c) Mean Absolute Error (Lower is Better)')
    ax3.set_ylim(0, 26)
    for b in bars3:
        ax3.text(b.get_x() + b.get_width()/2, b.get_height() + 0.5, f"€{b.get_height():.2f}", ha='center', fontsize=8, fontweight='bold')
    ax3.tick_params(axis='x', rotation=30)

    # Subplot 4: MAPE
    bars4 = ax4.bar(models, mape_scores, color=colors, edgecolor='black', alpha=0.85)
    ax4.set_ylabel('MAPE (%)')
    ax4.set_title('(d) Mean Absolute Percentage Error (Lower is Better)')
    ax4.set_ylim(0, 28)
    for b in bars4:
        ax4.text(b.get_x() + b.get_width()/2, b.get_height() + 0.5, f"{b.get_height():.1f}%", ha='center', fontsize=8, fontweight='bold')
    ax4.tick_params(axis='x', rotation=30)

    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig6_model_performance_comparison.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

def generate_actual_vs_predicted_and_residuals():
    print("Generating Figure 7 & 8: Actual vs Predicted & Residuals...")
    eval_path = os.path.join(PROJECT_ROOT, 'model_artifacts', 'eval_results.json')
    with open(eval_path, 'r', encoding='utf-8') as f:
        eval_data = json.load(f)

    scatter_samples = eval_data['scatter_samples']
    actual = np.array([s['actual_adr'] for s in scatter_samples])
    pred = np.array([s['weighted_pred'] for s in scatter_samples])
    residuals = actual - pred

    # Figure 7: Actual vs Predicted Scatter
    fig, ax = plt.subplots(figsize=(6.5, 5.5))
    ax.scatter(actual, pred, alpha=0.55, edgecolors='none', color='#1f77b4', s=35, label='Holdout Test Samples ($N=400$)')
    max_val = max(actual.max(), pred.max()) + 10
    min_val = 0
    ax.plot([min_val, max_val], [min_val, max_val], 'r--', linewidth=1.75, label='Ideal Perfect Agreement ($y = \hat{y}$)')
    ax.set_xlim(0, max_val)
    ax.set_ylim(0, max_val)
    ax.set_xlabel('Actual Transaction ADR (€)')
    ax.set_ylabel('Ensemble Predicted ADR (€)')
    ax.set_title('Actual vs. Predicted Room Rate (SLSQP Ensemble, $R^2 = 0.8619$)')
    ax.legend(loc='upper left')

    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig7_actual_vs_predicted.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

    # Figure 8: Residual Distribution & Error Pacing
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2))

    # Subplot A: Residual Histogram
    sns.histplot(residuals, kde=True, color='#2ca02c', bins=25, ax=ax1)
    ax1.axvline(0, color='red', linestyle='--', linewidth=1.5)
    ax1.set_title('(a) Holdout Residual Error Distribution')
    ax1.set_xlabel('Residual Error $e_i = y_i - \hat{y}_i$ (€)')
    ax1.set_ylabel('Frequency Count')

    # Subplot B: Residuals vs Predicted
    ax2.scatter(pred, residuals, alpha=0.5, color='#9467bd', s=30)
    ax2.axhline(0, color='red', linestyle='--', linewidth=1.5)
    ax2.set_title('(b) Residuals vs. Predicted Rate (Homoscedasticity)')
    ax2.set_xlabel('Predicted ADR (€)')
    ax2.set_ylabel('Residual Error (€)')

    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig8_residual_analysis.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

def generate_feature_importance_plot():
    print("Generating Figure 9: Global Feature Importance...")
    imp_path = os.path.join(PROJECT_ROOT, 'model_artifacts', 'feature_importance.json')
    with open(imp_path, 'r', encoding='utf-8') as f:
        imp_data = json.load(f)

    top_features = imp_data.get('top_feature_groups', [])[:12]
    features = [f['feature'] for f in top_features][::-1]
    importances = [f['importance_pct'] for f in top_features][::-1]

    fig, ax = plt.subplots(figsize=(8, 5.2))
    bars = ax.barh(features, importances, color='#1f77b4', edgecolor='black', alpha=0.85)
    ax.set_xlabel('Relative Importance Score (%)')
    ax.set_title('Top 12 Feature Importances via Mean Decrease in Impurity (MDI)')
    for b in bars:
        ax.text(b.get_width() + 0.3, b.get_y() + b.get_height()/2, f"{b.get_width():.1f}%", va='center', fontsize=8.5)
    ax.set_xlim(0, max(importances) + 4)

    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig9_feature_importance.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

def generate_dynamic_pricing_scenario_curves():
    print("Generating Figure 10: Dynamic Pricing Response Curves...")
    occ_points = np.linspace(0.20, 1.00, 50)
    base_price = 120.0

    occ_mults = []
    for occ in occ_points:
        if occ >= 0.90:
            m = 1.0 + (occ - 0.70) * 0.90
        elif occ >= 0.70:
            m = 1.0 + (occ - 0.70) * 0.50
        elif occ >= 0.50:
            m = 1.00
        else:
            m = 1.0 - (0.70 - occ) * 0.40
        occ_mults.append(m)

    dynamic_prices = [base_price * m for m in occ_mults]

    lt_days = np.array([1, 2, 3, 5, 7, 10, 14, 21, 30, 45, 60, 90, 120, 180])
    lt_mults = []
    for lt in lt_days:
        if lt <= 2:
            lt_mults.append(1.14)
        elif lt <= 7:
            lt_mults.append(1.06)
        elif lt <= 30:
            lt_mults.append(1.00)
        elif lt <= 90:
            lt_mults.append(0.96)
        else:
            lt_mults.append(0.92)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2))

    # Subplot A: Occupancy Elasticity
    ax1.plot(occ_points * 100, dynamic_prices, color='#d62728', linewidth=2.5, label='Recommended Dynamic Price')
    ax1.axhline(base_price, color='gray', linestyle='--', label='ML Base Clearing Price (€120)')
    ax1.axvline(70, color='blue', linestyle=':', label='Target Capacity Benchmark (70%)')
    ax1.set_title('(a) Occupancy Elasticity Response Curve')
    ax1.set_xlabel('Hotel Current Occupancy Rate (%)')
    ax1.set_ylabel('Recommended Price (€ / night)')
    ax1.legend(loc='upper left')

    # Subplot B: Lead Time Step Curve
    ax2.step(lt_days, [base_price * m for m in lt_mults], color='#1f77b4', linewidth=2.5, where='post', label='Recommended Price vs Lead Time')
    ax2.axhline(base_price, color='gray', linestyle='--', label='ML Base Price (€120)')
    ax2.set_title('(b) Booking Horizon Lead-Time Adjustment')
    ax2.set_xlabel('Lead Time (Days Prior to Arrival)')
    ax2.set_ylabel('Recommended Price (€ / night)')
    ax2.legend(loc='upper right')

    plt.tight_layout()
    fig_path = os.path.join(OUTPUT_DIR, 'fig10_dynamic_pricing_curves.png')
    plt.savefig(fig_path)
    plt.close()
    print(f"Saved: {fig_path}")

if __name__ == '__main__':
    generate_system_architecture_diagram()
    generate_ensemble_schematic()
    generate_eda_figures()
    generate_correlation_heatmap()
    generate_model_comparison_charts()
    generate_actual_vs_predicted_and_residuals()
    generate_feature_importance_plot()
    generate_dynamic_pricing_scenario_curves()
    print("\nAll publication scientific figures successfully generated in", OUTPUT_DIR)
