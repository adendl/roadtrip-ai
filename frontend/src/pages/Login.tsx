import React, { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error('Login Error:', err);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header className="bg-gray-700 bg-opacity-70 border-b border-gray-600" />
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat">Login</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-roboto"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-roboto"
            />
            <Button
              text="Login"
              onClick={handleSubmit}
              variant="primary"
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            />
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
          </div>
          <p className="mt-4 text-center text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="text-indigo-600 hover:text-indigo-700">
              Sign Up
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;