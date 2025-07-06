import React, { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import axios from 'axios';
import { motion } from 'framer-motion';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{12,}$/;

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., user@domain.com)');
      return;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 12 characters long');
      return;
    }

    try {
      const response = await axios.post(`https://roadtrip-ai-backend-688052801817.australia-southeast1.run.app/api/users/register`, {
        username,
        email,
        password,
      });
      console.log('Registration Success:', response.data);
      setSuccessMessage('Registration Successful!');
      setTimeout(() => {
        // Check if there's pending trip data
        const pendingTripData = localStorage.getItem('pendingTripData');
        if (pendingTripData) {
          // Redirect to dashboard to continue with trip planning
          window.location.href = '/dashboard';
        } else {
          // Redirect to login
        window.location.href = '/login';
        }
      }, 2000);
    } catch (error) {
      console.error('Registration Error:', error);
      setEmailError('Registration failed. Please try again or check your details.');
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header className="bg-gray-700 bg-opacity-70 border-b border-gray-600" /> {/* Updated to dark transparent with border */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', filter: 'blur(5px)' }}
      ></div>
      <main className="min-h-screen flex items-center justify-center pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-80 p-8 rounded-xl shadow-lg max-w-md w-full z-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat">Sign Up</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-roboto"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-roboto"
              />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-roboto"
              />
              {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
            </div>
            <Button
              text="Sign Up"
              onClick={handleSubmit}
              variant="primary"
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            />
            {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
          </div>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700">
              Login
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default SignUp;