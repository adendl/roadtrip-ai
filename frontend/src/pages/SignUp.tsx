import React, { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import axios from 'axios';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email regex: basic format check (e.g., user@domain.com)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Password regex: at least 12 characters
  const passwordRegex = /^.{12,}$/;

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

    // Validation
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address (e.g., user@domain.com)');
      return;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 12 characters long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9090/api/users/register', {
        username,
        email,
        password,
      });
      console.log('Registration Success:', response.data);
      setSuccessMessage('Registration Successful!');
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Registration Error:', error);
      setEmailError('Registration failed. Please try again or check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
              </div>
              <Button
                text="Sign Up"
                onClick={handleSubmit}
                variant="primary"
              />
              {successMessage && <p className="text-green-400 text-center mt-4">{successMessage}</p>}
            </div>
            <p className="mt-4 text-center text-gray-300">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-300 hover:text-indigo-400">
                Login
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;