import React from 'react';

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, icon, onClick, variant, className, type = 'button', disabled }) => {
  const baseStyles = 'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50';
  const variantStyles = variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className || ''}`}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;