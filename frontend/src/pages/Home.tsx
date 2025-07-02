import React from 'react';
import Button from '../components/Button';
import Hero from '../components/Hero';
import Header from '../components/Header';
import Card from '../components/Card';
import { CommandLineIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Custom social media icons with className prop
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.069 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.069c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.069-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.069 4.85-.069zm0 1.5c-3.162 0-3.553.013-4.799.072-1.24.059-2.388.277-3.262.751-.875.474-1.622 1.221-2.096 2.096-.474.874-.692 2.022-.751 3.262-.059 1.246-.072 1.637-.072 4.799s.013 3.553.072 4.799c.059 1.24.277 2.388.751 3.262.474.875 1.221 1.622 2.096 2.096.874.474 2.022.692 3.262.751 1.246.059 1.637.072 4.799.072s3.553-.013 4.799-.072c1.24-.059 2.388-.277 3.262-.751.875-.474 1.622-1.221 2.096-2.096.474-.874.692-2.022.751-3.262.059-1.246.072-1.637.072-4.799s-.013-3.553-.072-4.799c-.059-1.24-.277-2.388-.751-3.262-.474-.875-1.221-1.622-2.096-2.096-.874-.474-2.022-.692-3.262-.751-1.246-.059-1.637-.072-4.799-.072zm0 4.5a3.75 3.75 0 100 7.5 3.75 3.75 0 100-7.5zm0 1.5a2.25 2.25 0 110 4.5 2.25 2.25 0 110-4.5z" clipRule="evenodd"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
  </svg>
);

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

          {/* Call-to-Action Section */}
          <section className="mt-8 bg-indigo-800 bg-opacity-50 p-8 rounded-xl shadow-lg transform hover:scale-102 transition-transform duration-300"> {/* Reduced mt-16 to mt-8 */}
            <h3 className="text-2xl font-bold text-white mb-4">Ready for Your Adventure?</h3>
            <p className="text-gray-200 mb-6">
              {isLoggedIn
                ? "Continue your journey with AI-powered planning."
                : "Unlock your dream road trip with AI-powered planning. Sign up now and start planning today!"}
            </p>
            {!isLoggedIn ? (
              <Button
                text="Get Started"
                onClick={() => window.location.href = '/signup'}
                variant="primary"
                className="px-6 py-3 text-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full shadow-md hover:shadow-lg"
              />
            ) : (
              <Button
                text="Plan Your Trip"
                onClick={() => navigate('/dashboard')}
                variant="primary"
                className="px-6 py-3 text-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full shadow-md hover:shadow-lg"
              />
            )}
          </section>

          {/* Features Cards Section */}
          <section id="features" className="mt-16 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* Card 1: Trip Planning */}
              <Card
                title="Trip Planning"
                description="Easily create custom road trip itineraries with AI-driven route suggestions tailored to your preferences."
                imageUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                altText="Trip Planning"
                className="h-96 hover:-translate-y-4 hover:scale-105 transition-transform transition-shadow duration-300"
              />

              {/* Card 2: Activity Suggestions */}
              <Card
                title="Activity Suggestions"
                description="Discover tailored activities like adventure, food, and sightseeing based on your interests."
                imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                altText="Activity Suggestions"
                className="h-96 hover:-translate-y-4 hover:scale-105 transition-transform transition-shadow duration-300"
              />

              {/* Card 3: Route Optimization */}
              <Card
                title="Route Optimization"
                description="AI optimises your path to save time and fuel, suggesting the best stops along the way."
                imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                altText="Route Optimization"
                className="h-96 hover:-translate-y-4 hover:scale-105 transition-transform transition-shadow duration-300"
              />
            </div>
          </section>

          {/* Newsletter Signup Section */}
          <section className="mt-16 bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-lg w-full max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-200 mb-4">Subscribe to our newsletter for the latest travel tips and AI-powered road trip updates!</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                text="Subscribe"
                variant="primary"
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-lg"
              />
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mt-16 bg-indigo-800 bg-opacity-50 p-8 rounded-xl shadow-lg w-full max-w-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">What Our Users Say</h3>
            <div className="space-y-4">
              <blockquote className="text-gray-200 italic">
                "Roadtrip.ai made planning my cross-country trip a breeze! The route suggestions were spot on."  
                <span className="block mt-2 font-semibold text-white">- Alex P.</span>
              </blockquote>
              <blockquote className="text-gray-200 italic">
                "Love the activity ideas—turned my weekend into an adventure!"  
                <span className="block mt-2 font-semibold text-white">- Sarah K.</span>
              </blockquote>
            </div>
          </section>

          {/* Social Media Section */}
          <section className="mt-16 flex justify-center space-x-6">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
              <InstagramIcon className="h-8 w-8" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
              <TwitterIcon className="h-8 w-8" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
              <FacebookIcon className="h-8 w-8" />
            </a>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;