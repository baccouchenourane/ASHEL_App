import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, ShieldCheck, Lock, CreditCard,
  CheckCircle2, Landmark, Smartphone, 
  Building2, Check, QrCode, ShieldAlert,
  Fingerprint, Receipt, Barcode, Calendar
} from 'lucide-react';
// IMPORT DU CONTEXTE
import { useVault } from './VaultContext'; 

const PaiementAdministrationAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addDoc } = useVault(); // Initialisation de addDoc
  
  const { docName, montant } = location.state || { docName: "Service Administratif", montant: "2.150" };

  const [methode, setMethode] = useState('carte');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePay = (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    
    // Simulation du paiement
    setTimeout(() => {
      const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // AJOUT DU DOCUMENT DANS LE COFFRE-FORT ICI
      addDoc({ 
        id: transactionId, 
        typeDocument: docName, 
        statut: 'PAIEMENT_RECU', 
        reference: transactionId, 
        dateMAJ: new Date() 
      });

      setLoading(false);
      setSuccess(true);
    }, 2500);
  };

  if (success) return <SuccessView navigate={navigate} label={docName} montant={montant} />;

  return (
    <div style={wrapper}>
      <div className="app-container" style={s.mainContainer}>
        <div className="moucharabieh-overlay" />

        <div style={s.securityBanner}>
           <Lock size={12} /> SESSION SÉCURISÉE — EXPIRATION DANS {formatTime(timeLeft)}
        </div>

        <div className="page-content" style={{ padding: '24px' }}>
          
          <div style={s.ticketContainer} className="fade-in">
            <div style={s.ticketTop}>
               <Receipt size={14} /> 
               <span>RECU FISCAL NUMÉRIQUE GOUV.TN</span>
            </div>
            <div style={s.ticketBody}>
               <p style={s.ticketDoc}>{docName.toUpperCase()}</p>
               <h1 style={s.ticketAmount}>{parseFloat(montant).toFixed(3)} <small>TND</small></h1>
               <div style={s.dotLine} />
               <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem', color:'#94a3b8', fontWeight:'700'}}>
                  <span>FRAIS DE SERVICE</span>
                  <span>0.000 DT</span>
               </div>
            </div>
            <div style={s.ticketCutter} />
          </div>

          <h4 style={s.sectionLabel}>CHOISIR LE MODE DE RÈGLEMENT</h4>
          <div style={s.tabsTabs}>
            {[
              { id: 'carte', icon: CreditCard, label: 'CARTE' },
              { id: 'edinar', icon: Smartphone, label: 'E-DINAR' },
              { id: 'virement', icon: Building2, label: 'VIREMENT' }
            ].map((m) => (
              <div key={m.id} onClick={() => setMethode(m.id)} 
                style={{
                  ...s.tabItem,
                  background: methode === m.id ? 'white' : 'transparent',
                  color: methode === m.id ? '#0056D2' : '#94a3b8',
                  boxShadow: methode === m.id ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                }}>
                <m.icon size={18} />
                <span style={{fontSize:'0.65rem', fontWeight:'900', marginTop:'4px'}}>{m.label}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handlePay} style={s.form} className="fade-in">
            <div style={s.inputGroup}>
              <label style={s.label}>
                {methode === 'carte' ? 'NUMÉRO DE CARTE BANCAIRE' : 'IDENTIFIANT PORTEFEUILLE D17'}
              </label>
              <div style={{position:'relative'}}>
                 <input type="text" placeholder="Saisir les informations..." style={s.mainInput} required />
                 {methode === 'carte' && <CreditCard size={16} style={s.inputIcon} />}
              </div>
            </div>
            
            {methode === 'carte' && (
              <div style={{display:'flex', gap:'12px', marginTop:'12px'}}>
                <div style={{flex:1}}>
                  <label style={s.label}>EXPIRATION</label>
                  <input type="text" placeholder="MM/YY" maxLength="5" style={s.mainInput} required />
                </div>
                <div style={{flex:1}}>
                  <label style={s.label}>CVV</label>
                  <input type="password" placeholder="***" maxLength="3" style={s.mainInput} required />
                </div>
              </div>
            )}

            {methode === 'edinar' && (
               <div style={s.infoBox}>
                  <ShieldAlert size={14} />
                  <span>Un code de confirmation sera envoyé sur votre mobile.</span>
               </div>
            )}

            <button type="submit" style={s.confirmBtn} disabled={loading}>
              {loading ? <div className="spinner" /> : <><Lock size={16}/> PAYER {parseFloat(montant).toFixed(3)} DT</>}
            </button>
          </form>

          <div style={s.footerSecurity}>
             <Fingerprint size={14} /> 
             <span>AUTHENTIFICATION BIOMÉTRIQUE SÉCURISÉE</span>
          </div>
        </div>
      </div>

      <style>{`
        .app-container { width: 390px; height: 844px; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.3); border-radius: 50px; background: white; }
        .moucharabieh-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url("https://www.transparenttextures.com/patterns/arabesque.png"); opacity: 0.04; pointer-events: none; }
        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const SuccessView = ({ navigate, label, montant }) => (
  <div style={wrapper}>
    <div className="app-container" style={{ background: '#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', padding:'30px' }}>
      <div style={{width:'100%', textAlign:'center'}} className="fade-in">
        <div style={s.successCircle}><Check size={40} color="white" strokeWidth={4} /></div>
        <h2 style={{fontWeight:'900', color:'#1e293b', marginBottom:'5px'}}>Paiement Réussi</h2>
        <p style={{color:'#64748b', fontSize:'0.85rem'}}>Votre demande de <b>{label}</b> est confirmée.</p>
        
        <div style={s.miniReceipt}>
           <div style={s.receiptRow}><span>Montant réglé</span><b>{parseFloat(montant).toFixed(3)} DT</b></div>
           <div style={s.receiptRow}><span>Date</span><b>{new Date().toLocaleDateString('fr-FR')}</b></div>
           <div style={s.dotLine} />
           <Barcode size={120} style={{margin:'10px auto 0', opacity:0.7}} />
        </div>

        <button onClick={() => navigate('/e-admin')} style={s.finalBtn}>RETOUR À L'ADMINISTRATION</button>
      </div>
    </div>
  </div>
);

const wrapper = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#cbd5e1' };

const s = {
  mainContainer: { background: '#ffffff' },
  securityBanner: { background: '#1e293b', color: '#94a3b8', fontSize: '0.55rem', textAlign: 'center', padding: '10px', fontWeight: '800', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', letterSpacing:'0.5px' },
  ticketContainer: { background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', marginBottom: '25px', boxShadow:'0 4px 15px rgba(0,0,0,0.02)' },
  ticketTop: { padding: '12px', background: '#f1f5f9', textAlign: 'center', fontSize: '0.6rem', color: '#64748b', fontWeight: '900', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' },
  ticketBody: { padding: '24px', textAlign: 'center' },
  ticketDoc: { fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800', margin: '0 0 5px 0' },
  ticketAmount: { fontSize: '2.6rem', fontWeight: '950', color: '#1e293b', margin: 0 },
  dotLine: { height: '1px', borderTop: '2px dotted #e2e8f0', margin: '15px 0' },
  ticketCutter: { position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '20px', backgroundImage: 'radial-gradient(circle, #ffffff 10px, transparent 11px)', backgroundSize: '30px 30px', backgroundPosition: 'center' },
  sectionLabel: { fontSize: '0.65rem', fontWeight: '900', color: '#1e293b', marginBottom: '12px', textAlign: 'center', letterSpacing:'0.5px' },
  tabsTabs: { display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '18px', gap: '6px', marginBottom: '25px' },
  tabItem: { flex: 1, padding: '12px', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: '0.2s' },
  form: { display: 'flex', flexDirection: 'column' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.6rem', fontWeight: '900', color: '#94a3b8', marginBottom: '8px', letterSpacing:'0.5px' },
  mainInput: { width: '100%', padding: '16px', borderRadius: '16px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '700', background: '#f8fafc', boxSizing:'border-box', outline:'none' },
  inputIcon: { position:'absolute', right:'15px', top:'50%', transform:'translateY(-50%)', color:'#cbd5e1' },
  infoBox: { padding: '12px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', fontWeight: '700' },
  confirmBtn: { width: '100%', padding: '18px', borderRadius: '18px', background: '#1e293b', color: 'white', fontWeight: '900', border: 'none', cursor: 'pointer', marginTop: '25px', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
  footerSecurity: { textAlign:'center', fontSize:'0.55rem', color:'#cbd5e1', marginTop:'25px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontWeight:'800' },
  successCircle: { width: '80px', height: '80px', background: '#059669', borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow: '0 10px 20px rgba(5,150,105,0.3)' },
  miniReceipt: { background:'white', padding:'20px', borderRadius:'20px', border:'1px solid #e2e8f0', marginTop:'20px' },
  receiptRow: { display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#64748b', marginBottom:'8px' },
  finalBtn: { width:'100%', padding:'18px', background:'#1e293b', color:'white', borderRadius:'18px', border:'none', fontWeight:'900', marginTop:'30px', cursor:'pointer' }
};

export default PaiementAdministrationAction;