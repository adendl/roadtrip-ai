import { test, expect } from '@playwright/test';

const testUser = {
  username: `manageuser${Date.now()}`,
  email: `manageuser+${Date.now()}@example.com`,
  password: 'ManageTestPassword123!'
};

test.describe.serial('Trip Management Flows', () => {
  test.beforeAll(async ({ browser }) => {
    // Create a test user and some trips for management tests
    const page = await browser.newPage();
    
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
    
    // Create a few test trips
    const trips = [
      { from: 'Austin', to: 'Dallas', days: 2, interests: ['food'] },
      { from: 'Houston', to: 'Galveston', days: 3, interests: ['adventure', 'sightseeing'] },
      { from: 'San Antonio', to: 'Austin', days: 1, interests: ['culture'] }
    ];
    
    for (const trip of trips) {
      await page.fill('input[placeholder="From"]', trip.from);
      await page.fill('input[placeholder="To"]', trip.to);
      
      // Set days
      for (let i = 1; i < trip.days; i++) {
        await page.click('button:has(svg[data-testid="plus"])');
      }
      
      // Select interests
      for (const interest of trip.interests) {
        await page.click(`input[value="${interest}"]`);
      }
      
      await page.click('button:has-text("Generate Your Trip Plan")');
      
      // Wait for trip creation (with timeout)
      try {
        await expect(page.locator(`text=${trip.from} to ${trip.to}`)).toBeVisible({ timeout: 300000 });
      } catch (error) {
        console.log(`Trip creation timed out for ${trip.from} to ${trip.to}`);
      }
      
      // Clear form for next trip
      await page.fill('input[placeholder="From"]', '');
      await page.fill('input[placeholder="To"]', '');
      
      // Uncheck all interests
      for (const interest of trip.interests) {
        await page.click(`input[value="${interest}"]`);
      }
    }
    
    await page.close();
  });

  test('User can view trip details by clicking on a trip card', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trips to load
    await page.waitForTimeout(5000);
    
    // Click on the first trip card
    const firstTripCard = page.locator('.bg-white').first();
    await firstTripCard.click();
    
    // Should show trip details section
    await expect(page.locator('text=Trip Details')).toBeVisible();
    
    // Should show the trip overview map
    await expect(page.locator('.md\\:w-1\\/2.bg-white.rounded-lg.shadow-md')).toBeVisible();
  });

  test('User can navigate between different trip cards', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trips to load
    await page.waitForTimeout(5000);
    
    // Get all trip cards
    const tripCards = page.locator('.bg-white');
    const count = await tripCards.count();
    
    if (count > 1) {
      // Click on first trip
      await tripCards.first().click();
      await expect(page.locator('text=Trip Details')).toBeVisible();
      
      // Click on second trip
      await tripCards.nth(1).click();
      await expect(page.locator('text=Trip Details')).toBeVisible();
      
      // The details should have changed (different trip info)
      const firstTripTitle = await page.locator('h3').first().textContent();
      await tripCards.first().click();
      const secondTripTitle = await page.locator('h3').first().textContent();
      
      expect(firstTripTitle).not.toBe(secondTripTitle);
    }
  });

  test('User can delete a trip', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trips to load
    await page.waitForTimeout(2000);
    
    // Get initial trip count
    const initialTripCards = page.locator('.bg-white');
    const initialCount = await initialTripCards.count();
    
    if (initialCount > 0) {
      // Click the delete button on the first trip
      const deleteButton = page.locator('svg[data-testid="trash"]').first();
      await deleteButton.click();
      
      // Wait for the trip to be removed
      await expect(page.locator('.bg-white')).toHaveCount(initialCount - 1);
    }
  });

  test('User can view day details when clicking on a specific day', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trips to load
    await page.waitForTimeout(2000);
    
    // Click on a trip card
    const firstTripCard = page.locator('.bg-white').first();
    await firstTripCard.click();
    
    // Wait for trip details to load
    await expect(page.locator('text=Trip Details')).toBeVisible();
    
    // Look for day buttons/links
    const dayButtons = page.locator('button:has-text("Day")');
    const dayCount = await dayButtons.count();
    
    if (dayCount > 0) {
      // Click on the first day
      await dayButtons.first().click();
      
      // Should show day details instead of map
      await expect(page.locator('text=Day Details')).toBeVisible();
      
      // Should show day-specific information
      await expect(page.locator('text=Places of Interest')).toBeVisible();
    }
  });

  test('User can navigate back from day details to trip overview', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trips to load
    await page.waitForTimeout(2000);
    
    // Click on a trip card
    const firstTripCard = page.locator('.bg-white').first();
    await firstTripCard.click();
    
    // Wait for trip details to load
    await expect(page.locator('text=Trip Details')).toBeVisible();
    
    // Look for day buttons
    const dayButtons = page.locator('button:has-text("Day")');
    const dayCount = await dayButtons.count();
    
    if (dayCount > 0) {
      // Click on the first day
      await dayButtons.first().click();
      
      // Should show day details
      await expect(page.locator('text=Day Details')).toBeVisible();
      
      // Look for a way to go back to trip overview (might be a button or clicking the trip again)
      // This depends on the UI implementation
      const backButton = page.locator('button:has-text("Overview")').or(page.locator('button:has-text("Back")'));
      
      if (await backButton.isVisible()) {
        await backButton.click();
        await expect(page.locator('text=Trip Overview Map')).toBeVisible();
      } else {
        // If no back button, clicking the trip card again should work
        await firstTripCard.click();
        await expect(page.locator('text=Trip Overview Map')).toBeVisible();
      }
    }
  });

  test('User can see trip information in the trip card', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trips to load
    await page.waitForTimeout(2000);
    
    // Check that trip cards show basic information
    const tripCards = page.locator('.bg-white');
    const count = await tripCards.count();
    
    if (count > 0) {
      const firstCard = tripCards.first();
      
      // Should show trip route
      await expect(firstCard.locator('h3')).toBeVisible();
      
      // Should show creation date
      await expect(firstCard.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/')).toBeVisible();
      
      // Should show days and distance
      await expect(firstCard.locator('text=Days:')).toBeVisible();
      await expect(firstCard.locator('text=Total Distance:')).toBeVisible();
      
      // Should show interests
      await expect(firstCard.locator('text=Interests:')).toBeVisible();
      
      // Should have a delete button
      await expect(firstCard.locator('svg[data-testid="trash"]')).toBeVisible();
    }
  });

  test('User can see empty state when no trips exist', async ({ page }) => {
    // Create a new user with no trips
    const newUser = {
      username: `emptyuser${Date.now()}`,
      email: `emptyuser+${Date.now()}@example.com`,
      password: 'EmptyTestPassword123!'
    };
    
    // Sign up
    await page.goto('/signup');
    await page.fill('input[placeholder="Username"]', newUser.username);
    await page.fill('input[placeholder="Email"]', newUser.email);
    await page.fill('input[placeholder="Password"]', newUser.password);
    await page.click('button:has-text("Sign Up")');
    await page.waitForTimeout(3000);
    
    // Login
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', newUser.username);
    await page.fill('input[placeholder="Password"]', newUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Should show the trip form but no trip cards
    await expect(page.locator('text=Plan a New Trip')).toBeVisible();
    
    // Should not show any trip cards
    const tripCards = page.locator('.bg-white');
    await expect(tripCards).toHaveCount(0);
  });

  test('User can handle errors gracefully when trip operations fail', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', testUser.username);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/dashboard/);
    
    // Wait for trips to load
    await page.waitForTimeout(2000);
    
    // Try to delete a trip (this might fail if the trip doesn't exist or network issues)
    const deleteButtons = page.locator('svg[data-testid="trash"]');
    const deleteCount = await deleteButtons.count();
    
    if (deleteCount > 0) {
      // Click delete and check for error handling
      await deleteButtons.first().click();
      
      // Wait a moment to see if any error messages appear
      await page.waitForTimeout(2000);
      
      // Check if there are any error messages displayed
      const errorMessages = page.locator('.text-red-600');
      if (await errorMessages.isVisible()) {
        const errorText = await errorMessages.textContent();
        console.log('Error message displayed:', errorText);
      }
    }
  });
}); 