import { Page } from '@playwright/test';

export class LandingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  get title() {
    return this.page.locator('h1');
  }

  get tagline() {
    return this.page.locator('text=Let the Judge Decide');
  }

  async clickPartnerA() {
    await this.page.click('a[href="/partner-a"]');
  }

  async clickPartnerB() {
    await this.page.click('a[href="/partner-b"]');
  }

  async clickHistory() {
    await this.page.click('a[href="/history"]');
  }
}

export class PartnerAFormPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/partner-a');
  }

  get heading() {
    return this.page.locator('h1:has-text("Partner A")');
  }

  async selectCategory(category: string) {
    await this.page.click(`button:has-text("${category}")`);
  }

  async selectIntensity(level: number) {
    await this.page.click(`button:has-text("${level}")`);
  }

  async fillDescription(text: string) {
    await this.page.fill('textarea', text);
  }

  async submit() {
    await this.page.click('button:has-text("Submit")');
  }

  async getError() {
    return this.page.locator('.text-error, [role="alert"]').textContent();
  }
}

export class PartnerBFormPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/partner-b');
  }

  get heading() {
    return this.page.locator('h1:has-text("Partner B")');
  }

  async seePartnerASummary() {
    return this.page.locator('text=Partner A').isVisible();
  }

  async selectCategory(category: string) {
    await this.page.click(`button:has-text("${category}")`);
  }

  async selectIntensity(level: number) {
    await this.page.click(`button:has-text("${level}")`);
  }

  async fillResponse(text: string) {
    await this.page.fill('textarea', text);
  }

  async submit() {
    await this.page.click('button:has-text("Demand Justice")');
  }
}

export class VerdictPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/verdict');
  }

  async waitForVerdict() {
    await this.page.waitForSelector('text=Wins!, text=Draw', { timeout: 15000 });
  }

  get verdict() {
    return this.page.locator('h1:has-text("Wins"), h1:has-text("Draw")');
  }

  get reasoning() {
    return this.page.locator('text=The Judge');
  }

  async clickNewCase() {
    await this.page.click('a:has-text("New Case")');
  }

  async clickHistory() {
    await this.page.click('a:has-text("History")');
  }
}

export class HistoryPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/history');
  }

  get heading() {
    return this.page.locator('h1:has-text("History")');
  }

  async getCaseCount() {
    const cards = await this.page.locator('.card').count();
    return cards;
  }

  async hasCases() {
    return (await this.getCaseCount()) > 0;
  }
}