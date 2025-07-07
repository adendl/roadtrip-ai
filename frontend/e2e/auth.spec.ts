import { test, expect } from '@playwright/test';

const testUser = {
  email: `e2euser+${Date.now()}@example.com`,
  password: 'E2eTestPassword123!'
};

test.describe('Authentication Flows', () => {
  test('User can sign up', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    // Expect to be redirected to dashboard or see a welcome message
    await expect(page).toHaveURL(/dashboard|home/i);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('User can log out', async ({ page }) => {
    // Assume user is already logged in from previous test
    // Look for a logout button or menu
    await page.click('button:has-text("Logout"),a:has-text("Logout")');
    // Expect to be redirected to login or home page
    await expect(page).toHaveURL(/login|home/i);
    await expect(page.locator('text=Login')).toBeVisible();
  });

  test('User can log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    // Expect to be redirected to dashboard or see a welcome message
    await expect(page).toHaveURL(/dashboard|home/i);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('User can log out after login', async ({ page }) => {
    // Look for a logout button or menu
    await page.click('button:has-text("Logout"),a:has-text("Logout")');
    await expect(page).toHaveURL(/login|home/i);
    await expect(page.locator('text=Login')).toBeVisible();
  });
}); 