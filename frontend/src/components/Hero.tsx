import React, { ReactNode } from 'react';

interface HeroProps {
  title: string;
  description: string;
  children?: ReactNode; // Added to allow CTA section as children
}

const Hero: React.FC<HeroProps> = ({ title, description, children }) => {
  return (
    <>
      <style>
        {`
          .hero {
            perspective: 1px;
            overflow-x: hidden;
            overflow-y: auto;
          }
          .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: inherit;
            transform: translateZ(-1px) scale(2);
            z-index: -1;
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <div className="px-4 py-32 sm:px-6 lg:px-8 bg-transparent relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1676122796020-19c6df3a78b5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4 w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in text-white drop-shadow-lg font-montserrat">
            {title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200 leading-relaxed font-roboto">
            {description}
          </p>
          {children}
        </div>
      </div>
    </>
  );
};

export default Hero;