import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, CreditCard, ChevronRight, 
  Lock, Wallet, Landmark, Download, Loader2, 
  Signal, Wifi, Battery, Nfc, Cpu
} from 'lucide-react';
import jsPDF from 'jspdf';

const BirthCertificationForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  
  // États Carte
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Détection du type de carte
  const getCardType = (num) => {
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'mastercard';
    return 'default';
  };

  // --- LOGIQUE DE PAIEMENT ---
  const handlePayment = () => {
    if (cardNumber.length < 19 || cardHolder.trim() === "" || expiry.length < 5 || cvv.length < 3) {
      alert("Sécurité : Veuillez remplir toutes les informations de la carte.");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 2000);
  };

  // --- GÉNÉRATION DU PDF RÉEL ---
  const handleDownload = () => {
    setDownloading(true);
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('fr-FR');
    const refNum = `SMT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Design du document
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277); // Bordure
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("REPUBLIQUE TUNISIENNE", 105, 25, { align: "center" });
    doc.setFontSize(10);
    doc.text("MINISTERE DES AFFAIRES LOCALES", 105, 32, { align: "center" });
    
    doc.setLineWidth(0.8);
    doc.line(80, 36, 130, 36);

    doc.setFontSize(18);
    doc.text("EXTRAIT DE NAISSANCE NUMÉRIQUE", 105, 55, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Référence: ${refNum}`, 20, 75);
    doc.text(`Date d'émission: ${dateStr}`, 20, 82);

    // Cadre Infos
    doc.setLineWidth(0.2);
    doc.rect(20, 90, 170, 50);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS DU TITULAIRE", 105, 100, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Nom et Prénom : ${cardHolder.toUpperCase()}`, 30, 115);
    doc.text(`Nationalité : Tunisienne`, 30, 125);
    doc.text(`Statut : Document Officiel Certifié`, 30, 135);

    // Paiement
    doc.setFontSize(10);
    doc.text(`Montant payé : 0.600 DT`, 20, 160);
    doc.text(`Transaction sécurisée via : ${paymentType === 'bank' ? 'Carte Bancaire' : 'E-Dinar'}`, 20, 167);

    // Signature électronique (QR Simulé)
    doc.rect(150, 220, 30, 30);
    doc.setFontSize(7);
    doc.text("QR CODE DE VÉRIFICATION", 147, 255);
    doc.text("SIGNATURE ÉLECTRONIQUE VALIDE", 145, 215);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Ce document est délivré numériquement et possède la même valeur juridique qu'un document papier.", 105, 282, { align: "center" });

    setTimeout(() => {
      doc.save(`Extrait_Naissance_${cardHolder.replace(/\s+/g, '_')}.pdf`);
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
            <h3 style={navTitle}>{step === 4 ? "Terminé" : "Paiement"}</h3>
            <div style={secureTag}><Lock size={10} /> CONNEXION SÉCURISÉE</div>
          </div>
          <div style={{width: 40}}></div>
        </div>

        <div style={scrollContent}>
          {step === 1 && (
            <div className="fade-in">
              <div style={serviceCard}>
                <div style={iconBox}><Landmark size={24} color="#0056D2" /></div>
                <div>
                  <h4 style={serviceName}>Extrait de Naissance</h4>
                  <p style={servicePrice}>Total à payer : <span style={{color: '#0056D2'}}>0.600 DT</span></p>
                </div>
              </div>

              <p style={labelSmall}>SÉLECTIONNEZ UN MODE DE PAIEMENT</p>
              
              <div onClick={() => {setPaymentType('bank'); setStep(3);}} style={methodBtn}>
                <div style={methodIcon}><CreditCard color="#0056D2" /></div>
                <div style={{flex: 1}}><p style={mTitle}>Carte Bancaire</p><p style={mSub}>Visa, Mastercard, CIB</p></div>
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
                    <img 
                        src={getCardType(cardNumber) === 'visa' ? "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" : "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"} 
                        style={{height: '25px', opacity: getCardType(cardNumber) === 'default' ? 0 : 1}}
                        alt="type"
                    />
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
                    <label style={fLabel}>NOM SUR LA CARTE</label>
                    <input type="text" placeholder="M. FOULEN" style={fInput} value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} />
                </div>
                <div style={{display: 'flex', gap: '15px'}}>
                    <div style={{flex: 1}}>
                        <label style={fLabel}>EXPIRATION</label>
                        <input type="text" placeholder="MM/AA" style={fInput} maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                    </div>
                    <div style={{flex: 1}}>
                        <label style={fLabel}>CVV</label>
                        <input type="password" placeholder="***" style={fInput} maxLength={3} value={cvv} onChange={(e) => setCvv(e.target.value)} />
                    </div>
                </div>

                <button onClick={handlePayment} disabled={loading} style={payBtn}>
                    {loading ? <Loader2 className="spin" /> : `PAYER 0.600 DT`}
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
                        <h4 style={{margin: '10px 0', fontWeight: '900'}}>PAIEMENT RÉUSSI</h4>
                        <p style={{fontSize: '11px', color: '#64748b'}}>ID: SMT-2026-9921</p>
                    </div>
                    <div style={receiptLine}><span>Montant</span> <b>0.600 DT</b></div>
                    <div style={receiptLine}><span>Détail</span> <b>Extrait de Naissance</b></div>
                    <div style={barcode}></div>
                </div>
                <button onClick={handleDownload} disabled={downloading} style={payBtn}>
                  {downloading ? <Loader2 className="spin" size={20} /> : "TÉLÉCHARGER LE PDF"}
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
const secureTag = { fontSize: '9px', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', letterSpacing: '0.5px' };
const scrollContent = { flex: 1, padding: '20px', overflowY: 'auto' };
const serviceCard = { background: '#F8FAFC', borderRadius: '24px', padding: '20px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' };
const iconBox = { width: '50px', height: '50px', background: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const serviceName = { margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1e293b' };
const servicePrice = { margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '600' };
const labelSmall = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '15px' };
const methodBtn = { background: 'white', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1.5px solid #f1f5f9', cursor: 'pointer' };
const methodIcon = { width: '45px', height: '45px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const mTitle = { margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' };
const mSub = { margin: 0, fontSize: '0.75rem', color: '#94a3b8' };
const cardPreview = (type) => ({
  width: '100%', height: '180px', borderRadius: '20px', padding: '25px', color: 'white',
  background: type === 'visa' ? 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)' :
              type === 'mastercard' ? 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' :
              'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
  boxShadow: '0 15px 35px rgba(0,0,0,0.2)', marginBottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
});
const cardNumDisplay = { fontSize: '1.4rem', fontWeight: '600', letterSpacing: '2px', fontFamily: 'monospace' };
const cardLabel = { fontSize: '8px', opacity: 0.7 };
const cardVal = { fontSize: '11px', fontWeight: '700' };
const formBox = { padding: '0 5px' };
const inputGroup = { marginBottom: '18px' };
const fLabel = { display: 'block', fontSize: '10px', fontWeight: '900', color: '#94a3b8', marginBottom: '8px' };
const fInput = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #f1f5f9', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '700', outline: 'none' };
const payBtn = { width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: '#1e293b', color: 'white', fontWeight: '900', cursor: 'pointer', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const printerSlot = { width: '80%', height: '6px', background: '#1e293b', margin: '0 auto', borderRadius: '10px' };
const receipt = { background: 'white', width: '90%', margin: '-3px auto 30px', padding: '30px 20px', boxShadow: '0 15px 40px rgba(0,0,0,0.05)', borderRadius: '0 0 15px 15px', border: '1px solid #f1f5f9' };
const receiptTop = { borderBottom: '1px dashed #e2e8f0', paddingBottom: '20px', marginBottom: '20px' };
const receiptLine = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#475569' };
const barcode = { height: '40px', background: 'repeating-linear-gradient(90deg, #1e293b, #1e293b 2px, transparent 2px, transparent 6px)', marginTop: '20px', opacity: 0.3 };

export default BirthCertificationForm;