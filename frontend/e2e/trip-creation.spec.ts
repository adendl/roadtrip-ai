import { test, expect } from '@playwright/test';

const testUser = {
  username: `tripuser${Date.now()}`,
  email: `tripuser+${Date.now()}@example.com`,
  password: 'TripTestPassword123!'
};

test.describe.serial('Trip Creation Flows', () => {
  test.beforeAll(async ({ browser }) => {
    // Create a test user for all trip tests
    const page = await browser.newPage();
    
    // Sign up
    await page.goto('/signup');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Sign Up")');
    
    // Wait for signup to complete
    await page.waitForTimeout(3000);
    
    // Login
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    await page.close();
  });

  test('User can create a trip from home page and continue to dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Fill out the home trip form
    await page.fill('input[placeholder="From"]', 'New York');
    await page.fill('input[placeholder="To"]', 'Los Angeles');
    
    // Enable round trip
    await page.click('button:has-text("Round Trip")');
    
    // Set days to 5
    for (let i = 0; i < 4; i++) {
      await page.click('button:has(svg[data-testid="plus"])');
    }
    
    // Select some interests
    await page.click('input[value="adventure"]');
    await page.click('input[value="food"]');
    
    // Submit the form
    await page.click('button:has-text("Get Started")');
    
    // Should redirect to signup/login flow
    await expect(page).toHaveURL(/signup|login/);
    
    // Login with test user
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    
    // Should redirect to dashboard with pending trip data
    await expect(page).toHaveURL(/dashboard/);
    
    // Check that the trip form is pre-filled
    await expect(page.locator('input[placeholder="From"]')).toHaveValue('New York');
    await expect(page.locator('input[placeholder="To"]')).toHaveValue('Los Angeles');
    
    // The round trip should be enabled
    const roundTripButton = page.locator('button:has-text("Round Trip")');
    await expect(roundTripButton).toHaveClass(/bg-blue-600/);
    
    // Days should be 5
    await expect(page.locator('span:has-text("5")')).toBeVisible();
    
    // Interests should be selected
    await expect(page.locator('input[value="adventure"]')).toBeChecked();
    await expect(page.locator('input[value="food"]')).toBeChecked();
  });

  test('User can create a simple one-way trip from dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Clear any existing form data
    await page.fill('input[placeholder="From"]', '');
    await page.fill('input[placeholder="To"]', '');
    
    // Fill out a simple trip
    await page.fill('input[placeholder="From"]', 'Chicago');
    await page.fill('input[placeholder="To"]', 'Miami');
    
    // Keep it as one-way (don't click round trip)
    
    // Set days to 3
    await page.click('button:has(svg[data-testid="plus"])');
    await page.click('button:has(svg[data-testid="plus"])');
    
    // Select one interest
    await page.click('input[value="sightseeing"]');
    
    // Submit the form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Wait for the loading state
    await expect(page.locator('text=Generating your trip plan with AI...')).toBeVisible();
    
    // Wait for the trip to be created (this might take a while)
    await expect(page.locator('text=Generating your trip plan with AI...')).not.toBeVisible({ timeout: 300000 }); // 5 minutes
    
    // Check that a new trip card appears
    await expect(page.locator('text=Chicago to Miami')).toBeVisible();
    
    // Verify the trip details
    const tripCard = page.locator('text=Chicago to Miami').first();
    await expect(tripCard.locator('..')).toContainText('Days: 3');
    await expect(tripCard.locator('..')).toContainText('sightseeing');
  });

  test('User can create a complex round-trip with multiple interests', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Clear any existing form data
    await page.fill('input[placeholder="From"]', '');
    await page.fill('input[placeholder="To"]', '');
    
    // Fill out a complex trip
    await page.fill('input[placeholder="From"]', 'Seattle');
    await page.fill('input[placeholder="To"]', 'San Francisco');
    
    // Enable round trip
    await page.click('button:has-text("Round Trip")');
    
    // Set days to 7
    for (let i = 0; i < 6; i++) {
      await page.click('button:has(svg[data-testid="plus"])');
    }
    
    // Select multiple interests
    await page.click('input[value="adventure"]');
    await page.click('input[value="food"]');
    await page.click('input[value="sightseeing"]');
    await page.click('input[value="culture"]');
    
    // Submit the form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Wait for the loading state
    await expect(page.locator('text=Generating your trip plan with AI...')).toBeVisible();
    
    // Wait for the trip to be created
    await expect(page.locator('text=Generating your trip plan with AI...')).not.toBeVisible({ timeout: 300000 }); // 5 minutes
    
    // Check that a new trip card appears
    await expect(page.locator('text=Seattle to San Francisco')).toBeVisible();
    
    // Verify the trip details
    const tripCard = page.locator('text=Seattle to San Francisco').first();
    await expect(tripCard.locator('..')).toContainText('Days: 7');
    await expect(tripCard.locator('..')).toContainText('adventure, food, sightseeing, culture');
  });

  test('Form validation works correctly', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Try to submit empty form
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Should show validation errors
    await expect(page.locator('.text-red-600')).toBeVisible();
    
    // Fill only "from" field
    await page.fill('input[placeholder="From"]', 'Boston');
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Should still show validation errors
    await expect(page.locator('.text-red-600')).toBeVisible();
    
    // Fill "to" field with very long text
    await page.fill('input[placeholder="To"]', 'This is a very long city name that exceeds the maximum allowed length of twenty characters');
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Should show validation error for long text
    await expect(page.locator('.text-red-600')).toBeVisible();
    
    // Fix the "to" field
    await page.fill('input[placeholder="To"]', 'Portland');
    
    // Now the form should be valid
    await expect(page.locator('button:has-text("Generate Your Trip Plan")')).not.toBeDisabled();
  });

  test('User can see loading states and progress messages', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Fill out a trip
    await page.fill('input[placeholder="From"]', 'Denver');
    await page.fill('input[placeholder="To"]', 'Phoenix');
    await page.click('button:has-text("Generate Your Trip Plan")');
    
    // Check for loading overlay
    await expect(page.locator('.fixed.inset-0.bg-gray-900')).toBeVisible();
    
    // Check for loading icon
    await expect(page.locator('svg.animate-spin')).toBeVisible();
    
    // Check for progress messages
    await expect(page.locator('text=Generating your trip plan with AI...')).toBeVisible();
    
    // Wait for additional progress messages
    await expect(page.locator('text=Analysing routes and destinations...')).toBeVisible({ timeout: 10000 });
    
    // The loading state should eventually disappear (either success or timeout)
    await expect(page.locator('.fixed.inset-0.bg-gray-900')).not.toBeVisible({ timeout: 300000 }); // 5 minutes
  });
}); 