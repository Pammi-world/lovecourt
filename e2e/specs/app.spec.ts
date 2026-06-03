import { test, expect } from '@playwright/test';
import { LandingPage, PartnerAFormPage, PartnerBFormPage, VerdictPage, HistoryPage } from '../pages/app-pages';

test.describe('Love Court E2E Tests', () => {
  let landing: LandingPage;
  let formA: PartnerAFormPage;
  let formB: PartnerBFormPage;
  let verdict: VerdictPage;
  let history: HistoryPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
    formA = new PartnerAFormPage(page);
    formB = new PartnerBFormPage(page);
    verdict = new VerdictPage(page);
    history = new HistoryPage(page);
  });

  test.describe('Landing Page', () => {
    test('should load and display title', async ({ page }) => {
      await landing.goto();
      await expect(landing.tagline).toBeVisible();
      await expect(landing.title).toContainText('Judge Decide');
    });

    test('should navigate to Partner A form', async ({ page }) => {
      await landing.goto();
      await landing.clickPartnerA();
      await expect(page).toHaveURL(/partner-a/);
      await expect(formA.heading).toBeVisible();
    });

    test('should navigate to Partner B form', async ({ page }) => {
      await landing.goto();
      await landing.clickPartnerB();
      await expect(page).toHaveURL(/partner-b/);
      await expect(formB.heading).toBeVisible();
    });

    test('should navigate to history', async ({ page }) => {
      await landing.goto();
      await landing.clickHistory();
      await expect(page).toHaveURL(/history/);
      await expect(history.heading).toBeVisible();
    });
  });

  test.describe('Partner A Form', () => {
    test('should load with heading', async () => {
      await formA.goto();
      await expect(formA.heading).toBeVisible();
    });

    test('should validate required fields', async () => {
      await formA.goto();
      await formA.submit();
      const error = await formA.getError();
      expect(error).toBeTruthy();
    });

    test('should submit valid form', async ({ page }) => {
      await formA.goto();
      await formA.selectCategory('Chores');
      await formA.selectIntensity(3);
      await formA.fillDescription('This is a test description that is more than twenty characters long for validation.');
      await formA.submit();
      await expect(page).toHaveURL(/partner-b/);
    });
  });

  test.describe('Partner B Form', () => {
    test('should show Partner A summary', async ({ page }) => {
      // First create a case
      await formA.goto();
      await formA.selectCategory('Money');
      await formA.selectIntensity(4);
      await formA.fillDescription('Partner A says they are right about the money situation.');
      await formA.submit();
      
      // Then check Partner B sees it
      await expect(formB.heading).toBeVisible();
      await expect(await formB.seePartnerASummary()).toBe(true);
    });

    test('should submit valid response', async ({ page }) => {
      await formA.goto();
      await formA.selectCategory('Money');
      await formA.selectIntensity(4);
      await formA.fillDescription('Partner A test description for B to see.');
      await formA.submit();

      await formB.selectCategory('Money');
      await formB.selectIntensity(2);
      await formB.fillResponse('But I disagree because of reasons that are valid.');
      await formB.submit();
      
      await expect(page).toHaveURL(/verdict/);
    });
  });

  test.describe('Verdict Page', () => {
    test('should show verdict after both submissions', async () => {
      // Complete full flow first
      await formA.goto();
      await formA.selectCategory('Time');
      await formA.selectIntensity(5);
      await formA.fillDescription('Partner A believes they should get more time for gaming.');
      await formA.submit();

      await formB.selectCategory('Time');
      await formB.selectIntensity(3);
      await formB.fillResponse('But we agreed on limited gaming hours only.');
      await formB.submit();

      // Verify verdict shows
      await verdict.waitForVerdict();
      await expect(verdict.verdict).toBeVisible();
      await expect(verdict.reasoning).toBeVisible();
    });

    test('should navigate to new case from verdict', async ({ page }) => {
      await formA.goto();
      await formA.selectCategory('Chores');
      await formA.selectIntensity(2);
      await formA.fillDescription('Testing navigation from verdict.');
      await formA.submit();

      await formB.selectCategory('Chores');
      await formB.selectIntensity(1);
      await formB.fillResponse('Testing back navigation.');
      await formB.submit();

      await verdict.waitForVerdict();
      await verdict.clickNewCase();
      await expect(page).toHaveURL(/partner-a/);
    });
  });

  test.describe('History Page', () => {
    test('should load and show heading', async () => {
      await history.goto();
      await expect(history.heading).toBeVisible();
    });
  });
});