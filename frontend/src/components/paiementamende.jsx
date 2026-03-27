import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Lock, CreditCard, 
  CheckCircle2 
} from 'lucide-react';

const PaiementAmende = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  // AJOUT : On utilise une vraie soumission de formulaire
  const handlePay = (e) => {
    e.preventDefault(); // Empêche le clic si les champs 'required' ne sont pas mis
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // On marque l'amende comme payée dans le système
      localStorage.setItem('amende_payee', 'true');
    }, 2500);
  };

  if (success) {
    return <SuccessView navigate={navigate} />;
  }

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>
      <div className="page-content">
        <div style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          
          <div style={{ padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
            <ArrowLeft onClick={() => navigate('/e-amende')} style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#059669" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e293b' }}>PAIEMENT SÉCURISÉ</span>
            </div>
            <div style={{ width: '24px' }}></div>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '5px' }}>Montant total à régler</p>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>
                60.000 <span style={{ fontSize: '1rem' }}>DT</span>
              </h1>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '20px', padding: '25px', color: 'white', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ width: '45px', height: '35px', background: '#fbbf24', borderRadius: '5px', opacity: 0.8 }}></div>
                <CreditCard size={30} opacity={0.5} />
              </div>
              <p style={{ fontSize: '1.2rem', letterSpacing: '4px', marginBottom: '20px' }}>
                {cardNumber ? cardNumber.padEnd(16, '•').replace(/(.{4})/g, '$1 ') : '•••• •••• •••• ••••'}
              </p>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.7rem', opacity: 0.7 }}>
                <div>EXP: 09/28</div>
                <div>CVV: •••</div>
              </div>
            </div>

            {/* MODIFICATION : Ajout de la balise <form> et des attributs 'required' */}
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label style={labelStyle}>Numéro de carte</label>
                <input 
                  type="text" 
                  maxLength="16"
                  minLength="16"
                  placeholder="4000 1234 5678 9012" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  style={inputStyle} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Expiration</label>
                  <input type="text" placeholder="MM/YY" style={inputStyle} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Code CVV</label>
                  <input type="password" placeholder="123" maxLength="3" style={inputStyle} required />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={confirmButtonStyle}
              >
                {loading ? <div className="spinner"></div> : <><Lock size={18} /> CONFIRMER LE PAIEMENT</>}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', opacity: 0.4 }}>
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width="40" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" width="30" />
               <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>MONÉTIQUE TUNISIE</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const SuccessView = ({ navigate }) => (
  <div className="app-container">
    <div className="moucharabieh-overlay"></div>
    <div className="page-content" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px", textAlign: "center", backgroundColor: "white" }}>
      <div style={{ width: "100px", height: "100px", background: "#ecfdf5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "30px" }}>
        <CheckCircle2 size={50} color="#059669" />
      </div>
      <h1 style={{ fontWeight: "900", color: "#1e293b" }}>Paiement Terminé !</h1>
      <p style={{ color: "#64748b", marginBottom: "40px" }}>Votre transaction a été approuvée.</p>
      <button onClick={() => navigate("/home")} className="btn-ashal-primary" style={{ maxWidth: "300px" }}>RETOUR À L'ACCUEIL</button>
    </div>
  </div>
);

const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', background: 'white', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block', marginLeft: '5px' };
const confirmButtonStyle = { marginTop: '20px', backgroundColor: '#0056D2', color: 'white', border: 'none', borderRadius: '15px', padding: '18px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(0, 86, 210, 0.3)' };

export default PaiementAmende;