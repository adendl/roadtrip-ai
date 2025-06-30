import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, altText }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default Card;