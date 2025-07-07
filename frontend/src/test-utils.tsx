import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Custom wrapper that includes all necessary providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Helper function to create mock user
export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  ...overrides
});

// Helper function to create mock trip
export const createMockTrip = (overrides = {}) => ({
  id: 1,
  title: 'Test Trip',
  destination: 'Paris',
  duration: 7,
  description: 'A wonderful trip to Paris',
  createdAt: new Date().toISOString(),
  ...overrides
});

// Helper function to wait for loading states
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock data for common API responses
export const mockApiResponses = {
  login: {
    success: {
      token: 'mock-jwt-token',
      user: createMockUser()
    },
    error: {
      message: 'Invalid credentials'
    }
  },
  trips: {
    list: [createMockTrip(), createMockTrip({ id: 2, title: 'Second Trip' })],
    single: createMockTrip(),
    create: createMockTrip({ id: 3, title: 'New Trip' })
  }
}; 