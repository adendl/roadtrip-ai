import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed w-full bg-transparent backdrop-blur-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Travel Journal AI</div>
        <nav className="flex items-center space-x-6">
          {!isLoggedIn && (
            <>
              <a href="/login" className="hover:text-indigo-300 transition-colors">Login</a>
              <a href="/signup" className="hover:text-indigo-300 transition-colors">Sign Up</a>
            </>
          )}
          {isLoggedIn && (
            <div className="relative">
              <button onClick={toggleMenu} className="focus:outline-none">
                <UserCircleIcon className="h-10 w-10 text-white hover:text-indigo-300 transition-colors" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-20">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 hover:text-indigo-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;