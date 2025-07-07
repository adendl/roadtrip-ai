import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button text="Click me" variant="primary" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with icon and text', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Button text="Launch" icon={icon} variant="primary" />);
    
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button text="Primary Button" variant="primary" />);
    const button = screen.getByText('Primary Button');
    
    expect(button).toHaveClass('bg-indigo-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies secondary variant styles', () => {
    render(<Button text="Secondary Button" variant="secondary" />);
    const button = screen.getByText('Secondary Button');
    
    expect(button).toHaveClass('bg-gray-600');
    expect(button).toHaveClass('text-white');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" variant="primary" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button text="Custom Button" variant="primary" className="custom-class" />);
    const button = screen.getByText('Custom Button');
    
    expect(button).toHaveClass('custom-class');
  });

  it('sets correct button type', () => {
    render(<Button text="Submit" variant="primary" type="submit" />);
    const button = screen.getByText('Submit');
    
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('defaults to button type', () => {
    render(<Button text="Button" variant="primary" />);
    const button = screen.getByText('Button');
    
    expect(button).toHaveAttribute('type', 'button');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button text="Disabled Button" variant="primary" disabled />);
    const button = screen.getByText('Disabled Button');
    
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button text="Disabled Button" variant="primary" disabled onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Disabled Button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders without text when only icon is provided', () => {
    const icon = <span data-testid="icon">🎯</span>;
    render(<Button icon={icon} variant="primary" />);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
}); 