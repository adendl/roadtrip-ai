import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  const defaultProps = {
    title: 'Test Card',
    description: 'This is a test card description',
    imageUrl: '/test-image.jpg',
    altText: 'Test image'
  };

  it('renders with all required props', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card description')).toBeInTheDocument();
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  it('renders image with correct src and alt', () => {
    render(<Card {...defaultProps} />);
    const image = screen.getByAltText('Test image');
    
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('applies custom className', () => {
    render(<Card {...defaultProps} className="custom-card" />);
    const card = screen.getByText('Test Card').closest('div');
    
    expect(card).toHaveClass('custom-card');
  });

  it('has correct base classes', () => {
    render(<Card {...defaultProps} />);
    const card = screen.getByText('Test Card').closest('div');
    
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('bg-opacity-10');
    expect(card).toHaveClass('p-6');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('shadow-lg');
  });

  it('renders title with correct styling', () => {
    render(<Card {...defaultProps} />);
    const title = screen.getByText('Test Card');
    
    expect(title).toHaveClass('text-xl');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('text-white');
  });

  it('renders description with correct styling', () => {
    render(<Card {...defaultProps} />);
    const description = screen.getByText('This is a test card description');
    
    expect(description).toHaveClass('text-gray-300');
  });
}); 