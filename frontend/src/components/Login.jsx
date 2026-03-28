import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Fingerprint, AlertCircle, Check } from 'lucide-react';
import '../App.css'; 
import logoAshel from '../assets/logo_ashel.png';
import { loginRequest } from '../services/api'; // <--- IMPORTATION IMPORTANTE

const Login = () => {
  const navigate = useNavigate();
  const [cin, setCin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- ÉTATS POUR LE SMS ---
  const [showSMS, setShowSMS] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleLogin = async (e) => { // <--- AJOUT DE async
    e.preventDefault();
    setError('');
    
    if (cin.length !== 8) {
      setError("Le CIN doit comporter 8 chiffres.");
      return;
    }

    setLoading(true);

    try {
      // 1. APPEL RÉEL AU BACKEND (On n'utilise plus Math.random)
      const data = await loginRequest(cin, password);
      const serverOtp = data.otp;

      // 2. MISE À JOUR DES ÉTATS ET DU STORAGE
      setGeneratedCode(serverOtp);
      localStorage.setItem('temp_otp', serverOtp);
      localStorage.setItem('pending_cin', cin);
      localStorage.setItem('temp_pwd', password); // Sauvegardé pour le "Renvoyer"

      // 3. AFFICHAGE DU SMS
      setShowSMS(true);

    } catch (err) {
      setError(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* --- LE SMS SYNCHRONISÉ AVEC LE BACKEND --- */}
      {showSMS && (
        <div style={{
          position: 'absolute', top: '15px', left: '15px', right: '15px',
          backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '20px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)', zIndex: 100,
          borderLeft: '6px solid #E70011', animation: 'slideDown 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: '#E70011', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Messages • À l'instant
              </p>
              <p style={{ margin: '8px 0', fontSize: '0.85rem', color: '#1A1D23', lineHeight: '1.4' }}>
                ASHAL : Votre code de sécurité est <strong style={{ fontSize: '1.1rem', color: '#E70011' }}>{generatedCode}</strong>.
              </p>
            </div>
            <button 
              onClick={() => navigate('/verify-otp')}
              style={{
                background: '#E70011', border: 'none', color: 'white', 
                padding: '8px 12px', borderRadius: '10px', fontSize: '0.7rem', 
                fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              NOTÉ <Check size={14} />
            </button>
          </div>
        </div>
      )}

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
            <input 
                type="text" 
                placeholder="Numéro CIN (8 chiffres)" 
                className="ashal-input" 
                value={cin} 
                onChange={(e) => setCin(e.target.value.replace(/\D/g, '').slice(0, 8))} 
                required 
            />
            <Mail size={18} className="input-icon" />
          </div>
          
          <div className="input-group">
            <input 
                type="password" 
                placeholder="Mot de passe" 
                className="ashal-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <Lock size={18} className="input-icon" />
          </div>
          
          <button type="submit" className="btn-ashal-primary" disabled={loading || showSMS}>
            {loading ? "VÉRIFICATION..." : "S'IDENTIFIER"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
          Pas encore de compte ? <span onClick={() => navigate('/register')} style={{ color: '#0056D2', fontWeight: 'bold', cursor: 'pointer' }}>S'inscrire</span>
        </p>

        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '10px' }}>
            <Fingerprint size={45} color="#1A1D23" style={{ opacity: 0.15, marginBottom: '5px' }} />
            <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '700' }}>SÉCURISÉ PAR L'ANCE</p>
        </div>
      </div>
    </div>
  );
};

export default Login;