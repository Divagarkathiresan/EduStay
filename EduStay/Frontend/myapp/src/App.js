import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Profile from './pages/Profile/Profile';
import AboutUs from './pages/AboutUs/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';
import Navbar from './components/navbar/Navbar';
import Chatbot from './components/chatbot/Chatbot';
import Property from './pages/Properties/Property';
import AddProperty from './pages/AddProperty/AddProperty';

function AppContent() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);
  
  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties/:location" element={<Property />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
