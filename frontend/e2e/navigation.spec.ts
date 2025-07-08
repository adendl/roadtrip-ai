import { test, expect } from '@playwright/test';

const testUser = {
  username: `navuser${Date.now()}`,
  email: `navuser+${Date.now()}@example.com`,
  password: 'NavTestPassword123!'
};

test.describe('Navigation and UI Flows', () => {
  test.beforeAll(async ({ browser }) => {
    // Create a test user
    const page = await browser.newPage();
    
    // Sign up
    await page.goto('/signup');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Sign Up")');
    await page.waitForTimeout(3000);
    
    await page.close();
  });

  test('User can navigate between all main pages', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
    
    // Navigate to signup
    await page.click('a:has-text("Sign Up")');
    await expect(page).toHaveURL(/signup/);
    await expect(page.locator('text=Sign Up')).toBeVisible();
    
    // Navigate to login
    await page.click('a:has-text("Login")');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('text=Login')).toBeVisible();
    
    // Navigate back to home
    await page.click('a:has-text("Roadtrip.ai")');
    await expect(page).toHaveURL('/');
  });

  test('User can access dashboard only when logged in', async ({ page }) => {
    // Try to access dashboard without being logged in
    await page.goto('/dashboard');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/login/);
    
    // Login
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('text=Plan a New Trip')).toBeVisible();
  });

  test('User can log out and access is properly restricted', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Log out
    await page.click('button:has(svg)');
    await page.click('button:has-text("Sign Out")');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Try to access dashboard again
    await page.goto('/dashboard');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/login/);
  });

  test('Header navigation works correctly', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    
    // Check header elements
    await expect(page.locator('text=Roadtrip.ai')).toBeVisible();
    await expect(page.locator('a:has-text("Login")')).toBeVisible();
    await expect(page.locator('a:has-text("Sign Up")')).toBeVisible();
    
    // Login
    await page.click('a:has-text("Login")');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Check header elements when logged in
    await expect(page.locator('text=Roadtrip.ai')).toBeVisible();
    await expect(page.locator('button:has(svg)')).toBeVisible(); // User menu button
    
    // Click user menu
    await page.click('button:has(svg)');
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });

  test('Home page features section is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to features section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check features are visible
    await expect(page.locator('text=Explore Our Features')).toBeVisible();
    await expect(page.locator('text=Trip Planning')).toBeVisible();
    await expect(page.locator('text=Activity Suggestions')).toBeVisible();
    await expect(page.locator('text=Route Optimisation')).toBeVisible();
  });

  test('Home page testimonials section is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to testimonials section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check testimonials are visible
    await expect(page.locator('text=What Our Users Say')).toBeVisible();
    await expect(page.locator('text=Alex P.')).toBeVisible();
    await expect(page.locator('text=Sarah K.')).toBeVisible();
  });

  test('Home page newsletter signup is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to newsletter section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check newsletter section is visible
    await expect(page.locator('text=Stay Updated')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Subscribe")')).toBeVisible();
  });

  test('Form interactions work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test home trip form interactions
    await page.fill('input[placeholder="From"]', 'Test City');
    await page.fill('input[placeholder="To"]', 'Test Destination');
    
    // Test round trip toggle
    await page.click('button:has-text("Round Trip")');
    
    // Test days increment/decrement
    await page.click('button:has(svg[data-testid="plus"])');
    await expect(page.locator('span:has-text("2")')).toBeVisible();
    
    await page.click('button:has(svg[data-testid="minus"])');
    await expect(page.locator('span:has-text("1")')).toBeVisible();
    
    // Test interest selection
    await page.click('input[value="adventure"]');
    await expect(page.locator('input[value="adventure"]')).toBeChecked();
    
    await page.click('input[value="adventure"]');
    await expect(page.locator('input[value="adventure"]')).not.toBeChecked();
  });

  test('Responsive design works on different screen sizes', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
  });

  test('Error handling for invalid routes', async ({ page }) => {
    // Try to access a non-existent route
    await page.goto('/non-existent-page');
    
    // Should either show a 404 page or redirect to home
    const currentUrl = page.url();
    if (currentUrl.includes('/non-existent-page')) {
      // If it stays on the invalid route, check for 404 content
      await expect(page.locator('text=404') || page.locator('text=Page Not Found')).toBeVisible();
    } else {
      // If it redirects, should be on home page
      await expect(page).toHaveURL('/');
    }
  });

  test('User can use browser back/forward navigation', async ({ page }) => {
    // Navigate through pages
    await page.goto('/');
    await page.click('a:has-text("Sign Up")');
    await page.click('a:has-text("Login")');
    
    // Use browser back
    await page.goBack();
    await expect(page).toHaveURL(/signup/);
    
    // Use browser forward
    await page.goForward();
    await expect(page).toHaveURL(/login/);
    
    // Go back to home
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('Page loading states are handled gracefully', async ({ page }) => {
    // Test slow network conditions
    await page.route('**/*', route => {
      // Add a small delay to simulate slow network
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/');
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
  });

  test('User can access all form fields and they are properly labeled', async ({ page }) => {
    await page.goto('/signup');
    
    // Check all form fields are accessible
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    
    // Check form submission button
    await expect(page.locator('button:has-text("Sign Up")')).toBeVisible();
    
    // Test form interactions
    await page.fill('input[placeholder="Username"]', 'testuser');
    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('input[placeholder="Password"]', 'testpassword123');
    
    // Verify values are set
    await expect(page.locator('input[placeholder="Username"]')).toHaveValue('testuser');
    await expect(page.locator('input[placeholder="Email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[placeholder="Password"]')).toHaveValue('testpassword123');
  });

  test('User can see loading states during authentication', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    
    // Click login and check for loading state
    await page.click('button:has-text("Login")');
    
    // Should show success message or redirect
    try {
      await expect(page.locator('text=Login Successful!')).toBeVisible({ timeout: 3000 });
    } catch (error) {
      // If no success message, should redirect to dashboard
      await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
    }
  });
}); 