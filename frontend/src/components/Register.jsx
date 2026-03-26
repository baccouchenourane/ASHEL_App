import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Phone, ArrowRight, ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import '../App.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [nom, setNom] = useState('');
  const [cin, setCin] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('user_ashel', JSON.stringify({ nom, cin, phone, password }));
    alert("Compte créé avec succès ! Connectez-vous maintenant.");
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>
      
      <div style={{ padding: '40px 25px', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
        
        {/* BOUTON RETOUR */}
        <div 
          style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          <div style={{ padding: '8px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <ArrowLeft size={20} color="#1A1D23" />
          </div>
          <span style={{ marginLeft: '12px', fontSize: '0.9rem', fontWeight: '600', color: '#64748B' }}>
            Retour à la connexion
          </span>
        </div>

        {/* TITRE ET BARRE DE PROGRESSION (LE ZIP) */}
        <div className="fade-in" style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1A1D23', marginBottom: '15px' }}>
            Créer un compte
          </h1>

          {/* LA BARRE DE PROGRESSION RELIANT LES ÉTAPES */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
             <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0056D2', minWidth: '80px' }}>
                Étape {step} sur 2
             </span>
             {/* LE ZIP / BARRE DE PROGRESSION */}
             <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ 
                    width: step === 1 ? '50%' : '100%', 
                    height: '100%', 
                    background: '#E70011', 
                    borderRadius: '10px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}></div>
             </div>
          </div>
        </div>

        <form onSubmit={handleRegister}>
          {step === 1 ? (
            /* ÉTAPE 1 */
            <div className="fade-in">
              <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                État civil officiel :
              </p>
              
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Identité complète (Français | Arabe)" 
                  className="ashal-input" 
                  value={nom} 
                  onChange={(e) => setNom(e.target.value)} 
                  required 
                />
                <User size={18} className="input-icon" />
              </div>
              
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Carte d'Identité Nationale (8 chiffres)" 
                  className="ashal-input" 
                  value={cin} 
                  onChange={(e) => setCin(e.target.value.replace(/\D/g, '').slice(0, 8))} 
                  required 
                />
                <ShieldCheck size={18} className="input-icon" />
              </div>

              <div className="input-group">
                <div style={{ position: 'absolute', left: '45px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', fontSize: '0.95rem' }}>
                  +216
                </div>
                <input 
                  type="text" 
                  placeholder="Ligne mobile associée" 
                  className="ashal-input" 
                  style={{ paddingLeft: '90px' }} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))} 
                  required 
                />
                <Phone size={18} className="input-icon" />
              </div>

              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="btn-ashal-primary" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}
              >
                Continuer <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            /* ÉTAPE 2 */
            <div className="fade-in">
              <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                Paramètres de sécurité :
              </p>
              <div className="input-group">
                <input type="email" placeholder="Adresse e-mail" className="ashal-input" required />
                <Mail size={18} className="input-icon" />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Mot de passe sécurisé" 
                  className="ashal-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <Lock size={18} className="input-icon" />
              </div>

              {/* CONSENTEMENT ANCE */}
              <div style={{ display: 'flex', gap: '10px', background: '#F1F5F9', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                <CheckCircle size={24} color="#0056D2" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: '1.4' }}>
                  En cliquant sur <strong>"S'inscrire"</strong>, vous acceptez que vos données soient vérifiées auprès du registre national de l'<strong>ANCE</strong>.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="btn-ashal-primary" 
                    style={{ flex: 1, background: '#E2E8F0', color: '#1A1D23' }}
                >
                    Retour
                </button>
                <button type="submit" className="btn-ashal-primary" style={{ flex: 2 }}>
                    S'INSCRIRE
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;