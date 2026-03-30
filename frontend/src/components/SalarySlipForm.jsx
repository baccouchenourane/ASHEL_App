import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, CreditCard, ChevronRight, 
  ClipboardList, Download, Loader2, Signal, Wifi, Battery, Cpu
} from 'lucide-react';
import jsPDF from 'jspdf';

const SalarySlipForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cardHolder, setCardHolder] = useState("");

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 1500);
  };

  const handleDownload = () => {
    setDownloading(true);
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("BULLETIN DE PAIE - CNRPS", 105, 30, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Agent : ${cardHolder.toUpperCase()}`, 20, 50);
    doc.text("Période : Mars 2026", 20, 60);
    doc.line(20, 65, 190, 65);
    doc.text("Salaire Brut : 2450.000 DT", 20, 80);
    doc.text("Retenues : 450.000 DT", 20, 90);
    doc.setFont("helvetica", "bold");
    doc.text("NET À PAYER : 2000.000 DT", 20, 110);
    setTimeout(() => { doc.save("Fiche_de_Paie_CNRPS.pdf"); setDownloading(false); }, 1000);
  };

  return (
    <div style={viewport}>
      <div style={phoneFrame}>
        <div style={statusBar}><span style={{fontWeight:'700'}}>09:41</span><div><Signal size={14}/> <Wifi size={14}/> <Battery size={16}/></div></div>
        <div style={appHeader}>
          <button onClick={step === 1 ? onBack : () => setStep(1)} style={backCircle}><ArrowLeft size={20}/></button>
          <div style={{textAlign:'center'}}><h3 style={navTitle}>Fiche de Paie</h3><div style={{fontSize:'9px', color:'#4338CA', fontWeight:'800'}}>ESPACE SALARIÉ CNRPS</div></div>
          <div style={{width:40}}></div>
        </div>

        <div style={scrollContent}>
          {step === 1 ? (
            <div className="fade-in">
              <div style={{...serviceCard, background:'#EEF2FF', border:'1px solid #E0E7FF'}}>
                <div style={iconBox}><ClipboardList size={24} color="#4338CA" /></div>
                <div><h4 style={serviceName}>Fiche de Paie Numérique</h4><p style={servicePrice}>Frais : <span style={{color:'#4338CA'}}>0.500 DT</span></p></div>
              </div>
              <div onClick={() => setStep(3)} style={methodBtn}><div style={methodIcon}><CreditCard color="#1e293b"/></div><div style={{flex:1}}><p style={mTitle}>Prélèvement sur salaire</p></div><ChevronRight size={18}/></div>
            </div>
          ) : step === 3 ? (
            <div className="slide-up">
               <div style={{...cardPreview, background:'linear-gradient(135deg, #4338CA 0%, #312E81 100%)'}}>
                <Cpu size={35} color="rgba(255,255,255,0.8)"/><div style={cardNumDisplay}>•••• •••• •••• ••••</div>
                <p style={cardVal}>{cardHolder.toUpperCase() || "MATRICULE CNRPS"}</p>
              </div>
              <input type="text" placeholder="Nom de l'agent" style={fInput} onChange={(e)=>setCardHolder(e.target.value)} />
              <button onClick={handlePayment} style={payBtn}>{loading ? <Loader2 className="spin"/> : "CONFIRMER 0.500 DT"}</button>
            </div>
          ) : (
            <div style={{textAlign:'center'}} className="scale-in">
              <CheckCircle2 size={50} color="#4338CA" style={{margin:'20px 0'}}/>
              <h4>BULLETIN GÉNÉRÉ</h4>
              <button onClick={handleDownload} style={payBtn}>{downloading ? <Loader2 className="spin"/> : "OUVRIR LE PDF"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles identiques (Réutilisés de ResidenceCertificateForm)
const viewport = { backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const phoneFrame = { width: '375px', height: '780px', backgroundColor: '#ffffff', borderRadius: '50px', border: '12px solid #1e293b', position: 'relative', overflow: 'hidden', display:'flex', flexDirection:'column' };
const statusBar = { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 35px' };
const appHeader = { padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const backCircle = { width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', border: 'none', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' };
const navTitle = { margin: 0, fontSize: '1.1rem', fontWeight: '900' };
const scrollContent = { flex: 1, padding: '20px' };
const serviceCard = { borderRadius: '24px', padding: '20px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' };
const iconBox = { width: '50px', height: '50px', background: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const serviceName = { margin: 0, fontSize: '1rem', fontWeight: '800' };
const servicePrice = { margin: 0, fontSize: '0.85rem', color: '#64748b' };
const methodBtn = { background: 'white', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '15px', border: '1.5px solid #f1f5f9', cursor: 'pointer' };
const methodIcon = { width: '45px', height: '45px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const mTitle = { margin: 0, fontSize: '0.9rem', fontWeight: '800' };
const cardPreview = { width: '100%', height: '180px', borderRadius: '20px', padding: '25px', color: 'white', marginBottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const cardNumDisplay = { fontSize: '1.4rem', fontWeight: '600', letterSpacing: '2px' };
const cardVal = { fontSize: '11px', fontWeight: '700' };
const fInput = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #f1f5f9', background: '#f8fafc' };
const payBtn = { width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: '#1e293b', color: 'white', fontWeight: '900', marginTop:'20px', cursor:'pointer' };

export default SalarySlipForm;