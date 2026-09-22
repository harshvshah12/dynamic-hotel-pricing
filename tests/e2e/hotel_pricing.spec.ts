import { test, expect } from '@playwright/test';

test.describe('Dynamic Hotel Pricing Management System E2E Suite', () => {
  test('01. Dashboard Executive Overview renders key KPIs', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/Dynamic Hotel Pricing/i);

    // Verify header branding
    await expect(page.getByText('PRICEX')).toBeVisible();
    await expect(page.getByText('Dynamic RMS v1.0')).toBeVisible();

    // Verify Executive Overview KPI cards
    await expect(page.getByText('Live Recommended ADR')).toBeVisible();
    await expect(page.getByText('Ensemble R² Accuracy')).toBeVisible();
    await expect(page.getByText('Active Model Architecture')).toBeVisible();

    // Take overview screenshot
    await page.screenshot({ path: 'X:/dynamic-hotel-pricing/docs/screenshot_01_overview.png' });
  });

  test('02. Live Price Predictor executes multi-model ensemble inference', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Navigate to Price Predictor tab
    await page.getByRole('button', { name: 'Price Predictor' }).click();
    await expect(page.getByText('Quote Configuration')).toBeVisible();

    // Select Room Tier D (Executive Suite)
    await page.locator('select').first().selectOption('D');

    // Click prediction submit button
    const predictBtn = page.getByRole('button', { name: /Execute Ensemble Price Prediction/i });
    await predictBtn.click();

    // Verify Recommended Dynamic ADR hero section appears
    await expect(page.getByText('Recommended Dynamic ADR')).toBeVisible();
    await expect(page.getByText('90% Confidence Interval')).toBeVisible();

    // Verify all 4 base models appear
    await expect(page.getByText('Ridge Linear Baseline')).toBeVisible();
    await expect(page.getByText('Random Forest Regressor')).toBeVisible();
    await expect(page.getByText('HistGradientBoosting Regressor')).toBeVisible();
    await expect(page.getByText('Extra Trees Regressor')).toBeVisible();

    // Verify Ensembles appear
    await expect(page.getByText('Weighted Blending Ensemble (Selected)')).toBeVisible();
    await expect(page.getByText('Stacking Meta-Regressor')).toBeVisible();

    // Take predictor screenshot
    await page.screenshot({ path: 'X:/dynamic-hotel-pricing/docs/screenshot_02_prediction.png' });
  });

  test('03. Academic Model Benchmark Leaderboard and Visualizations render', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Navigate to Model Benchmark tab
    await page.getByRole('button', { name: /Model Benchmark/i }).click();

    // Verify Leaderboard Table
    await expect(page.getByText('Holdout Test Set Performance Leaderboard')).toBeVisible();
    await expect(page.getByText('5-Fold Cross-Validation Stability')).toBeVisible();

    // Verify Metrics Presence
    await expect(page.getByText('MAE (€)')).toBeVisible();
    await expect(page.getByText('RMSE (€)')).toBeVisible();
    await expect(page.getByText('R² Score')).toBeVisible();

    // Take model benchmark screenshot
    await page.screenshot({ path: 'X:/dynamic-hotel-pricing/docs/screenshot_03_benchmark.png' });
  });

  test('04. Scenario Simulator dynamically updates elasticity curves', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Navigate to Scenario Simulator tab
    await page.getByRole('button', { name: 'Scenario Simulator' }).click();
    await expect(page.getByText('Interactive What-If Dynamic Pricing Sandbox')).toBeVisible();

    // Verify elasticity trajectories
    await expect(page.getByText('Occupancy Elasticity Trajectory')).toBeVisible();
    await expect(page.getByText('Lead-Time Discount / Surge Decay Curve')).toBeVisible();

    // Take simulator screenshot
    await page.screenshot({ path: 'X:/dynamic-hotel-pricing/docs/screenshot_04_simulator.png' });
  });

  test('05. Explainable AI Studio renders feature importances and local attribution', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Navigate to Explainable AI tab
    await page.getByRole('button', { name: /Explainable AI/i }).click();

    // Verify Global and Local panels
    await expect(page.getByText('Global Feature Importance')).toBeVisible();
    await expect(page.getByText('Live Quote Attribution Breakdown')).toBeVisible();
    await expect(page.getByText('Attribution Synthesis')).toBeVisible();

    // Take XAI screenshot
    await page.screenshot({ path: 'X:/dynamic-hotel-pricing/docs/screenshot_05_xai.png' });
  });

  test('06. Revenue Rules & Operational Guardrails view renders', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Navigate to Revenue Rules
    await page.getByRole('button', { name: 'Revenue Rules' }).click();
    await expect(page.getByText('Operational Revenue Management & Pricing Guardrails')).toBeVisible();
    await expect(page.getByText('Hard Floor & Ceiling Guardrails')).toBeVisible();

    // Take rules screenshot
    await page.screenshot({ path: 'X:/dynamic-hotel-pricing/docs/screenshot_06_rules.png' });
  });
});
