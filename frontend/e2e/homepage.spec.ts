import { test, expect } from '@playwright/test';

test('homepage loads and displays the hero section', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/roadtrip/i);
  await expect(page.locator('h1')).toContainText(/roadtrip/i);
}); 