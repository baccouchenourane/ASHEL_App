import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import des composants depuis le dossier components
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import EAdministration from './components/EAdministration/EAdministration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/e-admin" element={<EAdministration />} />
      </Routes>
    </Router>
  );
}

export default App;