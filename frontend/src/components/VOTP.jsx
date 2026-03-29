import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Check } from 'lucide-react';
import '../App.css';
import { loginRequest, verifyOtpRequest } from '../services/api'; // <--- NE PAS OUBLIER CET IMPORT

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false); // État pour le chargement
  
  // --- ÉTATS POUR LE RENVOI DU SMS ---
  const [showSMS, setShowSMS] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Au chargement, on récupère le code initial
  useEffect(() => {
    const savedOTP = localStorage.getItem('temp_otp');
    if (savedOTP) setGeneratedCode(savedOTP);
  }, []);

const handleVerify = async (e) => {
  e.preventDefault();
  const cin = localStorage.getItem('pending_cin');
  
  console.log("=== VERIFY OTP ===");
  console.log("CIN:", cin);
  console.log("OTP saisi:", otp);

  try {
    const res = await fetch('http://localhost:8081/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin, code: otp.trim() }),
    });

    console.log("Status HTTP:", res.status);
    const data = await res.json();
    console.log("Réponse backend:", data);

    if (!res.ok) {
      throw new Error(data.message || 'Erreur');
    }

    localStorage.setItem('user_ashel', JSON.stringify(data.user));
    localStorage.removeItem('temp_otp');
    localStorage.removeItem('temp_pwd');
    localStorage.removeItem('pending_cin');

    console.log("✅ Navigation vers /home...");
    navigate('/home');

  } catch (err) {
    console.error("❌ ERREUR:", err.message);
    setError(true);
    setTimeout(() => setError(false), 2500);
  }
};
  const handleResend = async () => {
    const cin = localStorage.getItem('pending_cin');
    const password = localStorage.getItem('temp_pwd');

    if (!cin || !password) {
        alert("Session expirée. Veuillez recommencer le login.");
        navigate('/');
        return;
    }

    try {
        setLoading(true);
        const data = await loginRequest(cin, password);
        
        // Mise à jour de l'affichage avec le nouveau code du backend
        setGeneratedCode(data.otp);
        localStorage.setItem('temp_otp', data.otp);
        
        setShowSMS(true); // Affiche la bulle SMS
        console.log("Nouveau code reçu :", data.otp);
    } catch (err) {
        alert("Erreur réseau : impossible de renvoyer le code.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Bulle SMS de renvoi */}
      {showSMS && (
        <div style={{
          position: 'absolute', top: '15px', left: '15px', right: '15px',
          backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '20px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)', zIndex: 100,
          borderLeft: '6px solid #E70011', animation: 'slideDown 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: '#E70011', textTransform: 'uppercase' }}>
                Messages • À l'instant
              </p>
              <p style={{ margin: '8px 0', fontSize: '0.85rem', color: '#1A1D23' }}>
                ASHAL : Votre nouveau code est <strong style={{ fontSize: '1.1rem', color: '#E70011' }}>{generatedCode}</strong>
              </p>
            </div>
            <button 
              onClick={() => setShowSMS(false)} 
              style={{ background: '#E70011', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}
            >
              OK <Check size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="moucharabieh-overlay"></div>
      
      <div style={{ position: 'relative', zIndex: 2, padding: '40px 25px' }}>
        <div onClick={() => navigate('/')} style={{ position: 'absolute', top: '20px', left: '20px', cursor: 'pointer' }}>
          <ArrowLeft size={24} color="#64748B" />
        </div>

        <div style={{ marginTop: '50px', textAlign: 'center' }}>
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
            {error && <p style={{ color: '#E70011', fontSize: '0.8rem', marginTop: '-15px', marginBottom: '15px', fontWeight: 'bold' }}>Code incorrect. Réessayez.</p>}
            
            <button type="submit" className="btn-ashal-primary" disabled={loading}>
                {loading ? 'ENVOI...' : 'CONFIRMER'}
            </button>
          </form>

          <div 
            onClick={handleResend}
            style={{ 
              marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              gap: '8px', color: '#0056D2', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            <RefreshCw size={16} className={loading ? "spin-animation" : ""} /> Renvoyer le code
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;