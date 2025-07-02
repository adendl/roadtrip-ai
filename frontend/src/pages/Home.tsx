import React from 'react';
import Button from '../components/Button';
import Hero from '../components/Hero';
import Header from '../components/Header';
import Card from '../components/Card';
import { CommandLineIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <Hero
            title="Plan Your Perfect Roadtrip"
            description="Let Roadtrip.ai craft a personalised itinerary for your next adventure. Our AI optimises your route, suggests the best stops, and seamlessly integrates EV charging stations—making every journey smooth and sustainable. Start exploring today!"
          />
          <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:space-x-6">
            {!isLoggedIn ? (
              <>
                <Button
                  text="Get Started"
                  onClick={() => window.location.href = '/signup'}
                  variant="primary"
                />
                <Button
                  text="Login"
                  onClick={() => window.location.href = '/login'}
                  variant="secondary"
                />
              </>
            ) : (
              <Button
                text="Plan Your Trip"
                onClick={() => navigate('/dashboard')}
                variant="primary"
              />
            )}
          </div>

          {/* Features Cards Section */}
          <section id="features" className="mt-16 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {/* Card 1: Trip Planning */}
              <Card
                title="Trip Planning"
                description="Easily create custom road trip itineraries with AI-driven route suggestions tailored to your preferences."
                imageUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="Trip Planning"
                className="hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300"
              />

              {/* Card 2: EV Charging Integration */}
              <Card
                title="EV Charging Integration"
                description="Plan your route with conveniently located EV charging stations for a sustainable journey."
                imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="EV Charging Integration"
                className="hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300"
              />

              {/* Card 3: Route Optimization */}
              <Card
                title="Route Optimization"
                description="AI optimises your path to save time and fuel, suggesting the best stops along the way."
                imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="Route Optimization"
                className="hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300"
              />

              {/* Card 4: Activity Suggestions */}
              <Card
                title="Activity Suggestions"
                description="Discover tailored activities like adventure, food, and sightseeing based on your interests."
                imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="Activity Suggestions"
                className="hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300"
              />

              {/* Card 5: Real-Time Updates */}
              <Card
                title="Real-Time Updates"
                description="Get live traffic and weather updates to adjust your itinerary on the go."
                imageUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="Real-Time Updates"
                className="hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300"
              />

              {/* Card 6: Trip Sharing */}
              <Card
                title="Trip Sharing"
                description="Share your planned routes and itineraries with friends or save them privately."
                imageUrl="https://images.unsplash.com/photo-1750801321932-3d3e3fcdfdcd?q=80&w=1740&auto=format&fit=crop&w=300&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                altText="Trip Sharing"
                className="hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300"
              />
            </div>
          </section>
        </div>
      </main>
      {/* Footer with GitHub Link */}
      <footer className="w-full py-6 bg-gray-800 bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>Read Source Code on GitHub</p>
          <a
            href="https://github.com/adendl/traveljournal-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent font-semibold text-lg hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 px-4 py-2 rounded-full shadow-md hover:shadow-lg"
          >
            <CommandLineIcon className="h-6 w-6 mr-2 text-black" />
            https://github.com/adendl/traveljournal-ai
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;