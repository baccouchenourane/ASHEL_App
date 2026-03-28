import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, CreditCard, ChevronRight, 
  Lock, Wallet, ShieldCheck, Download, Loader2, 
  Signal, Wifi, Battery, Nfc, Cpu, FileText
} from 'lucide-react';
import jsPDF from 'jspdf';

const BulletinB3Form = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  
  // États Carte
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const getCardType = (num) => {
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'mastercard';
    return 'default';
  };

  const handlePayment = () => {
    if (cardNumber.length < 19 || cardHolder.trim() === "" || expiry.length < 5 || cvv.length < 3) {
      alert("Sécurité : Veuillez remplir toutes les informations de la carte.");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('fr-FR');
    const refNum = `B3-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Design du document B3
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277); 
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("REPUBLIQUE TUNISIENNE", 105, 25, { align: "center" });
    doc.setFontSize(10);
    doc.text("MINISTERE DE L'INTERIEUR", 105, 32, { align: "center" });
    doc.text("DIRECTION GENERALE DE LA SÛRETE NATIONALE", 105, 37, { align: "center" });
    
    doc.setLineWidth(0.8);
    doc.line(70, 42, 140, 42);

    doc.setFontSize(18);
    doc.text("BULLETIN N°3 (B3)", 105, 60, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Référence : ${refNum}`, 20, 80);
    doc.text(`Date d'émission : ${dateStr}`, 20, 87);

    // Cadre Infos
    doc.setLineWidth(0.2);
    doc.rect(20, 95, 170, 50);
    doc.setFont("helvetica", "bold");
    doc.text("IDENTIFICATION DU DEMANDEUR", 105, 105, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Nom et Prénom : ${cardHolder.toUpperCase()}`, 30, 120);
    doc.text(`Observation : NEANT (Casier Judiciaire Vierge)`, 30, 130);

    // Signature / QR
    doc.rect(150, 220, 30, 30);
    doc.setFontSize(7);
    doc.text("CACHET ÉLECTRONIQUE", 147, 215);

    setTimeout(() => {
      doc.save(`Bulletin_B3_${cardHolder.replace(/\s+/g, '_')}.pdf`);
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
          <button onClick={step === 1 ? onBack : () => setStep(step - 1)} style={backCircle}>
            <ArrowLeft size={20} color="#1e293b" />
          </button>
          <div style={{textAlign: 'center'}}>
            <h3 style={navTitle}>{step === 4 ? "Terminé" : "Paiement B3"}</h3>
            <div style={secureTag}><ShieldCheck size={10} /> SÉCURITÉ DGSN</div>
          </div>
          <div style={{width: 40}}></div>
        </div>

        <div style={scrollContent}>
          {step === 1 && (
            <div className="fade-in">
              <div style={serviceCard}>
                <div style={iconBox}><FileText size={24} color="#E70011" /></div>
                <div>
                  <h4 style={serviceName}>Bulletin N°3 (B3)</h4>
                  <p style={servicePrice}>Tarif officiel : <span style={{color: '#E70011'}}>2.000 DT</span></p>
                </div>
              </div>

              <p style={labelSmall}>PAIEMENT SÉCURISÉ</p>
              
              <div onClick={() => {setPaymentType('bank'); setStep(3);}} style={methodBtn}>
                <div style={methodIcon}><CreditCard color="#1e293b" /></div>
                <div style={{flex: 1}}><p style={mTitle}>Carte Bancaire</p><p style={mSub}>Visa, Mastercard</p></div>
                <ChevronRight size={18} color="#cbd5e1" />
              </div>

              <div onClick={() => {setPaymentType('edinar'); setStep(3);}} style={{...methodBtn, marginTop: '12px'}}>
                <div style={{...methodIcon, background: '#FEF2F2'}}><Wallet color="#E70011" /></div>
                <div style={{flex: 1}}><p style={mTitle}>E-Dinar Smart</p><p style={mSub}>La Poste Tunisienne</p></div>
                <ChevronRight size={18} color="#cbd5e1" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="slide-up">
              <div style={cardPreview(getCardType(cardNumber))}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Cpu size={35} color="rgba(255,255,255,0.8)" strokeWidth={1} />
                    <Nfc size={24} color="rgba(255,255,255,0.6)" />
                </div>
                <div style={cardNumDisplay}>{cardNumber || "•••• •••• •••• ••••"}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <div>
                        <p style={cardLabel}>TITULAIRE</p>
                        <p style={cardVal}>{cardHolder.toUpperCase() || "NOM PRENOM"}</p>
                    </div>
                    <div>
                        <p style={cardLabel}>EXPIRE</p>
                        <p style={cardVal}>{expiry || "MM/AA"}</p>
                    </div>
                </div>
              </div>

              <div style={formBox}>
                <div style={inputGroup}>
                    <label style={fLabel}>NUMÉRO DE CARTE</label>
                    <input 
                        type="text" placeholder="0000 0000 0000 0000" style={fInput}
                        value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        maxLength={19}
                    />
                </div>
                <div style={inputGroup}>
                    <label style={fLabel}>NOM DU TITULAIRE</label>
                    <input type="text" placeholder="M. FOULEN" style={fInput} value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} />
                </div>
                <div style={{display: 'flex', gap: '15px'}}>
                    <div style={{flex: 1}}><input type="text" placeholder="MM/AA" style={fInput} maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} /></div>
                    <div style={{flex: 1}}><input type="password" placeholder="CVV" style={fInput} maxLength={3} value={cvv} onChange={(e) => setCvv(e.target.value)} /></div>
                </div>

                <button onClick={handlePayment} disabled={loading} style={payBtn}>
                    {loading ? <Loader2 className="spin" /> : `PAYER 2.000 DT`}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{textAlign: 'center'}} className="scale-in">
                <div style={printerSlot}></div>
                <div style={receipt}>
                    <div style={receiptTop}>
                        <CheckCircle2 size={40} color="#10b981" />
                        <h4 style={{margin: '10px 0', fontWeight: '900'}}>B3 PRÊT</h4>
                        <p style={{fontSize: '11px', color: '#64748b'}}>ID: TRANS-B3-2026</p>
                    </div>
                    <div style={receiptLine}><span>Service</span> <b>Bulletin N°3</b></div>
                    <div style={receiptLine}><span>Prix</span> <b>2.000 DT</b></div>
                    <div style={barcode}></div>
                </div>
                <button onClick={handleDownload} disabled={downloading} style={payBtn}>
                  {downloading ? <Loader2 className="spin" size={20} /> : "TÉLÉCHARGER LE B3"}
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

// --- STYLES ---
const viewport = { backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const phoneFrame = { width: '375px', height: '780px', backgroundColor: '#ffffff', borderRadius: '50px', border: '12px solid #1e293b', position: 'relative', overflow: 'hidden', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' };
const statusBar = { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 35px', color: '#1e293b' };
const appHeader = { padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const backCircle = { width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const navTitle = { margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#1e293b' };
const secureTag = { fontSize: '9px', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' };
const scrollContent = { flex: 1, padding: '20px', overflowY: 'auto' };
const serviceCard = { background: '#FFF7F7', borderRadius: '24px', padding: '20px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px', border: '1px solid #FEE2E2' };
const iconBox = { width: '50px', height: '50px', background: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' };
const serviceName = { margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1e293b' };
const servicePrice = { margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '600' };
const labelSmall = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '15px' };
const methodBtn = { background: 'white', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1.5px solid #f1f5f9', cursor: 'pointer' };
const methodIcon = { width: '45px', height: '45px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const mTitle = { margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' };
const mSub = { margin: 0, fontSize: '0.75rem', color: '#94a3b8' };
const cardPreview = (type) => ({
  width: '100%', height: '180px', borderRadius: '20px', padding: '25px', color: 'white',
  background: type === 'visa' ? 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)' :
              'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
  boxShadow: '0 15px 35px rgba(0,0,0,0.2)', marginBottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
});
const cardNumDisplay = { fontSize: '1.4rem', fontWeight: '600', letterSpacing: '2px', fontFamily: 'monospace' };
const cardLabel = { fontSize: '8px', opacity: 0.7 };
const cardVal = { fontSize: '11px', fontWeight: '700' };
const formBox = { padding: '0 5px' };
const inputGroup = { marginBottom: '18px' };
const fLabel = { display: 'block', fontSize: '10px', fontWeight: '900', color: '#94a3b8', marginBottom: '8px' };
const fInput = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #f1f5f9', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '700', outline: 'none' };
const payBtn = { width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: '#1e293b', color: 'white', fontWeight: '900', cursor: 'pointer', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const printerSlot = { width: '80%', height: '6px', background: '#1e293b', margin: '0 auto', borderRadius: '10px' };
const receipt = { background: 'white', width: '90%', margin: '-3px auto 30px', padding: '30px 20px', boxShadow: '0 15px 40px rgba(0,0,0,0.05)', borderRadius: '0 0 15px 15px', border: '1px solid #f1f5f9' };
const receiptTop = { borderBottom: '1px dashed #e2e8f0', paddingBottom: '20px', marginBottom: '20px' };
const receiptLine = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#475569' };
const barcode = { height: '40px', background: 'repeating-linear-gradient(90deg, #1e293b, #1e293b 2px, transparent 2px, transparent 6px)', marginTop: '20px', opacity: 0.3 };

export default BulletinB3Form;