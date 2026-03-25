import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Les routes doivent être à l'intérieur de la fonction et de <Router> */}
        <Routes>
          {/* La page par défaut au chargement sera le Login */}
          <Route path="/" element={<Login />} />
          
          {/* La page d'accueil après connexion */}
          <Route path="/home" element={<Home />} />
          
          {/* La page d'inscription pour les nouveaux citoyens */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
