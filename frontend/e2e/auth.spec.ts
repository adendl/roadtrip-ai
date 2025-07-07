import { test, expect } from '@playwright/test';

const testUser = {
  username: `e2euser${Date.now()}`,
  email: `e2euser+${Date.now()}@example.com`,
  password: 'E2eTestPassword123!'
};

test.describe.serial('Authentication Flows', () => {
  test('User can sign up', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Sign Up")');
    await expect(page).toHaveURL(/login|home/i);
  });

  test('User can log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    // If login fails, check for error message
    if (await page.url().includes('/login')) {
      const error = await page.locator('.text-red-600').textContent();
      throw new Error('Login failed: ' + error);
    }
    await expect(page).toHaveURL(/dashboard|home/i);
  });

  test('User can log out after login', async ({ page }) => {
    // Open user menu and log out
    await page.click('button:has(svg)');
    await page.click('button:has-text("Sign Out")');
    await expect(page).toHaveURL(/login|home/i);
    await expect(page.locator('a:has-text("Login")')).toBeVisible();
  });
}); 