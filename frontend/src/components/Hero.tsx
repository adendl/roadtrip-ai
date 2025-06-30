import React from 'react';

interface HeroProps {
  title: string;
  description: string;
}

const Hero: React.FC<HeroProps> = ({ title, description }) => {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8 bg-transparent">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in text-white drop-shadow-lg">
        {title}
      </h1>
      <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default Hero;