import React from 'react';
import Button from '../components/Button';
import Hero from '../components/Hero';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      {/* Header */}
      <header className="fixed w-full bg-transparent backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Travel Journal AI</div>
          <nav className="space-x-6">
            <a href="#features" className="hover:text-indigo-300 transition-colors">Features</a>
            <a href="#about" className="hover:text-indigo-300 transition-colors">About</a>
            <a href="/login" className="hover:text-indigo-300 transition-colors">Login</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <Hero
            title="Welcome to Travel Journal AI"
            description="Capture your travel adventures with ease. Create digital journals, add photos and videos, get AI-powered insights, and share your stories with the world."
          />
          <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:space-x-6">
            <Button
              text="Get Started"
              onClick={() => window.location.href = '/signup'}
              variant="primary"
            />
            <Button
              text="Learn More"
              onClick={() => window.location.href = '/login'}
              variant="secondary"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;