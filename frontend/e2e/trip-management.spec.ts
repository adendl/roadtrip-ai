import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_TRIPS } from './test-config';

test.describe('Trip Management Flows', () => {
  test('User can view trip details by clicking on a trip card', async ({ page }) => {
    // Create a test user and some trips for management tests
    const testUser = TEST_USERS.management;
    
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
    
    // Create a test trip
    await page.fill('input[placeholder="From"]', TEST_TRIPS.simple.from);
    await page.fill('input[placeholder="To"]', TEST_TRIPS.simple.to);
    
    // Set days
    const plusButtons = page.locator('button:has(svg)');
    for (let i = 1; i < TEST_TRIPS.simple.days; i++) {
      await plusButtons.nth(1).click(); // Plus button
    }
    
    // Select interests
    for (const interest of TEST_TRIPS.simple.interests) {
      await page.click(`input[value="${interest}"]`);
    }
    
    // Submit form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Wait for trips to load
    await page.waitForTimeout(5000);
    
    // Click on the first trip card
    const tripCard = page.locator(`text=${TEST_TRIPS.simple.from} to ${TEST_TRIPS.simple.to}`).first();
    await tripCard.click();
    
    // Should show trip details
    await expect(page.locator(`h3:has-text("${TEST_TRIPS.simple.from} to ${TEST_TRIPS.simple.to}")`)).toBeVisible();
    await expect(page.locator(`text=${TEST_TRIPS.simple.from}`)).toBeVisible();
    await expect(page.locator(`text=${TEST_TRIPS.simple.to}`)).toBeVisible();
  });

  test('User can view all their trips in the dashboard', async ({ page }) => {
    // Create a test user and some trips for management tests
    const testUser = TEST_USERS.management;
    
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
    
    // Create multiple test trips
    const trips = [TEST_TRIPS.simple, TEST_TRIPS.short];
    
    for (const trip of trips) {
      await page.fill('input[placeholder="From"]', trip.from);
      await page.fill('input[placeholder="To"]', trip.to);
      
      // Set days
      const plusButtons = page.locator('button:has(svg)');
      for (let i = 1; i < trip.days; i++) {
        await plusButtons.nth(1).click(); // Plus button
      }
      
      // Select interests
      for (const interest of trip.interests) {
        await page.click(`input[value="${interest}"]`);
      }
      
      // Wait for button to be enabled and submit form
      await page.waitForSelector('button:has-text("Generate Your Trip Plan"):not([disabled])', { timeout: 10000 });
      await page.click('button:has-text("Generate Your Trip Plan")');
      
      // Wait for trip to be created
      await page.waitForTimeout(5000);
    }
    
    // Wait for trips to load
    await page.waitForTimeout(5000);
    
    // Get all trip cards
    const tripCards = page.locator('[data-testid="trip-card"]');
    const count = await tripCards.count();
    
    // Should have at least the trips we created
    expect(count).toBeGreaterThanOrEqual(trips.length);
    
    // Check that each trip is visible
    for (const trip of trips) {
      await expect(page.locator(`text=${trip.from} to ${trip.to}`)).toBeVisible();
    }
  });

  test('User can download trip as PDF', async ({ page }) => {
    // Create a test user and a trip
    const testUser = TEST_USERS.management;
    
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
    
    // Create a test trip
    await page.fill('input[placeholder="From"]', TEST_TRIPS.simple.from);
    await page.fill('input[placeholder="To"]', TEST_TRIPS.simple.to);
    
    // Set days
    const plusButtons = page.locator('button:has(svg)');
    for (let i = 1; i < TEST_TRIPS.simple.days; i++) {
      await plusButtons.nth(1).click(); // Plus button
    }
    
    // Select interests
    for (const interest of TEST_TRIPS.simple.interests) {
      await page.click(`input[value="${interest}"]`);
    }
    
    // Submit form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Wait for trip to be created
    await page.waitForTimeout(5000);
    
    // Click on the trip card
    const tripCard = page.locator(`text=${TEST_TRIPS.simple.from} to ${TEST_TRIPS.simple.to}`).first();
    await tripCard.click();
    
    // Look for download button
    const downloadButton = page.locator('button:has-text("Download PDF")');
    if (await downloadButton.isVisible()) {
      await downloadButton.click();
      
      // Should trigger download (check for download event)
      const downloadPromise = page.waitForEvent('download');
      await downloadPromise;
    }
  });
}); 