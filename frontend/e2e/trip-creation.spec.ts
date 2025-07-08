import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_TRIPS } from './test-config';

test.describe('Trip Creation Flows', () => {
  test('User can create a trip from home page and continue to dashboard', async ({ page }) => {
    // Create a test user
    const testUser = TEST_USERS.trip;
    
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
    
    // Go to home page
    await page.goto('/');
    
    // Fill out the trip form
    await page.fill('input[placeholder="From"]', TEST_TRIPS.simple.from);
    await page.fill('input[placeholder="To"]', TEST_TRIPS.simple.to);
    
    // Set days to 5
    const plusButtons = page.locator('button:has(svg)');
    for (let i = 0; i < 4; i++) {
      await plusButtons.nth(1).click(); // Plus button
    }
    
    // Select some interests
    await page.click('input[value="sightseeing"]');
    await page.click('input[value="food"]');
    
    // Submit form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trip to appear
    await page.waitForTimeout(5000);
    await expect(page.locator(`text=${TEST_TRIPS.simple.from} to ${TEST_TRIPS.simple.to}`)).toBeVisible();
  });

  test('User can create a trip from dashboard', async ({ page }) => {
    // Create a test user and login
    const testUser = TEST_USERS.trip;
    
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
    
    // Fill out the trip form
    await page.fill('input[placeholder="From"]', TEST_TRIPS.complex.from);
    await page.fill('input[placeholder="To"]', TEST_TRIPS.complex.to);
    
    // Set days
    const plusButtons = page.locator('button:has(svg)');
    for (let i = 1; i < TEST_TRIPS.complex.days; i++) {
      await plusButtons.nth(1).click(); // Plus button
    }
    
    // Enable round trip
    await page.click('button:has-text("Round Trip")');
    
    // Select interests
    for (const interest of TEST_TRIPS.complex.interests) {
      await page.click(`input[value="${interest}"]`);
    }
    
    // Submit form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Wait for trip to appear
    await page.waitForTimeout(5000);
    await expect(page.locator(`text=${TEST_TRIPS.complex.from} to ${TEST_TRIPS.complex.to}`)).toBeVisible();
  });

  test('Trip creation shows loading states', async ({ page }) => {
    // Create a test user and login
    const testUser = TEST_USERS.trip;
    
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
    
    // Fill out the trip form
    await page.fill('input[placeholder="From"]', TEST_TRIPS.short.from);
    await page.fill('input[placeholder="To"]', TEST_TRIPS.short.to);
    
    // Set days
    const plusButtons = page.locator('button:has(svg)');
    for (let i = 1; i < TEST_TRIPS.short.days; i++) {
      await plusButtons.nth(1).click(); // Plus button
    }
    
    // Select interests
    for (const interest of TEST_TRIPS.short.interests) {
      await page.click(`input[value="${interest}"]`);
    }
    
    // Submit form and check for loading state
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Button should be disabled during loading
    await expect(page.locator('button:has-text("Generate Your Trip Plan")')).toBeDisabled();
    
    // Wait for completion
    await page.waitForTimeout(5000);
    await expect(page.locator(`text=${TEST_TRIPS.short.from} to ${TEST_TRIPS.short.to}`)).toBeVisible();
  });
}); 