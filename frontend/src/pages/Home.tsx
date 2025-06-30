import React from 'react';
import Button from '../components/Button';
import Hero from '../components/Hero';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero
        title="Welcome to Travel Journal AI"
        description="Capture your travel adventures with ease. Create digital journals, add photos and videos, get AI-powered insights, and share your stories with the world."
      />
      <div className="mt-8 space-x-4">
        <Button text="Sign Up" onClick={() => window.location.href = '/signup'} />
        <Button text="Login" onClick={() => window.location.href = '/login'} variant="secondary" />
      </div>
    </div>
  );
};

export default Home;