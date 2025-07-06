import React, { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HomeTripForm from '../components/HomeTripForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Hero.css';

const Home: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showTripForm, setShowTripForm] = useState(false);

  const handleTripData = (tripData: any) => {
    console.log('Home page received trip data:', tripData);
    console.log('User logged in:', isLoggedIn);
    
    if (!isLoggedIn) {
      // Store trip data in localStorage and redirect to signup
      console.log('Redirecting to signup');
      localStorage.setItem('pendingTripData', JSON.stringify(tripData));
      navigate('/signup');
    } else {
      // If logged in, store the trip data and navigate to dashboard
      console.log('Redirecting to dashboard');
      localStorage.setItem('pendingTripData', JSON.stringify(tripData));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header />
      <main>
        {/* Hero Section with Trip Form */}
        <Hero
          title="Plan Your Perfect Roadtrip"
          description="Let Roadtrip.ai craft a personalised itinerary for your next adventure, with AI-driven routes and tailored suggestions."
        >
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <HomeTripForm onTripData={handleTripData} />
          </motion.section>
        </Hero>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center font-montserrat">Explore Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-item rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Trip Planning" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 font-montserrat">Trip Planning</h3>
                <p className="text-gray-600 font-roboto">Easily create custom road trip itineraries with AI-driven route suggestions.</p>
              </div>
            </div>
            <div className="feature-item rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Activity Suggestions" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 font-montserrat">Activity Suggestions</h3>
                <p className="text-gray-600 font-roboto">Discover tailored activities like adventure, food, and sightseeing.</p>
              </div>
            </div>
            <div className="feature-item rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Route Optimization" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 font-montserrat">Route Optimisation</h3>
                <p className="text-gray-600 font-roboto">AI optimises your path to save time and fuel with the best stops.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gray-200 rounded-xl p-8"
        >
          <h3 className="text-3xl font-bold mb-4 font-montserrat text-gray-900">Stay Updated</h3>
          <p className="text-lg mb-6 font-roboto text-gray-700">Subscribe for the latest travel tips and AI-powered road trip updates!</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto"
            />
            <Button
              text="Subscribe"
              variant="primary"
              className="px-6 py-3 text-lg font-roboto bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            />
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
        >
          <h3 className="text-3xl font-bold mb-8 text-center font-montserrat">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <blockquote className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic font-roboto">"Roadtrip.ai made planning my cross-country trip a breeze! The route suggestions were spot on."</p>
              <span className="block mt-4 font-bold text-gray-900 font-montserrat">- Alex P.</span>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic font-roboto">"Love the activity ideas—turned my weekend into an adventure!"</p>
              <span className="block mt-4 font-bold text-gray-900 font-montserrat">- Sarah K.</span>
            </blockquote>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home;