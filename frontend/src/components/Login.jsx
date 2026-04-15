import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Fingerprint, AlertCircle, Check, Loader2, User as UserIcon, Signal, Wifi, Battery } from 'lucide-react';
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
      const data = await loginRequest(cin, password);
      const otp = data.otp;

      setGeneratedCode(otp);
      localStorage.setItem('temp_otp', otp);
      localStorage.setItem('pending_cin', cin);
      
      setShowSMS(true);

    } catch (err) {
      setError(err.response?.data?.error || err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container dark-theme">
      <div className="app-container">
        <div className="moucharabieh-overlay" />

        {/* Barre d'état (iPhone Style) - Pour matcher Register */}
        <div style={styles.statusBar}>
          <span style={styles.statusTime}>09:41</span>
          <div style={styles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

        {/* Bulle SMS simulée (Adaptée au nouveau conteneur) */}
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
              <button onClick={() => navigate('/verify-otp')} className="sms-btn-action">
                NOTÉ <Check size={14} />
              </button>
            </div>
          </div>
        )}

        <div style={styles.scrollArea}>
          
          {/* Logo & Branding - Style Register */}
          <div className="logo-container" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <img src={logoAshel} alt="Logo" className="main-logo-img" style={{ height: '75px', margin: '0 auto 10px' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b' }}>ASHAL <span style={{ color: '#E70011' }}>App</span></h1>
            <p className="app-slogan">RÉPUBLIQUE TUNISIENNE</p>
          </div>

          {/* Titres */}
          <div style={{ textAlign: 'left', marginBottom: '25px' }} className="fade-in">
            <h2 className="title-text">Bienvenue</h2>
            <p className="subtitle-text" style={{ fontWeight: '600', marginBottom: '8px' }}>أهلاً بك في تطبيق أسهل</p>
            <p className="subtitle-text">Identifiez-vous pour accéder à vos documents officiels.</p>
          </div>

          {/* Formulaire - Avec les classes CSS de Register */}
          <form onSubmit={handleLogin} className="fade-in">
            {error && (
              <div style={styles.errorBanner}>
                <AlertCircle size={16} /> <span>{error}</span>
              </div>
            )}

            <div className="input-with-icon">
              <UserIcon className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Numéro CIN (8 chiffres)"
                value={cin}
                onChange={(e) => setCin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                disabled={loading || showSMS}
                required
              />
            </div>

            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || showSMS}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary-ashel" 
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
          <div style={{ marginTop: '40px', textAlign: 'center', paddingBottom: '20px' }}>
            <Fingerprint size={40} color="#1e293b" style={{ opacity: 0.2, marginBottom: '8px', marginLeft: 'auto', marginRight: 'auto' }} />
            <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '800', letterSpacing: '1px' }}>SÉCURISÉ PAR L'ANCE & SMART GOV</p>
          </div>
        </div>
      </div>

      <style>{`
        /* On réutilise exactement les mêmes styles que Register */
        .auth-container.dark-theme { background: #f1f5f9; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
        .app-container { width: 390px; height: 844px; background: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); border-radius: 50px; border: 4px solid #334155; }
        .moucharabieh-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url("https://www.transparenttextures.com/patterns/arabesque.png"); opacity: 0.02; pointer-events: none; z-index: 1; }
        .logo-container { display: flex; flex-direction: column; align-items: center; z-index: 2; }
        .main-logo-img { width: 80px; margin-bottom: 8px; }
        .app-slogan { font-size: 9px; font-weight: 900; color: #0056D2; letter-spacing: 2px; text-transform: uppercase; }
        .title-text { font-size: 1.5rem; font-weight: 900; color: #1e293b; margin: 12px 0 6px; }
        .subtitle-text { font-size: 0.85rem; color: #64748b; line-height: 1.5; }
        
        .input-with-icon { position: relative; margin-bottom: 14px; z-index: 2; }
        .input-with-icon .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .input-with-icon input { width: 100%; padding: 15px 16px 15px 46px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; color: #1e293b; font-size: 0.9rem; transition: 0.2s; box-sizing: border-box; }
        .input-with-icon input:focus { border-color: #0056D2; outline: none; background: white; }
        
        .btn-primary-ashel { width: 100%; padding: 16px; border-radius: 16px; border: none; background: #1e293b; color: white; font-weight: 900; cursor: pointer; margin-top: 10px; transition: 0.3s; z-index: 2; }
        .btn-primary-ashel:hover { background: #0056D2; transform: scale(1.02); }

        .sms-notification-bubble {
          position: absolute; top: 55px; left: 15px; right: 15px;
          background: white; padding: 18px; border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15); z-index: 1000;
          border-left: 6px solid #E70011; animation: slideDown 0.4s ease-out;
        }
        .sms-header { margin: 0; fontSize: 0.7rem; fontWeight: 900; color: #E70011; text-transform: uppercase; letter-spacing: 1px; }
        .sms-content { margin: 8px 0; fontSize: 0.85rem; color: #1e293b; line-height: 1.4; }
        .sms-btn-action { background: #E70011; border: none; color: white; padding: 8px 14px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 5px; }

        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const styles = {
  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', color: '#64748b', zIndex: 10 },
  statusTime: { fontWeight: '700', fontSize: '13px', color: '#1e293b' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '20px 24px 24px', zIndex: 2, position: 'relative' },
  errorBanner: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.8rem', fontWeight: '600' }
};

export default Login;