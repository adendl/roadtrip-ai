import React from 'react';

interface HeroProps {
  title: string;
  description: string;
}

const Hero: React.FC<HeroProps> = ({ title, description }) => {
  return (
    <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg max-w-2xl mx-auto">{description}</p>
    </div>
  );
};

export default Hero;