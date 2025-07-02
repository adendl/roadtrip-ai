import React from 'react';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import Home from './pages/Home';
   import Login from './pages/Login';
   import SignUp from './pages/SignUp';
   import Dashboard from './pages/Dashboard';
   import './styles/index.css';
   import { AuthProvider } from './context/AuthContext';

   const App: React.FC = () => {
     return (
       <AuthProvider>
         <Router>
           <div className="min-h-screen">
             <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<SignUp />} />
               <Route path="/dashboard" element={<Dashboard />} />
             </Routes>
           </div>
         </Router>
       </AuthProvider>
     );
   };

   export default App;