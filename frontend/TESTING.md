# Frontend Testing Guide

This guide covers how to set up and run comprehensive unit tests for the roadtrip.ai frontend using Jest and React Testing Library.

## Setup

### 1. Install Dependencies

The testing dependencies are already included in `package.json`:

```bash
npm install
```

### 2. Available Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

## Test Structure

### File Naming Convention

- Test files should be named `*.test.tsx` or `*.spec.tsx`
- Place test files in `__tests__` folders within component directories
- Example: `src/components/__tests__/Button.test.tsx`

### Test Organization

```
src/
├── components/
│   ├── __tests__/
│   │   ├── Button.test.tsx
│   │   ├── Card.test.tsx
│   │   └── ...
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── utils/
│   ├── __tests__/
│   │   ├── api.test.ts
│   │   └── ...
│   ├── api.ts
│   └── ...
└── pages/
    ├── __tests__/
    │   ├── Home.test.tsx
    │   └── ...
    ├── Home.tsx
    └── ...
```

## Writing Tests

### Component Testing Example

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button text="Click me" variant="primary" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" variant="primary" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles for primary variant', () => {
    render(<Button text="Primary Button" variant="primary" />);
    const button = screen.getByText('Primary Button');
    
    expect(button).toHaveClass('bg-indigo-600');
    expect(button).toHaveClass('text-white');
  });
});
```

### Utility Function Testing Example

```tsx
import { buildApiUrl, getApiHeaders } from '../api';

describe('API Utils', () => {
  beforeEach(() => {
    // Reset runtime config before each test
    (window as any).RUNTIME_CONFIG = undefined;
  });

  it('builds correct API URL', () => {
    (window as any).RUNTIME_CONFIG = {
      VITE_API_BASE_URL: 'https://api.example.com'
    };

    const url = buildApiUrl('users/login');
    expect(url).toBe('https://api.example.com/users/login');
  });

  it('returns headers with authorization token', () => {
    const token = 'test-token-123';
    const headers = getApiHeaders(token);
    
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token-123'
    });
  });
});
```

### Page Component Testing Example

```tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock child components if needed
jest.mock('../../components/Hero', () => {
  return function MockHero() {
    return <div data-testid="hero">Hero Component</div>;
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  it('renders hero section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('renders trip form', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/generate your trip plan/i)).toBeInTheDocument();
  });
});
```

## Testing Utilities

### Custom Render Function

Create a `src/test-utils.tsx` file for custom render functions:

```tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mocking External Dependencies

```tsx
// Mock API calls
jest.mock('../utils/api', () => ({
  buildApiUrl: jest.fn(),
  fetchWithTimeout: jest.fn(),
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// Mock environment variables
const mockEnv = {
  VITE_API_BASE_URL: 'https://test-api.example.com',
  VITE_APP_ENV: 'test'
};
Object.defineProperty(import.meta, 'env', {
  value: mockEnv,
  writable: true
});
```

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```tsx
it('should do something', () => {
  // Arrange - Set up test data and conditions
  const mockData = { id: 1, name: 'Test' };
  
  // Act - Perform the action being tested
  const result = processData(mockData);
  
  // Assert - Verify the expected outcome
  expect(result).toBe('expected result');
});
```

### 2. Test Naming

Use descriptive test names that explain the behavior:

```tsx
// Good
it('should display error message when API call fails', () => {
  // test implementation
});

// Bad
it('should work', () => {
  // test implementation
});
```

### 3. Testing User Interactions

```tsx
it('should submit form when user clicks submit button', async () => {
  const mockSubmit = jest.fn();
  render(<TripForm onSubmit={mockSubmit} />);
  
  // Fill form
  fireEvent.change(screen.getByLabelText(/destination/i), {
    target: { value: 'Paris' }
  });
  
  // Submit form
  fireEvent.click(screen.getByText(/generate trip/i));
  
  // Wait for async operations
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      destination: 'Paris'
    });
  });
});
```

### 4. Testing Error States

```tsx
it('should display error message on network failure', async () => {
  // Mock failed API call
  (fetchWithTimeout as jest.Mock).mockRejectedValue(
    new Error('Network error')
  );
  
  render(<TripForm />);
  fireEvent.click(screen.getByText(/generate trip/i));
  
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

## Coverage Goals

The project aims for 70% code coverage across:
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## Running Tests

### Development Workflow

1. **Start test watcher**:
   ```bash
   npm run test:watch
   ```

2. **Write tests alongside code**:
   - Create test files in `__tests__` folders
   - Use descriptive test names
   - Test both success and error scenarios

3. **Check coverage**:
   ```bash
   npm run test:coverage
   ```

### CI/CD Integration

The `test:ci` script is designed for continuous integration:
- Runs all tests without watch mode
- Generates coverage reports
- Exits with error code if tests fail

## Common Testing Patterns

### Testing Form Components

```tsx
describe('TripForm', () => {
  it('should validate required fields', async () => {
    render(<TripForm />);
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText(/generate trip/i));
    
    await waitFor(() => {
      expect(screen.getByText(/destination is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<TripForm onSubmit={mockSubmit} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: 'Tokyo' }
    });
    fireEvent.change(screen.getByLabelText(/duration/i), {
      target: { value: '7' }
    });
    
    // Submit
    fireEvent.click(screen.getByText(/generate trip/i));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        destination: 'Tokyo',
        duration: '7'
      });
    });
  });
});
```

### Testing Context Providers

```tsx
describe('AuthContext', () => {
  it('should provide authentication state', () => {
    const TestComponent = () => {
      const { user, login } = useAuth();
      return (
        <div>
          <span data-testid="user">{user?.email || 'no user'}</span>
          <button onClick={() => login('test@example.com', 'password')}>
            Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('no user');
  });
});
```

## Troubleshooting

### Common Issues

1. **TypeScript errors in tests**: Make sure `@types/jest` is installed
2. **Module not found**: Check import paths and Jest module mapping
3. **Async test failures**: Use `waitFor` for async operations
4. **Mock not working**: Ensure mocks are defined before imports

### Debug Tips

1. **Use `screen.debug()`** to see the rendered HTML
2. **Use `jest.fn().mockImplementation()`** to debug mock calls
3. **Check test isolation** - ensure tests don't affect each other
4. **Use `--verbose` flag** for more detailed test output

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Events](https://testing-library.com/docs/user-event/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom) 