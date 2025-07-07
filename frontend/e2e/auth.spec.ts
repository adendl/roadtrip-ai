import { test, expect } from '@playwright/test';

const testUser = {
  username: `e2euser${Date.now()}`,
  email: `e2euser+${Date.now()}@example.com`,
  password: 'E2eTestPassword123!'
};

test.describe.serial('Authentication Flows', () => {
  test('User can sign up', async ({ page }) => {
    // Listen for network requests
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/users/register') || response.url().includes('/register')
    );
    
    await page.goto('/signup');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Sign Up")');
    
    // Wait for the API response
    const response = await responsePromise;
    console.log('Sign-up API response status:', response.status());
    console.log('Sign-up API response URL:', response.url());
    
    // Wait a moment for the response
    await page.waitForTimeout(2000);
    
    // Check for error messages first
    const errorElement = page.locator('.text-red-600');
    if (await errorElement.isVisible()) {
      const errorText = await errorElement.textContent();
      throw new Error(`Sign-up failed: ${errorText}`);
    }
    
    // If no error, wait for success message
    await expect(page.locator('text=Registration Successful!')).toBeVisible();
    
    // Wait for the redirect to /login (allow up to 4 seconds for the 2s delay)
    await expect(page).toHaveURL(/login/, { timeout: 4000 });
    
    // Wait for DB to persist user (increased to 5 seconds)
    await page.waitForTimeout(5000);
    console.log('Signed up user:', testUser);
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
    await expect(page).toHaveURL(/dashboard/);
    console.log('Logged in user:', testUser);
  });

  test('User can log out after login', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);

    // Open user menu and log out
    await page.click('button:has(svg)');
    await page.click('button:has-text("Sign Out")');
    // After logout, should redirect to home page (per AuthContext)
    await expect(page).toHaveURL('/');
    await expect(page.locator('a:has-text("Login")')).toBeVisible();
    console.log('Logged out user:', testUser);
  });
}); 