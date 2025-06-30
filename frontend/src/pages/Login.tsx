import React, { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`http://localhost:9090/api/users/login`, {
        username,
        password,
      });
      const token = response.data;
      login(token);
      setSuccessMessage('Login Successful!');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error('Login Error:', err);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                text="Login"
                onClick={handleSubmit}
                variant="primary"
              />
              {error && <p className="text-red-400 text-center mt-4">{error}</p>}
              {successMessage && <p className="text-green-400 text-center mt-4">{successMessage}</p>}
            </div>
            <p className="mt-4 text-center text-gray-300">
              Don’t have an account?{' '}
              <a href="/signup" className="text-indigo-300 hover:text-indigo-400">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;




