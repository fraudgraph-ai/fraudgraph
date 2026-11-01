import { test, expect } from '@playwright/test';

test.describe('FraudGraph AI — Enterprise Workbench E2E Test Suite', () => {
  test('Command Center telemetry and navigation renders accurately', async ({ page }) => {
    await page.goto('/');

    // Validate page header and brand title
    await expect(page.locator('text=Command Center')).toBeVisible();
    await expect(page.locator('text=FraudGraph AI')).toBeVisible();

    // Validate core metric cards
    await expect(page.locator('text=Active Investigations')).toBeVisible();
    await expect(page.locator('text=High-Priority Alerts')).toBeVisible();
  });

  test('Graph Explorer loads interactive canvas and runs PageRank analysis', async ({ page }) => {
    await page.goto('/');

    // Navigate to Graph Explorer
    await page.click('button:has-text("Graph Explorer")');
    await expect(page.locator('h1:has-text("Graph Explorer")')).toBeVisible();

    // Verify Run Analysis button is clickable
    const runBtn = page.locator('button:has-text("Run Analysis")');
    await expect(runBtn).toBeVisible();
    await runBtn.click();

    // Validate analytics banner or notification
    await expect(page.locator('text=Running Algorithms')).toBeVisible();
  });

  test('Investigation Workspace executes hypothesis test and renders stages', async ({ page }) => {
    await page.goto('/');

    // Navigate to Investigation Workspace
    await page.click('button:has-text("Investigation Workspace")');
    await expect(page.locator('text=Case Overview')).toBeVisible();

    // Trigger hypothesis test
    const hypBtn = page.locator('button:has-text("Run Hypothesis Test")');
    await expect(hypBtn).toBeVisible();
    await hypBtn.click();

    // Verify stage update or loading state
    await expect(page.locator('text=Evaluating Hypotheses...')).toBeVisible();
  });

  test('Agent Operations allows dynamic live agent execution dispatch', async ({ page }) => {
    await page.goto('/');

    // Navigate to Agent Operations
    await page.click('button:has-text("Agent Operations")');
    await expect(page.locator('h1:has-text("Agent Operations")')).toBeVisible();

    // Verify total agents counter
    await expect(page.locator('text=36').first()).toBeVisible();

    // Trigger Live Agent Run
    const liveRunBtn = page.locator('button:has-text("Trigger Live Agent Run")');
    await expect(liveRunBtn).toBeVisible();
    await liveRunBtn.click();

    // Verify live trace transition
    await expect(page.locator('text=Orchestrating Agents...')).toBeVisible();
  });

  test('Evidence Center provides SHA-256 integrity verification and SAR export', async ({ page }) => {
    await page.goto('/');

    // Navigate to Evidence Center
    await page.click('button:has-text("Evidence Center")');
    await expect(page.locator('h1:has-text("Evidence Center")')).toBeVisible();

    // Verify SAR XML Export button
    await expect(page.locator('button:has-text("Export SAR XML (FinCEN)")')).toBeVisible();

    // Verify Merkle proof button
    const verifyBtn = page.locator('button:has-text("Verify Proof")');
    await expect(verifyBtn).toBeVisible();
    await verifyBtn.click();
  });

  test('Model Intelligence toggles empirical cross-dataset leaderboard (RQ-07)', async ({ page }) => {
    await page.goto('/');

    // Navigate to Model Intelligence
    await page.click('button:has-text("Model Intelligence")');
    await expect(page.locator('h1:has-text("Model Intelligence")')).toBeVisible();

    // Switch to Leaderboard tab
    const leaderboardTab = page.locator('button:has-text("Cross-Dataset Empirical Leaderboard")');
    await expect(leaderboardTab).toBeVisible();
    await leaderboardTab.click();

    // Verify empirical findings card and champion model
    await expect(page.locator('text=Empirical Generalization Finding (RQ-07)')).toBeVisible();
    await expect(page.locator('text=FraudGraph AI Full Multi-Agent Fusion')).toBeVisible();
  });
});
