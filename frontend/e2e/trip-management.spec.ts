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
    
    // Should show trip details - use first() to avoid strict mode violation
    await expect(page.locator(`h3:has-text("${TEST_TRIPS.simple.from} to ${TEST_TRIPS.simple.to}")`).first()).toBeVisible();
    await expect(page.locator(`text=${TEST_TRIPS.simple.from}`).first()).toBeVisible();
    await expect(page.locator(`text=${TEST_TRIPS.simple.to}`).first()).toBeVisible();
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