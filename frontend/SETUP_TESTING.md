# Jest Testing Setup Guide

This guide will help you set up comprehensive unit testing for your roadtrip.ai frontend.

## Step 1: Install Dependencies

First, install all the testing dependencies:

```bash
cd frontend
npm install
```

The following dependencies are already included in your `package.json`:

```json
{
  "devDependencies": {
    "@jest/types": "^29.6.3",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.12",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.2"
  }
}
```

## Step 2: Verify Jest Configuration

Your `jest.config.js` is already configured with:

- TypeScript support via `ts-jest`
- React Testing Library setup
- Coverage reporting
- Module mapping for CSS and assets
- Environment setup files

## Step 3: Run Initial Tests

Test that everything is working:

```bash
npm test
```

If you see TypeScript errors, you may need to restart your TypeScript server in your IDE.

## Step 4: Create Your First Test

Create a test file for the Button component:

```bash
mkdir -p src/components/__tests__
```

Create `src/components/__tests__/Button.test.tsx`:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

  it('applies primary variant styles', () => {
    render(<Button text="Primary Button" variant="primary" />);
    const button = screen.getByText('Primary Button');
    
    expect(button).toHaveClass('bg-indigo-600');
    expect(button).toHaveClass('text-white');
  });
});
```

## Step 5: Run Tests in Watch Mode

For development, use watch mode:

```bash
npm run test:watch
```

This will:
- Run tests automatically when files change
- Show interactive menu for running specific tests
- Provide immediate feedback

## Step 6: Check Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

This will:
- Run all tests
- Generate HTML coverage report in `coverage/` directory
- Show coverage summary in terminal

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors about Jest types:

1. **Restart TypeScript server** in your IDE:
   - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
   - Other IDEs: Restart the IDE

2. **Check tsconfig.json** includes test files:
   ```json
   {
     "include": [
       "src/**/*",
       "src/**/*.test.ts",
       "src/**/*.test.tsx"
     ]
   }
   ```

### Module Resolution Issues

If you see "Cannot find module" errors:

1. **Check import paths** - use relative paths
2. **Verify file extensions** - `.tsx` for React components
3. **Check Jest module mapping** in `jest.config.js`

### Test Environment Issues

If tests fail with DOM-related errors:

1. **Check setup files** are being loaded
2. **Verify jsdom environment** is configured
3. **Check for missing mocks** (window, document, etc.)

## Common Test Patterns

### Testing Components

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockHandler = jest.fn();
    render(<YourComponent onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Testing Utilities

```tsx
import { buildApiUrl, getApiHeaders } from '../api';

describe('API Utils', () => {
  beforeEach(() => {
    // Reset any global state
    (window as any).RUNTIME_CONFIG = undefined;
  });

  it('builds correct URLs', () => {
    (window as any).RUNTIME_CONFIG = {
      VITE_API_BASE_URL: 'https://api.example.com'
    };

    const url = buildApiUrl('users/login');
    expect(url).toBe('https://api.example.com/users/login');
  });
});
```

### Testing with Router

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import YourPage from '../YourPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('YourPage', () => {
  it('renders with router', () => {
    renderWithRouter(<YourPage />);
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Test both success and error cases**
4. **Keep tests isolated**
5. **Use data-testid sparingly**
6. **Mock external dependencies**

## Next Steps

1. **Write tests for existing components**
2. **Add tests for utility functions**
3. **Test form validation**
4. **Test API integration**
5. **Add integration tests**

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Events](https://testing-library.com/docs/user-event/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the Jest configuration
3. Check the testing guide in `TESTING.md`
4. Look at example tests in the `__tests__` folders 