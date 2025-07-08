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
      response.url().includes('/api/users/signup') || response.url().includes('/register')
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
    
    // Since API returned 200 and manual test works, check for either success message OR redirect
    // The success message might appear briefly before redirect
    try {
      // Try to find success message first
      await expect(page.locator('text=Registration Successful!')).toBeVisible({ timeout: 3000 });
      console.log('Success message found');
    } catch (error) {
      console.log('Success message not found, checking for redirect...');
      // If no success message, check if we're already redirected
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.log('Already redirected to login page');
      } else {
        // Wait for redirect to happen
        await expect(page).toHaveURL(/login/, { timeout: 4000 });
        console.log('Redirected to login page');
      }
    }
    
    // Wait for DB to persist user (increased to 5 seconds)
    await page.waitForTimeout(5000);
    console.log('Signed up user:', testUser);
  });

  test('User can log in with valid credentials', async ({ page }) => {
    // Listen for network requests
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/users/login')
    );
    
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    
    // Wait for the API response
    const response = await responsePromise;
    console.log('Login API response status:', response.status());
    console.log('Login API response URL:', response.url());
    
    // Wait a moment for the response
    await page.waitForTimeout(2000);
    
    // Check for error messages first
    const errorElement = page.locator('.text-red-600');
    if (await errorElement.isVisible()) {
      const errorText = await errorElement.textContent();
      throw new Error('Login failed: ' + errorText);
    }
    
    // Check for success message
    const successElement = page.locator('.text-green-600');
    if (await successElement.isVisible()) {
      console.log('Login success message found');
      // Wait for redirect to dashboard
      await expect(page).toHaveURL(/dashboard/, { timeout: 4000 });
    } else {
      // If no success message, check if we're already redirected
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log('Already redirected to dashboard');
      } else if (currentUrl.includes('/login')) {
        console.log('Still on login page, waiting for redirect...');
        // Wait for redirect to happen
        await expect(page).toHaveURL(/dashboard/, { timeout: 4000 });
      } else {
        console.log('Unexpected URL:', currentUrl);
        throw new Error('Login did not redirect to dashboard');
      }
    }
    
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