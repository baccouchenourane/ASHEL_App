import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Fingerprint, AlertCircle } from 'lucide-react';
import '../App.css'; 
import logoAshel from '../assets/logo_ashel.png';

const Login = () => {
  const navigate = useNavigate();
  const [cin, setCin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem('user_ashel'));
      if ((storedUser && storedUser.cin === cin && storedUser.password === password) || 
          (cin === "12345678" && password === "admin")) {
        setLoading(false);
        navigate('/home'); 
      } else {
        setLoading(false);
        setError("CIN ou mot de passe incorrect.");
      }
    }, 1200);
  };

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>
      <div style={{ padding: '40px 25px', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }} className="fade-in">
          <img src={logoAshel} alt="Logo" style={{ height: '75px', marginBottom: '10px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>ASHAL <span style={{ color: '#E70011' }}>App</span></h1>
          <p style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#64748B', fontWeight: '800' }}>RÉPUBLIQUE TUNISIENNE</p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '25px' }} className="fade-in">
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Bienvenue</h2>
          <p style={{ fontSize: '1rem', color: '#64748B', fontWeight: '500' }}>أهلاً بك في تطبيق أسهل</p>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Identifiez-vous pour accéder à vos documents officiels.</p>
        </div>

        <form onSubmit={handleLogin} className="fade-in">
          {error && <div style={{ color: '#B91C1C', fontSize: '0.8rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><AlertCircle size={14} /> {error}</div>}
          <div className="input-group">
            <input type="text" placeholder="Numéro CIN (8 chiffres)" className="ashal-input" value={cin} onChange={(e) => setCin(e.target.value.replace(/\D/g, '').slice(0, 8))} required />
            <Mail size={18} className="input-icon" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Mot de passe" className="ashal-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Lock size={18} className="input-icon" />
          </div>
          <button type="submit" className="btn-ashal-primary" disabled={loading}>{loading ? "VÉRIFICATION..." : "S'IDENTIFIER"}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
          Pas encore de compte ? <span onClick={() => navigate('/register')} style={{ color: '#0056D2', fontWeight: 'bold', cursor: 'pointer' }}>S'inscrire</span>
        </p>

        {/* EMPREINTE DIGITALE EN BAS */}
        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '10px' }}>
            <Fingerprint size={45} color="#1A1D23" style={{ opacity: 0.15, marginBottom: '5px' }} />
            <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '700' }}>SÉCURISÉ PAR L'ANCE</p>
        </div>
      </div>
    </div>
  );
};

export default Login;