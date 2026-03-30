import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Fingerprint, AlertCircle, Check, Loader2, User as UserIcon } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';
import { loginRequest } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [cin, setCin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // États pour la bulle SMS simulée
  const [showSMS, setShowSMS] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError('');

    if (cin.length !== 8) {
      setError('Le CIN doit comporter 8 chiffres.');
      return;
    }
    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }

    setLoading(true);

    try {
      // Appel au backend
      const data = await loginRequest(cin, password);
      
      // On récupère l'OTP (simulé par le backend pour ton projet)
      const otp = data.otp;

      // STOCKAGE HARMONISÉ pour VerifyOTP.jsx
      setGeneratedCode(otp);
      localStorage.setItem('temp_otp', otp);
      localStorage.setItem('pending_cin', cin);
      
      // Affichage de la notification type iOS
      setShowSMS(true);

    } catch (err) {
      // On affiche l'erreur venant du backend (ex: "Mot de passe incorrect")
      setError(err.response?.data?.error || err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Bulle SMS simulée (Style iOS) */}
      {showSMS && (
        <div className="sms-notification-bubble">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p className="sms-header">Messages • À l'instant</p>
              <p className="sms-content">
                ASHAL : Votre code de sécurité est{' '}
                <strong style={{ fontSize: '1.1rem', color: '#E70011' }}>{generatedCode}</strong>.
              </p>
            </div>

            <button
              onClick={() => navigate('/verify-otp')}
              className="sms-btn-action"
            >
              NOTÉ <Check size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="moucharabieh-overlay"></div>

      <div style={{ padding: '40px 25px', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
        
        {/* Logo & Branding */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }} className="fade-in">
          <img src={logoAshel} alt="Logo" style={{ height: '75px', marginBottom: '10px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900' }}>ASHAL <span style={{ color: '#E70011' }}>App</span></h1>
          <p style={{ fontSize: '0.65rem', letterSpacing: '3px', color: '#64748B', fontWeight: '800' }}>RÉPUBLIQUE TUNISIENNE</p>
        </div>

        {/* Titres */}
        <div style={{ textAlign: 'left', marginBottom: '25px' }} className="fade-in">
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '4px' }}>Bienvenue</h2>
          <p style={{ fontSize: '1rem', color: '#64748B', fontWeight: '600', marginBottom: '8px' }}>أهلاً بك في تطبيق أسهل</p>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>Identifiez-vous pour accéder à vos documents officiels.</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="fade-in">
          {error && (
            <div className="error-banner">
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <input
              type="text"
              placeholder="Numéro CIN (8 chiffres)"
              className="ashal-input"
              value={cin}
              onChange={(e) => setCin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              disabled={loading || showSMS}
              required
            />
            <UserIcon size={18} className="input-icon" />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Mot de passe"
              className="ashal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || showSMS}
              required
            />
            <Lock size={18} className="input-icon" />
          </div>

          <button 
            type="submit" 
            className="btn-ashal-primary" 
            disabled={loading || showSMS}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> VÉRIFICATION...</>
            ) : (
              "S'IDENTIFIER"
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#64748B' }}>
          Pas encore de compte ?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#0056D2', fontWeight: '800', cursor: 'pointer' }}>
            S'inscrire
          </span>
        </p>

        {/* Footer Sécurité */}
        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '10px' }}>
          <Fingerprint size={40} color="#1e293b" style={{ opacity: 0.2, marginBottom: '8px' }} />
          <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '800', letterSpacing: '1px' }}>SÉCURISÉ PAR L'ANCE & SMART GOV</p>
        </div>
      </div>

      <style>{`
        .sms-notification-bubble {
          position: absolute; top: 15px; left: 15px; right: 15px;
          backgroundColor: #FFFFFF; padding: 18px; borderRadius: '24px';
          boxShadow: 0 15px 40px rgba(0,0,0,0.15); z-index: 1000;
          border-left: 6px solid #E70011; animation: slideDown 0.4s ease-out;
          background: white;
        }
        .sms-header { margin: 0; fontSize: 0.7rem; fontWeight: 900; color: #E70011; text-transform: uppercase; letter-spacing: 1px; }
        .sms-content { margin: 8px 0; fontSize: 0.85rem; color: #1e293b; line-height: 1.4; }
        .sms-btn-action {
          background: #E70011; border: none; color: white;
          padding: 8px 14px; border-radius: 12px; font-size: 0.7rem;
          font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 5px;
        }
        .error-banner {
          background: #fef2f2; color: #b91c1c; padding: 12px; 
          border-radius: 12px; margin-bottom: 15px; font-size: 0.8rem;
          display: flex; align-items: center; gap: 8px; font-weight: 600;
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
