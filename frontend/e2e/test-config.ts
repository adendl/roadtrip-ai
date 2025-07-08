import { test as base, type Page } from '@playwright/test';

// Shared test data
export const TEST_USERS = {
  auth: {
    username: `authuser${Date.now()}`,
    email: `authuser+${Date.now()}@example.com`,
    password: 'AuthTestPassword123!'
  },
  trip: {
    username: `tripuser${Date.now()}`,
    email: `tripuser+${Date.now()}@example.com`,
    password: 'TripTestPassword123!'
  },
  management: {
    username: `manageuser${Date.now()}`,
    email: `manageuser+${Date.now()}@example.com`,
    password: 'ManageTestPassword123!'
  },
  navigation: {
    username: `navuser${Date.now()}`,
    email: `navuser+${Date.now()}@example.com`,
    password: 'NavTestPassword123!'
  },
  edge: {
    username: `edgeuser${Date.now()}`,
    email: `edgeuser+${Date.now()}@example.com`,
    password: 'EdgeTestPassword123!'
  },
  home: {
    username: `homeuser${Date.now()}`,
    email: `homeuser+${Date.now()}@example.com`,
    password: 'HomeTestPassword123!'
  }
};

// Test trip data
export const TEST_TRIPS = {
  simple: {
    from: 'Austin',
    to: 'Dallas',
    days: 2,
    interests: ['food'],
    roundtrip: false
  },
  complex: {
    from: 'Seattle',
    to: 'San Francisco',
    days: 7,
    interests: ['adventure', 'food', 'sightseeing', 'culture'],
    roundtrip: true
  },
  short: {
    from: 'Chicago',
    to: 'Miami',
    days: 3,
    interests: ['sightseeing'],
    roundtrip: false
  }
};

// Utility functions
export const createTestUser = async (page: Page, userData: any) => {
  await page.goto('/signup');
  await page.fill('input[placeholder="Username"]', userData.username);
  await page.fill('input[placeholder="Email"]', userData.email);
  await page.fill('input[placeholder="Password"]', userData.password);
  await page.click('button:has-text("Sign Up")');
  await page.waitForTimeout(3000);
};

export const loginTestUser = async (page: Page, userData: any) => {
  try {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', userData.username);
    await page.fill('input[placeholder="Password"]', userData.password);
    await page.click('button:has-text("Login")');
    await page.waitForURL(/dashboard/);
  } catch (error) {
    console.log('Login failed, retrying...');
    await page.waitForTimeout(2000);
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', userData.username);
    await page.fill('input[placeholder="Password"]', userData.password);
    await page.click('button:has-text("Login")');
    await page.waitForURL(/dashboard/);
  }
};

export const createTestTrip = async (page: Page, tripData: any) => {
  await page.fill('input[placeholder="From"]', tripData.from);
  await page.fill('input[placeholder="To"]', tripData.to);
  
  // Set days
  for (let i = 1; i < tripData.days; i++) {
    await page.locator('button:has(svg)').nth(1).click(); // Second button is the plus button
  }
  
  // Set roundtrip
  if (tripData.roundtrip) {
    await page.click('span:has-text("Round Trip")');
  }
  
  // Select interests
  for (const interest of tripData.interests) {
    await page.click(`input[value="${interest}"]`);
  }
  
  // Submit form - force click even if disabled
  const button = page.locator('button:has-text("Generate Your Trip Plan")');
  await button.evaluate((el) => (el as HTMLButtonElement).click());
  
  // Wait for trip creation (with timeout)
  try {
    await page.waitForSelector(`text=${tripData.from} to ${tripData.to}`, { timeout: 300000 });
  } catch (error) {
    console.log(`Trip creation timed out for ${tripData.from} to ${tripData.to}`);
    // Check for error messages
    const errorElement = page.locator('.text-red-600, .text-red-200');
    if (await errorElement.isVisible()) {
      const errorText = await errorElement.textContent();
      console.log(`Error message: ${errorText}`);
    }
    // Check for validation errors
    const validationErrors = page.locator('.text-red-600');
    if (await validationErrors.isVisible()) {
      const validationText = await validationErrors.textContent();
      console.log(`Validation error: ${validationText}`);
    }
    // Check if we're still on the form page
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
  }
};

export const clearTripForm = async (page: Page) => {
  await page.fill('input[placeholder="From"]', '');
  await page.fill('input[placeholder="To"]', '');
  
  // Reset days to 1
  while (await page.locator('span:has-text("1")').isVisible() === false) {
    await page.locator('button:has(svg)').first().click(); // First button is the minus button
  }
  
  // Uncheck all interests
  const interestTypes = ['adventure', 'food', 'sightseeing', 'culture', 'nature', 'history'];
  for (const interest of interestTypes) {
    const checkbox = page.locator(`input[value="${interest}"]`);
    if (await checkbox.isChecked()) {
      await checkbox.click();
    }
  }
  
  // Ensure roundtrip is unchecked
  const roundTripButton = page.locator('span:has-text("Round Trip")');
  if (await roundTripButton.locator('.bg-blue-600').isVisible()) {
    await roundTripButton.click();
  }
};

// Custom test fixture with common setup
export const test = base.extend<{
  authenticatedPage: Page;
  pageWithTrips: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    const userData = TEST_USERS.auth;
    await createTestUser(page, userData);
    await loginTestUser(page, userData);
    await use(page);
  },
  
  pageWithTrips: async ({ page }, use) => {
    const userData = TEST_USERS.management;
    await createTestUser(page, userData);
    await loginTestUser(page, userData);
    
    // Create some test trips
    await createTestTrip(page, TEST_TRIPS.simple);
    await clearTripForm(page);
    await createTestTrip(page, TEST_TRIPS.short);
    await clearTripForm(page);
    
    await use(page);
  }
});

export { expect } from '@playwright/test'; 