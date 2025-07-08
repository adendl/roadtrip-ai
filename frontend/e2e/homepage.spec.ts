import { test, expect } from '@playwright/test';
import { TEST_USERS } from './test-config';

test.describe('Homepage Flows', () => {
  test('Homepage loads correctly with all sections', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('h1:has-text("Plan Your Perfect Roadtrip")')).toBeVisible();
    await expect(page.locator('p:has-text("Let Roadtrip.ai craft a personalised itinerary")')).toBeVisible();
    
    // Check features section
    await expect(page.locator('h2:has-text("Explore Our Features")')).toBeVisible();
    await expect(page.locator('h3:has-text("Trip Planning")')).toBeVisible();
    await expect(page.locator('h3:has-text("Activity Suggestions")')).toBeVisible();
    await expect(page.locator('h3:has-text("Route Optimisation")')).toBeVisible();
  });

  test('Homepage trip form works for logged out users', async ({ page }) => {
    await page.goto('/');
    
    // Fill out the form
    await page.fill('input[placeholder="From"]', 'New York');
    await page.fill('input[placeholder="To"]', 'Los Angeles');
    
    // Set days to 3
    const plusButtons = page.locator('button:has(svg)');
    await plusButtons.nth(1).click(); // Plus button
    await plusButtons.nth(1).click(); // Plus button again
    
    // Select interests
    await page.click('input[value="sightseeing"]');
    await page.click('input[value="food"]');
    
    // Submit form
    await page.click('button:has-text("Get Started")');
    
    // Should redirect to signup
    await expect(page).toHaveURL(/signup/);
  });

  test('Homepage trip form works for logged in users', async ({ page }) => {
    // Create a test user and login
    const testUser = TEST_USERS.home;
    
    // Sign up
    await page.goto('/signup');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Sign Up")');
    await page.waitForTimeout(3000);
    
    // Login
    await page.goto('/login');
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Go to home page
    await page.goto('/');
    
    // Fill out the form
    await page.fill('input[placeholder="From"]', 'Chicago');
    await page.fill('input[placeholder="To"]', 'Miami');
    
    // Set days to 2
    const plusButtons = page.locator('button:has(svg)');
    await plusButtons.nth(1).click(); // Plus button
    
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
    await expect(page.locator('.text-red-200')).toBeVisible();
  });

  test('Homepage round trip toggle works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Find the round trip button
    const roundTripButton = page.locator('button:has-text("Round Trip")');
    
    // Click to enable
    await roundTripButton.click();
    
    // Check that the toggle is active
    await expect(roundTripButton.locator('div')).toHaveClass(/bg-blue-600/);
    
    // Click to disable
    await roundTripButton.click();
    
    // Check that the toggle is inactive
    await expect(roundTripButton.locator('div')).not.toHaveClass(/bg-blue-600/);
  });

  test('Homepage days increment/decrement works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state
    await expect(page.locator('span:has-text("1")')).toBeVisible();
    
    // Increment to 2
    const plusButtons = page.locator('button:has(svg)');
    await plusButtons.nth(1).click(); // Plus button
    await expect(page.locator('span:has-text("2")')).toBeVisible();
    
    // Increment to 3
    await plusButtons.nth(1).click(); // Plus button
    await expect(page.locator('span:has-text("3")')).toBeVisible();
    
    // Decrement back to 2
    const minusButtons = page.locator('button:has(svg)');
    await minusButtons.first().click(); // Minus button
    await expect(page.locator('span:has-text("2")')).toBeVisible();
    
    // Decrement back to 1
    await minusButtons.first().click(); // Minus button
    await expect(page.locator('span:has-text("1")')).toBeVisible();
    
    // Try to decrement below 1 (should stay at 1)
    await minusButtons.first().click(); // Minus button
    await expect(page.locator('span:has-text("1")')).toBeVisible();
  });

  test('Homepage navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check header navigation
    await expect(page.locator('a:has-text("Roadtrip.ai")')).toBeVisible();
    await expect(page.locator('a:has-text("Login")')).toBeVisible();
    await expect(page.locator('a:has-text("Sign Up")')).toBeVisible();
    
    // Test navigation to login
    await page.click('a:has-text("Login")');
    await expect(page).toHaveURL(/login/);
    
    // Go back to home
    await page.goto('/');
    
    // Test navigation to signup
    await page.click('a:has-text("Sign Up")');
    await expect(page).toHaveURL(/signup/);
  });

  test('Homepage features section displays correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check feature content
    await expect(page.locator('h2:has-text("Explore Our Features")')).toBeVisible();
    await expect(page.locator('h3:has-text("Trip Planning")')).toBeVisible();
    await expect(page.locator('p:has-text("Easily create custom road trip itineraries")')).toBeVisible();
    await expect(page.locator('h3:has-text("Activity Suggestions")')).toBeVisible();
    await expect(page.locator('h3:has-text("Route Optimisation")')).toBeVisible();
  });

  test('Homepage loads quickly and shows loading states appropriately', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // All interactive elements should be available
    await expect(page.locator('input[placeholder="From"]')).toBeVisible();
    await expect(page.locator('input[placeholder="To"]')).toBeVisible();
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
  });
}); 