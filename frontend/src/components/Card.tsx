import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, altText, className }) => {
  return (
    <div className={`bg-white bg-opacity-10 p-6 rounded-lg shadow-lg hover:shadow-xl ${className || ''}`}>
      <img src={imageUrl} alt={altText} className="w-full h-32 object-cover rounded-t-lg" />
      <h3 className="text-xl font-semibold mt-4 text-white">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
  );
};

export default Card;