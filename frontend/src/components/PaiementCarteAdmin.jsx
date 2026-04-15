import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck, Lock } from 'lucide-react';

const PaiementCarteAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { montant, docName } = location.state || { montant: "0.000", docName: "Document" };
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div style={styles.screenWrapper}>
        <div className="app-container" style={{justifyContent:'center', alignItems:'center', display:'flex', textAlign:'center'}}>
          <div style={{padding:'20px'}}>
            <div style={styles.successIcon}><CheckCircle size={50} color="white"/></div>
            <h2 style={{fontWeight:900, marginTop:20}}>Paiement Réussi</h2>
            <p style={{color:'#64748b'}}>Votre document {docName} est en cours de préparation.</p>
            <button onClick={() => navigate('/e-admin')} style={styles.btnPay}>RETOUR</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.screenWrapper}>
      <div className="app-container">
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={20}/></button>
          <span style={styles.headerTitle}>Paiement Sécurisé</span>
          <div style={{width:40}} />
        </header>

        <div style={{padding: '20px'}}>
          <div style={styles.amountBanner}>
            <p style={{margin:0, opacity:0.7, fontSize:'12px'}}>TOTAL A RÉGLER</p>
            <h1 style={{margin:0}}>{montant} DT</h1>
          </div>

          <form onSubmit={handlePay} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>NUMÉRO DE CARTE</label>
              <input style={styles.input} placeholder="1234 5678 9101 1121" maxLength="16" required />
            </div>
            <div style={{display:'flex', gap:10}}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>EXPIRATION</label>
                <input style={styles.input} placeholder="MM/YY" required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>CVV</label>
                <input style={styles.input} type="password" placeholder="***" maxLength="3" required />
              </div>
            </div>
            <button type="submit" disabled={loading} style={styles.btnPay}>
              {loading ? "TRAITEMENT..." : `PAYER MAINTENANT`}
            </button>
          </form>

          <div style={styles.secureBadge}>
            <Lock size={12}/> Transaction cryptée par SMT
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#E2E8F0' },
  header: { padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { background: 'white', border: 'none', padding: '10px', borderRadius: '12px' },
  headerTitle: { fontWeight: '800' },
  amountBanner: { background: '#1e293b', color: 'white', padding: '25px', borderRadius: '20px', textAlign: 'center', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  label: { fontSize: '11px', fontWeight: '800', color: '#94a3b8' },
  input: { padding: '15px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' },
  btnPay: { background: '#1e293b', color: 'white', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: '800', marginTop: '10px', cursor: 'pointer' },
  successIcon: { background: '#10B981', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' },
  secureBadge: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, fontSize: '11px', color: '#94a3b8', marginTop: 20 }
};

export default PaiementCarteAdmin;