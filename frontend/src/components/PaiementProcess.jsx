import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Loader2, Signal, Wifi, Battery, Nfc, Cpu } from 'lucide-react';
import jsPDF from 'jspdf';

const PaiementProcess = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("RECU DE PAIEMENT - ASHEL", 105, 40, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Organisme : ${type === 'electricite' ? 'STEG' : 'SONEDE'}`, 20, 70);
    doc.text(`Montant payé : ${type === 'electricite' ? '85.500 DT' : '42.200 DT'}`, 20, 80);
    doc.text(`Date : ${new Date().toLocaleString()}`, 20, 90);
    doc.text(`Numéro de Transaction : TXN-${Math.floor(Math.random()*1000000)}`, 20, 100);
    doc.save(`Recu_${type}.pdf`);
  };

  if (step === 2) {
    return (
      <div style={styles.successContainer}>
        <CheckCircle2 size={80} color="#10b981" />
        <h1 style={{fontWeight: '900', marginTop: 20}}>Paiement Réussi !</h1>
        <p style={{textAlign:'center', color:'#64748B'}}>Votre facture a été réglée avec succès.</p>
        <button onClick={downloadReceipt} style={styles.downloadBtn}>
          <Download size={18}/> TÉLÉCHARGER LE REÇU (PDF)
        </button>
        <button onClick={() => navigate('/e-pay')} style={styles.backHomeBtn}>RETOUR</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={20}/></button>
        <p style={{fontWeight:'900', margin:0}}>Paiement Sécurisé</p>
      </div>

      <div style={{padding: '20px 25px'}}>
        {/* Carte Bancaire Stylisée e-admin */}
        <div style={styles.cardPreview}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <Nfc size={24}/>
            <span style={{fontWeight:'900', fontSize:'1.2rem', fontStyle:'italic'}}>VISA</span>
          </div>
          <Cpu size={35} style={{margin:'15px 0', color:'#ffd700'}}/>
          <div style={{fontSize:'1.3rem', fontWeight:'600', letterSpacing:3}}>**** **** **** 4421</div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:20}}>
            <span style={{fontSize:'0.7rem', opacity:0.8}}>MOHAMED ALI</span>
            <span style={{fontSize:'0.7rem', opacity:0.8}}>12/28</span>
          </div>
        </div>

        <button onClick={handlePay} style={styles.payBtn} disabled={loading}>
          {loading ? <Loader2 className="spinner" /> : "CONFIRMER LE PAIEMENT"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#F8FAFC' },
  header: { padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '20px' },
  backBtn: { background: 'white', border: 'none', padding: '10px', borderRadius: '12px' },
  cardPreview: { background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '24px', padding: '25px', color: 'white', boxShadow: '0 15px 30px rgba(0,0,0,0.15)' },
  payBtn: { width: '100%', marginTop: '30px', padding: '20px', borderRadius: '20px', border: 'none', background: '#0056D2', color: 'white', fontWeight: '900', cursor: 'pointer' },
  successContainer: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'white' },
  downloadBtn: { width: '100%', padding: '18px', borderRadius: '16px', background: '#F1F5F9', border: 'none', color: '#1e293b', fontWeight: '800', display: 'flex', justifyContent: 'center', gap: 10, marginTop: 40 },
  backHomeBtn: { width: '100%', marginTop: 15, padding: '18px', borderRadius: '16px', background: '#1e293b', color: 'white', border: 'none', fontWeight: '900' }
};

export default PaiementProcess;