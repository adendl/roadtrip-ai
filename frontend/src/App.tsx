import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<div>Sign Up Page (TBD)</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;