import React, { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Login Attempt:', { username, password });
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