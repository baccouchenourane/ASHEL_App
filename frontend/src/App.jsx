import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; 
import EAmende from './components/EAmende';
import Login from './components/Login';
import Register from './components/Register';
import PaiementAmende from './components/paiementamende';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/e-amende" element={<EAmende />} />
        <Route path="/paiement-amende" element={<PaiementAmende />} />
        <Route path="/register" element={<Register />} />
        {/* Ajoute les autres routes ici plus tard */}
      </Routes>
    </Router>
  );
}

export default App;