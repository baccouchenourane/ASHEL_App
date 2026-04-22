// LayoutPrincipal.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatbotButton from '../components/ChatbotButton';
import Navbar from './Navbar';
import Footer from './Footer';

const LayoutPrincipal = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      
      {/* Chatbot disponible partout dans ce layout */}
      <ChatbotButton />
    </div>
  );
};

export default LayoutPrincipal;