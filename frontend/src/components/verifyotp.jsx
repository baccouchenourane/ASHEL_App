import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Check } from 'lucide-react';
import '../App.css';
import { verifyOtpRequest, loginRequest } from '../services/api';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Code incorrect. Réessayez.');
  const [loading, setLoading] = useState(false);

  const [showSMS, setShowSMS] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    const savedOTP = localStorage.getItem('temp_otp');
    if (savedOTP) setGeneratedCode(savedOTP);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const cin = localStorage.getItem('pending_cin');

    try {
      // Appel réel au backend Spring Boot
      const data = await verifyOtpRequest(cin, otp);

      // Sauvegarder les infos utilisateur pour Home.jsx
      localStorage.setItem('user_ashel', JSON.stringify(data.user));
      localStorage.removeItem('temp_otp');
      localStorage.removeItem('pending_cin');

      navigate('/home');
    } catch (err) {
      setErrorMsg(err.message || 'Code incorrect. Réessayez.');
      setError(true);
      setTimeout(() => setError(false), 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const cin = localStorage.getItem('pending_cin');
    // On ne peut pas renvoyer sans le mot de passe - on redirige vers login
    // Alternative : stocker temporairement le password (non recommandé en prod)
    // Ici on génère juste un nouveau code localement (simulation)
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    localStorage.setItem('temp_otp', newCode);
    setShowSMS(true);
  };

  return (
    <div className="app-container" style={{ padding: '40px 25px', textAlign: 'center' }}>

      {/* Bulle SMS de renvoi */}
      {showSMS && (
        <div style={{
          position: 'absolute', top: '15px', left: '15px', right: '15px',
          backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '20px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)', zIndex: 100,
          borderLeft: '6px solid #E70011', textAlign: 'left', animation: 'slideDown 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: '#E70011' }}>NOUVEAU MESSAGE</p>
              <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#1A1D23' }}>
                ASHAL : Votre nouveau code est <strong style={{ fontSize: '1.1rem' }}>{generatedCode}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowSMS(false)}
              style={{ background: '#E70011', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="moucharabieh-overlay"></div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div onClick={() => navigate('/')} style={{ position: 'absolute', top: '-10px', left: '0', cursor: 'pointer' }}>
          <ArrowLeft size={24} color="#64748B" />
        </div>

        <div style={{ marginTop: '50px' }}>
          <div style={{ background: '#F1F5F9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShieldCheck size={40} color="#E70011" />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Vérification</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '30px' }}>
            Saisissez le code de sécurité reçu par SMS.
          </p>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%', padding: '15px', fontSize: '1.8rem', textAlign: 'center',
                borderRadius: '15px', border: error ? '2px solid #E70011' : '1px solid #E2E8F0',
                marginBottom: '20px', letterSpacing: '8px', fontWeight: 'bold', outline: 'none'
              }}
            />
            {error && (
              <p style={{ color: '#E70011', fontSize: '0.8rem', marginTop: '-15px', marginBottom: '15px', fontWeight: 'bold' }}>
                {errorMsg}
              </p>
            )}

            <button type="submit" className="btn-ashal-primary" disabled={loading}>
              {loading ? 'VÉRIFICATION...' : 'CONFIRMER'}
            </button>
          </form>

          <div
            onClick={handleResend}
            style={{
              marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', color: '#0056D2', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} /> Renvoyer le code
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
