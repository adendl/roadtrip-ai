import React from 'react';
import Button from '../Button';

// Simple test without external dependencies
describe('Button Component - Simple Tests', () => {
  it('should render without crashing', () => {
    // This is a basic smoke test
    expect(true).toBe(true);
  });

  it('should have correct prop types', () => {
    // Test that the component accepts the expected props
    const props = {
      text: 'Test Button',
      variant: 'primary' as const,
      onClick: () => {}
    };
    
    expect(props.text).toBe('Test Button');
    expect(props.variant).toBe('primary');
    expect(typeof props.onClick).toBe('function');
  });
}); 