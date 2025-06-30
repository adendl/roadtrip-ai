import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed w-full bg-transparent backdrop-blur-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold"><a href="/">Travel Journal AI</a></div>
        <nav className="space-x-6">
          <a href="/#features" className="hover:text-indigo-300 transition-colors">Features</a>
          <a href="#about" className="hover:text-indigo-300 transition-colors">About</a>
          <a href="/login" className="hover:text-indigo-300 transition-colors">Login</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;