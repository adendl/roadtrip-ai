import { test, expect } from '@playwright/test';

test.describe('Homepage Flows', () => {
  test('Homepage loads correctly with all sections', async ({ page }) => {
    await page.goto('/');
    
    // Check main hero section
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
    await expect(page.locator('text=Let Roadtrip.ai craft a personalised itinerary')).toBeVisible();
    
    // Check trip form is present
    await expect(page.locator('input[placeholder="From"]')).toBeVisible();
    await expect(page.locator('input[placeholder="To"]')).toBeVisible();
    await expect(page.locator('button:has-text("Round Trip")')).toBeVisible();
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    
    // Check features section
    await expect(page.locator('text=Explore Our Features')).toBeVisible();
    await expect(page.locator('text=Trip Planning')).toBeVisible();
    await expect(page.locator('text=Activity Suggestions')).toBeVisible();
    await expect(page.locator('text=Route Optimisation')).toBeVisible();
    
    // Check testimonials section
    await expect(page.locator('text=What Our Users Say')).toBeVisible();
    await expect(page.locator('text=Alex P.')).toBeVisible();
    await expect(page.locator('text=Sarah K.')).toBeVisible();
    
    // Check newsletter section
    await expect(page.locator('text=Stay Updated')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Subscribe")')).toBeVisible();
  });

  test('Homepage trip form works for logged out users', async ({ page }) => {
    await page.goto('/');
    
    // Fill out the trip form
    await page.fill('input[placeholder="From"]', 'New York');
    await page.fill('input[placeholder="To"]', 'Los Angeles');
    
    // Enable round trip
    await page.click('button:has-text("Round Trip")');
    
    // Set days to 3
    await page.click('button:has(svg[data-testid="plus"])');
    await page.click('button:has(svg[data-testid="plus"])');
    
    // Select interests
    await page.click('input[value="adventure"]');
    await page.click('input[value="food"]');
    
    // Submit form
    await page.click('button:has-text("Get Started")');
    
    // Should redirect to signup/login flow
    await expect(page).toHaveURL(/signup|login/);
  });

  test('Homepage trip form works for logged in users', async ({ page }) => {
    // Create a test user and login
    const testUser = {
      username: `homeuser${Date.now()}`,
      email: `homeuser+${Date.now()}@example.com`,
      password: 'HomeTestPassword123!'
    };
    
    // Sign up
    await page.goto('/signup');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Sign Up")');
    await page.waitForTimeout(3000);
    
    // Login
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Go back to homepage
    await page.goto('/');
    
    // Fill out the trip form
    await page.fill('input[placeholder="From"]', 'Chicago');
    await page.fill('input[placeholder="To"]', 'Miami');
    
    // Set days to 2
    await page.click('button:has(svg[data-testid="plus"])');
    
    // Select one interest
    await page.click('input[value="sightseeing"]');
    
    // Submit form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Homepage form validation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit empty form
    await page.click('button:has-text("Get Started")');
    
    // Should show validation errors
    await expect(page.locator('.text-red-600')).toBeVisible();
    
    // Fill only "from" field
    await page.fill('input[placeholder="From"]', 'Test City');
    await page.click('button:has-text("Get Started")');
    
    // Should still show validation errors
    await expect(page.locator('.text-red-600')).toBeVisible();
    
    // Fill "to" field with very long text
    await page.fill('input[placeholder="To"]', 'This is a very long city name that exceeds the maximum allowed length of twenty characters');
    await page.click('button:has-text("Get Started")');
    
    // Should show validation error for long text
    await expect(page.locator('.text-red-600')).toBeVisible();
    
    // Fix the "to" field
    await page.fill('input[placeholder="To"]', 'Test Destination');
    
    // Now the form should be valid
    await expect(page.locator('button:has-text("Get Started")')).not.toBeDisabled();
  });

  test('Homepage round trip toggle works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state (should be unchecked)
    const roundTripButton = page.locator('button:has-text("Round Trip")');
    await expect(roundTripButton).not.toHaveClass(/bg-blue-600/);
    
    // Click to enable
    await roundTripButton.click();
    await expect(roundTripButton).toHaveClass(/bg-blue-600/);
    
    // Click to disable
    await roundTripButton.click();
    await expect(roundTripButton).not.toHaveClass(/bg-blue-600/);
  });

  test('Homepage days increment/decrement works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state (should be 1)
    await expect(page.locator('span:has-text("1")')).toBeVisible();
    
    // Increment to 2
    await page.click('button:has(svg[data-testid="plus"])');
    await expect(page.locator('span:has-text("2")')).toBeVisible();
    
    // Increment to 3
    await page.click('button:has(svg[data-testid="plus"])');
    await expect(page.locator('span:has-text("3")')).toBeVisible();
    
    // Decrement to 2
    await page.click('button:has(svg[data-testid="minus"])');
    await expect(page.locator('span:has-text("2")')).toBeVisible();
    
    // Decrement to 1
    await page.click('button:has(svg[data-testid="minus"])');
    await expect(page.locator('span:has-text("1")')).toBeVisible();
    
    // Try to decrement below 1 (should stay at 1)
    await page.click('button:has(svg[data-testid="minus"])');
    await expect(page.locator('span:has-text("1")')).toBeVisible();
  });

  test('Homepage interest selection works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check all interest types are present
    const interestTypes = ['adventure', 'food', 'sightseeing', 'culture', 'nature', 'history'];
    
    for (const interest of interestTypes) {
      const checkbox = page.locator(`input[value="${interest}"]`);
      await expect(checkbox).toBeVisible();
      await expect(checkbox).not.toBeChecked();
    }
    
    // Select some interests
    await page.click('input[value="adventure"]');
    await page.click('input[value="food"]');
    await page.click('input[value="sightseeing"]');
    
    // Verify they are checked
    await expect(page.locator('input[value="adventure"]')).toBeChecked();
    await expect(page.locator('input[value="food"]')).toBeChecked();
    await expect(page.locator('input[value="sightseeing"]')).toBeChecked();
    
    // Unselect some interests
    await page.click('input[value="food"]');
    await expect(page.locator('input[value="food"]')).not.toBeChecked();
    await expect(page.locator('input[value="adventure"]')).toBeChecked();
    await expect(page.locator('input[value="sightseeing"]')).toBeChecked();
  });

  test('Homepage navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check header navigation
    await expect(page.locator('text=Roadtrip.ai')).toBeVisible();
    await expect(page.locator('a:has-text("Login")')).toBeVisible();
    await expect(page.locator('a:has-text("Sign Up")')).toBeVisible();
    
    // Click login link
    await page.click('a:has-text("Login")');
    await expect(page).toHaveURL(/login/);
    
    // Go back to home
    await page.goto('/');
    
    // Click signup link
    await page.click('a:has-text("Sign Up")');
    await expect(page).toHaveURL(/signup/);
  });

  test('Homepage is responsive on different screen sizes', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
    await expect(page.locator('input[placeholder="From"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
    await expect(page.locator('input[placeholder="From"]')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible();
    await expect(page.locator('input[placeholder="From"]')).toBeVisible();
  });

  test('Homepage features section displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to features section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check feature cards
    const featureCards = page.locator('.feature-item');
    await expect(featureCards).toHaveCount(3);
    
    // Check feature content
    await expect(page.locator('text=Trip Planning')).toBeVisible();
    await expect(page.locator('text=Easily create custom road trip itineraries')).toBeVisible();
    
    await expect(page.locator('text=Activity Suggestions')).toBeVisible();
    await expect(page.locator('text=Discover tailored activities')).toBeVisible();
    
    await expect(page.locator('text=Route Optimisation')).toBeVisible();
    await expect(page.locator('text=AI optimises your path')).toBeVisible();
  });

  test('Homepage testimonials section displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to testimonials section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check testimonial content
    await expect(page.locator('text=Roadtrip.ai made planning my cross-country trip a breeze!')).toBeVisible();
    await expect(page.locator('text=Love the activity ideas—turned my weekend into an adventure!')).toBeVisible();
    
    // Check testimonial authors
    await expect(page.locator('text=Alex P.')).toBeVisible();
    await expect(page.locator('text=Sarah K.')).toBeVisible();
  });

  test('Homepage newsletter signup form is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to newsletter section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check newsletter form elements
    const emailInput = page.locator('input[type="email"]');
    const subscribeButton = page.locator('button:has-text("Subscribe")');
    
    await expect(emailInput).toBeVisible();
    await expect(subscribeButton).toBeVisible();
    
    // Test email input
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    // Test subscribe button (should be clickable)
    await expect(subscribeButton).toBeEnabled();
  });

  test('Homepage loads quickly and shows loading states appropriately', async ({ page }) => {
    // Set up slow network to test loading states
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/');
    
    // Should load within reasonable time
    await expect(page.locator('text=Plan Your Perfect Roadtrip')).toBeVisible({ timeout: 10000 });
    
    // All interactive elements should be available
    await expect(page.locator('input[placeholder="From"]')).toBeVisible();
    await expect(page.locator('button:has-text("Get Started")')).toBeEnabled();
  });
}); 