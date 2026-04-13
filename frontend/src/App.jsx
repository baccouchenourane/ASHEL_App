import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EAmende from './components/EAmende';
import Login from './components/Login';
import Register from './components/Register';
import PaiementAmende from './components/PaiementAmende';
import VerifyOTP from './components/verifyotp';
import Signalement from './components/Signalement';
import Evaluation from './components/Evaluation';
import Reclamation from './components/Reclamation';
import SignalementList from './components/SignalementList';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/e-amende" element={<EAmende />} />
        <Route path="/paiement-amende" element={<PaiementAmende />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/signalement" element={<Signalement />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/reclamation" element={<Reclamation />} />
        <Route path="/mes-signalements" element={<SignalementList />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;