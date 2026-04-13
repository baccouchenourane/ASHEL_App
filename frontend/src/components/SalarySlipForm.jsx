import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, CreditCard, ChevronRight,
  ClipboardList, Loader2, Signal, Wifi, Battery, Cpu, Wallet
} from 'lucide-react';
import jsPDF from 'jspdf';
import { documentAPI } from '../services/api';

const SalarySlipForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [reference, setReference] = useState('');
  const [apiError, setApiError] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const getCardType = (num) => {
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'mastercard';
    return 'default';
  };

  const handlePayment = async () => {
    if (cardHolder.trim() === '') {
      alert('Veuillez saisir le nom de l\'agent.');
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      const demande = await documentAPI.creerDemande({
        nomTitulaire: cardHolder,
        typeDocument: 'FICHE_PAIE_CNRPS',
        modePaiement: paymentType === 'bank' ? 'CARTE_BANCAIRE' : 'EDINAR',
        dernierChiffres: '',
      });
      setReference(demande.reference);
      setStep(4);
    } catch (err) {
      setApiError(err.message || 'Erreur lors de la confirmation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('BULLETIN DE PAIE - CNRPS', 105, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Reference : ${reference}`, 20, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(`Agent : ${cardHolder.toUpperCase()}`, 20, 52);
    doc.text('Periode : Mars 2026', 20, 62);
    doc.line(20, 67, 190, 67);
    doc.text('Salaire Brut : 2450.000 DT', 20, 80);
    doc.text('Retenues CNRPS : 306.250 DT', 20, 90);
    doc.text('Retenues IRPP : 143.750 DT', 20, 100);
    doc.line(20, 108, 190, 108);
    doc.setFont('helvetica', 'bold');
    doc.text('NET A PAYER : 2000.000 DT', 20, 120);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Document genere electroniquement via CNRPS SmartGov.', 105, 280, { align: 'center' });
    setTimeout(() => {
      doc.save(`Fiche_de_Paie_CNRPS_${cardHolder.replace(/\s+/g, '_')}.pdf`);
      setDownloading(false);
    }, 1000);
  };

  return (
    <div style={viewport}>
      <div style={phoneFrame}>
        <div style={statusBar}>
          <span style={{ fontWeight: '700', fontSize: '13px' }}>09:41</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Signal size={14} /> <Wifi size={14} /> <Battery size={16} />
          </div>
        </div>

        <div style={appHeader}>
          <button onClick={step === 1 ? onBack : () => { setStep(step - 1); setApiError(''); }} style={backCircle}>
            <ArrowLeft size={20} color="#1e293b" />
          </button>
          <div style={{ textAlign: 'center' }}>
            <h3 style={navTitle}>{step === 4 ? 'Généré' : 'Fiche de Paie'}</h3>
            <div style={{ fontSize: '9px', color: '#4338CA', fontWeight: '800' }}>ESPACE SALARIÉ CNRPS</div>
          </div>
          <div style={{ width: 40 }}></div>
        </div>

        <div style={scrollContent}>

          {apiError && (
            <div style={errorBanner}>
              <span>⚠️ {apiError}</span>
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <div style={{ ...serviceCard, background: '#EEF2FF', border: '1px solid #E0E7FF' }}>
                <div style={iconBox}><ClipboardList size={24} color="#4338CA" /></div>
                <div>
                  <h4 style={serviceName}>Fiche de Paie Numérique</h4>
                  <p style={servicePrice}>Frais : <span style={{ color: '#4338CA' }}>0.500 DT</span></p>
                </div>
              </div>

              <p style={labelSmall}>MODE DE RÈGLEMENT</p>

              <div onClick={() => { setPaymentType('bank'); setStep(3); }} style={methodBtn}>
                <div style={methodIcon}><CreditCard color="#4338CA" /></div>
                <div style={{ flex: 1 }}><p style={mTitle}>Carte Bancaire</p><p style={mSub}>Visa, Mastercard</p></div>
                <ChevronRight size={18} color="#cbd5e1" />
              </div>

              <div onClick={() => { setPaymentType('prelevement'); setStep(3); }} style={{ ...methodBtn, marginTop: '12px' }}>
                <div style={{ ...methodIcon, background: '#EEF2FF' }}><Wallet color="#4338CA" /></div>
                <div style={{ flex: 1 }}><p style={mTitle}>Prélèvement sur salaire</p><p style={mSub}>Automatique CNRPS</p></div>
                <ChevronRight size={18} color="#cbd5e1" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="slide-up">
              <div style={{ ...cardPreview, background: 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Cpu size={35} color="rgba(255,255,255,0.8)" strokeWidth={1} />
                </div>
                <div style={cardNumDisplay}>
                  {paymentType === 'bank' ? (cardNumber || '•••• •••• •••• ••••') : 'CNRPS — PRÉLÈVEMENT AUTO'}
                </div>
                <p style={cardVal}>{cardHolder.toUpperCase() || 'MATRICULE CNRPS'}</p>
              </div>

              <div style={formBox}>
                {paymentType === 'bank' && (
                  <>
                    <div style={inputGroup}>
                      <label style={fLabel}>NUMÉRO DE CARTE</label>
                      <input type="text" placeholder="0000 0000 0000 0000" style={fInput}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        maxLength={19}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={fLabel}>EXPIRATION</label>
                        <input type="text" placeholder="MM/AA" style={fInput} maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={fLabel}>CVV</label>
                        <input type="password" placeholder="***" style={fInput} maxLength={3} value={cvv} onChange={(e) => setCvv(e.target.value)} />
                      </div>
                    </div>
                  </>
                )}
                <div style={inputGroup}>
                  <label style={fLabel}>NOM DE L'AGENT</label>
                  <input type="text" placeholder="Nom complet de l'agent" style={fInput} value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} />
                </div>
                <button onClick={handlePayment} disabled={loading} style={{ ...payBtn, background: '#4338CA' }}>
                  {loading ? <Loader2 className="spin" size={20} /> : 'CONFIRMER 0.500 DT'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center' }} className="scale-in">
              <div style={printerSlot}></div>
              <div style={receipt}>
                <div style={receiptTop}>
                  <CheckCircle2 size={40} color="#4338CA" />
                  <h4 style={{ margin: '10px 0', fontWeight: '900' }}>BULLETIN GÉNÉRÉ</h4>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>ID: {reference}</p>
                </div>
                <div style={receiptLine}><span>Service</span> <b>Fiche de Paie CNRPS</b></div>
                <div style={receiptLine}><span>Agent</span> <b>{cardHolder.toUpperCase()}</b></div>
                <div style={receiptLine}><span>Période</span> <b>Mars 2026</b></div>
                <div style={barcode}></div>
              </div>
              <button onClick={handleDownload} disabled={downloading} style={{ ...payBtn, background: '#4338CA' }}>
                {downloading ? <Loader2 className="spin" size={20} /> : 'OUVRIR LE PDF'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease; }
        .slide-up { animation: slideUp 0.4s ease-out; }
        .scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const viewport = { backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const phoneFrame = { width: '375px', height: '780px', backgroundColor: '#ffffff', borderRadius: '50px', border: '12px solid #1e293b', position: 'relative', overflow: 'hidden', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' };
const statusBar = { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 35px', color: '#1e293b' };
const appHeader = { padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const backCircle = { width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const navTitle = { margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#1e293b' };
const scrollContent = { flex: 1, padding: '20px', overflowY: 'auto' };
const errorBanner = { background: '#fef2f2', color: '#dc2626', padding: '12px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '16px', border: '1px solid #fecaca' };
const serviceCard = { borderRadius: '24px', padding: '20px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' };
const iconBox = { width: '50px', height: '50px', background: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const serviceName = { margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1e293b' };
const servicePrice = { margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '600' };
const labelSmall = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '15px' };
const methodBtn = { background: 'white', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1.5px solid #f1f5f9', cursor: 'pointer' };
const methodIcon = { width: '45px', height: '45px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const mTitle = { margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' };
const mSub = { margin: 0, fontSize: '0.75rem', color: '#94a3b8' };
const cardPreview = { width: '100%', height: '180px', borderRadius: '20px', padding: '25px', color: 'white', marginBottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const cardNumDisplay = { fontSize: '1.2rem', fontWeight: '600', letterSpacing: '2px', fontFamily: 'monospace' };
const cardVal = { fontSize: '11px', fontWeight: '700' };
const formBox = { padding: '0 5px' };
const inputGroup = { marginBottom: '18px' };
const fLabel = { display: 'block', fontSize: '10px', fontWeight: '900', color: '#94a3b8', marginBottom: '8px' };
const fInput = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #f1f5f9', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '700', outline: 'none', boxSizing: 'border-box' };
const payBtn = { width: '100%', padding: '18px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: '900', cursor: 'pointer', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const printerSlot = { width: '80%', height: '6px', background: '#4338CA', margin: '0 auto', borderRadius: '10px' };
const receipt = { background: 'white', width: '90%', margin: '-3px auto 30px', padding: '30px 20px', boxShadow: '0 15px 40px rgba(0,0,0,0.05)', borderRadius: '0 0 15px 15px', border: '1px solid #f1f5f9' };
const receiptTop = { borderBottom: '1px dashed #e2e8f0', paddingBottom: '20px', marginBottom: '20px' };
const receiptLine = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#475569' };
const barcode = { height: '40px', background: 'repeating-linear-gradient(90deg, #4338CA, #4338CA 2px, transparent 2px, transparent 6px)', marginTop: '20px', opacity: 0.3 };

export default SalarySlipForm;