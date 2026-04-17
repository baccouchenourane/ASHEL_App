import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Lock, CreditCard, 
  CheckCircle2, Landmark, Smartphone, 
  Building2, Check, QrCode, ShieldAlert,
  Fingerprint, Receipt, Barcode, Calendar,
  ChevronRight, Mail
} from 'lucide-react';
import { useVault } from './VaultContext'; 

const PaiementAdministrationAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addDoc } = useVault(); 
  
  const { docName, montant } = location.state || { docName: "Extrait de Naissance", montant: "2.150" };

  const [methode, setMethode] = useState('carte');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      addDoc({ 
        id: transactionId, 
        typeDocument: docName, 
        statut: 'PRÊT', 
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
        {/* Header Style GovChain */}
        <div style={s.header}>
          <button onClick={() => navigate(-1)} style={s.backBtn}><ArrowLeft size={20} /></button>
          <div style={s.headerTitle}>
             <ShieldCheck size={18} color="#10B981" />
             <span style={{fontWeight:'800', fontSize:'0.9rem', letterSpacing:'0.5px'}}>PAIEMENT SÉCURISÉ</span>
          </div>
          <div style={{width: 40}} />
        </div>

        <div style={s.scrollArea}>
          {/* Résumé de la facture (Basé sur Capture 010108) */}
          <div style={s.amountCard}>
             <span style={s.serviceTag}>{docName}</span>
             <h1 style={s.bigAmount}>{parseFloat(montant).toFixed(3)} <small style={{fontSize:'1rem'}}>DT</small></h1>
          </div>

          <h3 style={s.sectionTitle}>CHOISIR UN MOYEN DE PAIEMENT</h3>

          <div style={s.optionsList}>
            {/* OPTION 1: CARTE */}
            <div onClick={() => setMethode('carte')} style={{...s.optionCard, borderColor: methode === 'carte' ? '#0056D2' : '#E2E8F0'}}>
                <div style={{...s.iconBox, background: '#EFF6FF'}}><CreditCard size={22} color="#0056D2" /></div>
                <div style={s.optionInfo}>
                    <span style={s.optionTitle}>Carte bancaire</span>
                    <span style={s.optionSub}>Visa / Mastercard / CIB</span>
                </div>
                <div style={{...s.radio, borderColor: methode === 'carte' ? '#0056D2' : '#CBD5E1'}}>
                    {methode === 'carte' && <div style={s.radioInner} />}
                </div>
            </div>

            {/* OPTION 2: E-DINAR (Basé sur Capture 010139) */}
            <div onClick={() => setMethode('edinar')} style={{...s.optionCard, borderColor: methode === 'edinar' ? '#7C3AED' : '#E2E8F0'}}>
                <div style={{...s.iconBox, background: '#F5F3FF'}}><Smartphone size={22} color="#7C3AED" /></div>
                <div style={s.optionInfo}>
                    <span style={s.optionTitle}>E-Dinar</span>
                    <span style={s.optionSub}>Porte-monnaie électronique</span>
                </div>
                <div style={{...s.radio, borderColor: methode === 'edinar' ? '#7C3AED' : '#CBD5E1'}}>
                    {methode === 'edinar' && <div style={{...s.radioInner, background:'#7C3AED'}} />}
                </div>
            </div>

            {/* OPTION 3: VIREMENT (Basé sur Capture 010136) */}
            <div onClick={() => setMethode('virement')} style={{...s.optionCard, borderColor: methode === 'virement' ? '#10B981' : '#E2E8F0'}}>
                <div style={{...s.iconBox, background: '#ECFDF5'}}><Landmark size={22} color="#10B981" /></div>
                <div style={s.optionInfo}>
                    <span style={s.optionTitle}>Virement bancaire</span>
                    <span style={s.optionSub}>STB / BNA / Attijari / BIAT</span>
                </div>
                <div style={{...s.radio, borderColor: methode === 'virement' ? '#10B981' : '#CBD5E1'}}>
                    {methode === 'virement' && <div style={{...s.radioInner, background:'#10B981'}} />}
                </div>
            </div>
          </div>

          {/* Formulaires dynamiques selon la méthode */}
          <div style={s.dynamicForm}>
             {methode === 'carte' && (
               <div className="fade-in">
                  <div style={s.cardPreview}>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <div style={s.cardChip} />
                        <CreditCard color="white" opacity={0.5} />
                      </div>
                      <div style={s.cardNumberDisp}>**** **** **** ****</div>
                      <div style={{display:'flex', gap:'20px'}}>
                        <div style={s.cardSmallLabel}>EXP: MM/YY</div>
                        <div style={s.cardSmallLabel}>CVV: ***</div>
                      </div>
                  </div>
                  <input type="text" placeholder="Numéro de carte" style={s.govInput} />
                  <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                    <input type="text" placeholder="MM/YY" style={s.govInput} />
                    <input type="password" placeholder="CVV" style={s.govInput} />
                  </div>
               </div>
             )}

             {methode === 'edinar' && (
                <div className="fade-in">
                   <div style={s.infoAlert}>Un code OTP sera envoyé sur votre numéro pour confirmer.</div>
                   <input type="text" placeholder="Numéro de téléphone (2X XXX XXX)" style={s.govInput} />
                   <input type="password" placeholder="Code PIN E-Dinar" style={{...s.govInput, marginTop:'10px'}} />
                </div>
             )}

             {methode === 'virement' && (
                <div className="fade-in" style={s.ribBox}>
                   <span style={s.ribLabel}>RIB DESTINATAIRE (Société de Recouvrement)</span>
                   <div style={s.ribValue}>17 001 0000 1234567890 28</div>
                   <p style={s.ribHint}>Effectuez le virement puis entrez votre RIB source pour confirmation.</p>
                   <input type="text" placeholder="Votre RIB source" style={s.govInput} />
                </div>
             )}
          </div>

          <button onClick={handlePay} style={{...s.confirmBtn, background: loading ? '#94a3b8' : '#1e293b'}} disabled={loading}>
             {loading ? "TRAITEMENT SÉCURISÉ..." : `CONFIRMER LE PAIEMENT`}
          </button>
          
          <div style={s.footerNote}>
            <Lock size={12} /> Transaction cryptée par Monétique Tunisie
          </div>
        </div>
      </div>

      <style>{`
        .app-container { width: 390px; height: 844px; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.3); border-radius: 50px; background: #F8FAFC; }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const SuccessView = ({ navigate, label, montant }) => (
    <div style={wrapper}>
      <div className="app-container" style={{ background: 'white', display:'flex', alignItems:'center', justifyContent:'center', padding:'30px' }}>
        <div style={{width:'100%', textAlign:'center'}} className="fade-in">
          <div style={s.successIcon}><Check size={40} color="white" strokeWidth={3} /></div>
          <h2 style={{fontWeight:'900', color:'#1e293b', fontSize:'1.4rem'}}>Paiement Terminé !</h2>
          <p style={{color:'#64748b', fontSize:'0.9rem', marginTop:'10px'}}>Le document <b>{label}</b> a été réglé avec succès et ajouté à votre coffre-fort.</p>
          
          <div style={s.receiptFinal}>
             <div style={s.rRow}><span>Montant</span><b>{parseFloat(montant).toFixed(3)} DT</b></div>
             <div style={s.rRow}><span>Statut</span><b style={{color:'#10B981'}}>APPROUVÉ</b></div>
             <div style={{height:'1px', background:'#E2E8F0', margin:'15px 0', borderStyle:'dashed'}} />
             <Barcode size={100} style={{opacity:0.6}} />
          </div>
  
          <button onClick={() => navigate('/e-vault')} style={s.confirmBtn}>VOIR DANS MON COFFRE-FORT</button>
        </div>
      </div>
    </div>
  );

const wrapper = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#cbd5e1' };

const s = {
  mainContainer: { background: '#F8FAFC' },
  header: { padding: '50px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #F1F5F9' },
  backBtn: { width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  headerTitle: { display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '20px' },
  amountCard: { textAlign: 'center', padding: '30px 20px', background: 'white', borderRadius: '24px', marginBottom: '25px', border: '1px solid #E2E8F0' },
  serviceTag: { fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' },
  bigAmount: { fontSize: '3rem', fontWeight: '950', color: '#1E293B', margin: '10px 0 0 0' },
  sectionTitle: { fontSize: '0.7rem', fontWeight: '900', color: '#94A3B8', marginBottom: '15px', letterSpacing: '0.5px' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionCard: { background: 'white', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', border: '2px solid transparent', transition: '0.2s' },
  iconBox: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  optionInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  optionTitle: { fontWeight: '800', color: '#1E293B', fontSize: '0.95rem' },
  optionSub: { fontSize: '0.7rem', color: '#64748B', fontWeight: '500' },
  radio: { width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: '12px', height: '12px', borderRadius: '50%', background: '#0056D2' },
  dynamicForm: { marginTop: '25px' },
  govInput: { width: '100%', padding: '16px', borderRadius: '15px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.9rem', fontWeight: '600', outline: 'none', boxSizing: 'border-box' },
  infoAlert: { padding: '12px', borderRadius: '12px', background: '#F5F3FF', color: '#7C3AED', fontSize: '0.75rem', fontWeight: '700', marginBottom: '12px', textAlign: 'center' },
  cardPreview: { background: '#1E293B', padding: '20px', borderRadius: '20px', marginBottom: '15px', color: 'white' },
  cardChip: { width: '35px', height: '25px', background: '#FACC15', borderRadius: '5px', opacity: 0.8 },
  cardNumberDisp: { fontSize: '1.2rem', margin: '20px 0', letterSpacing: '2px', fontWeight: '600' },
  cardSmallLabel: { fontSize: '0.65rem', opacity: 0.7, fontWeight: '700' },
  ribBox: { background: '#ECFDF5', padding: '20px', borderRadius: '20px', border: '1px dashed #10B981', textAlign: 'center' },
  ribLabel: { fontSize: '0.65rem', fontWeight: '800', color: '#047857' },
  ribValue: { fontSize: '1.1rem', fontWeight: '900', color: '#1E293B', margin: '10px 0' },
  ribHint: { fontSize: '0.7rem', color: '#065F46', marginBottom: '15px' },
  confirmBtn: { width: '100%', padding: '20px', borderRadius: '20px', border: 'none', color: 'white', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', marginTop: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
  footerNote: { textAlign: 'center', fontSize: '0.65rem', color: '#94A3B8', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: '700' },
  successIcon: { width: '80px', height: '80px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  receiptFinal: { background: '#F8FAFC', padding: '20px', borderRadius: '20px', margin: '25px 0', border: '1px solid #E2E8F0' },
  rRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px', color: '#64748B' }
};

export default PaiementAdministrationAction;