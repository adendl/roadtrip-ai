import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  const baseStyles = 'px-6 py-2 rounded-full text-white font-semibold focus:outline-none transition duration-200';
  const variantStyles = variant === 'primary' 
    ? 'bg-indigo-600 hover:bg-indigo-700' 
    : 'bg-gray-600 hover:bg-gray-700';

  return (
    <button className={`${baseStyles} ${variantStyles}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;