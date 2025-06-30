import React from 'react';

interface ButtonProps {
  text: string;
  onClick: (e: React.MouseEvent) => void; // Updated to accept MouseEvent
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary', icon }) => {
  const baseStyles = 'px-6 py-3 rounded-lg text-white font-semibold focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5';
  const variantStyles = variant === 'primary'
    ? 'bg-indigo-600 hover:bg-indigo-700'
    : 'bg-gray-600 hover:bg-gray-700';

  return (
    <button
      className={`${baseStyles} ${variantStyles}`}
      onClick={onClick}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && icon}
        {text}
      </span>
    </button>
  );
};

export default Button;