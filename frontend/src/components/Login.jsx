import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Fingerprint } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>
      
      <div style={{ padding: '50px 30px', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        
        {/* Header avec Emblème */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ 
            display: 'inline-flex', padding: '20px', background: 'white', 
            borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' 
          }}>
            <ShieldCheck size={45} color="var(--ashal-red)" />
          </div>
          <h1 style={{ marginTop: '20px', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px' }}>
            ASHAL <span style={{ color: 'var(--ashal-red)' }}>App</span>
          </h1>
          <p style={{ fontSize: '0.7rem', letterSpacing: '3px', opacity: 0.5, fontWeight: '700' }}>
            RÉPUBLIQUE TUNISIENNE
          </p>
        </div>

        <div className="fade-in">
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px' }}>Bienvenue</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '40px' }}>
             أهلا بك في تطبيق أسهل <br/>
            Identifiez-vous pour accéder à vos documents officiels.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => navigate('/home'), 1500); }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '18px', top: '20px', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Numéro CIN" 
                  style={{ width: '100%', padding: '20px 20px 20px 50px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', outline: 'none' }} 
                  required 
                />
              </div>
            </div>

            <div style={{ marginBottom: '35px' }}>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '18px', top: '20px', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  style={{ width: '100%', padding: '20px 20px 20px 50px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', outline: 'none' }} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-ashal" style={{ width: '100%' }}>
              {loading ? "VÉRIFICATION..." : "S'IDENTIFIER"}
            </button>
          </form>
        </div>

        {/* Biométrie en bas */}
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <Fingerprint size={40} color="var(--ashal-red)" style={{ opacity: 0.3, cursor: 'pointer' }} />
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '10px' }}>Support Biométrique ANCE</p>
        </div>
      </div>
    </div>
  );
};

export default Login;