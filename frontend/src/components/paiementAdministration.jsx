import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Download, CreditCard, 
  MapPin, User, Lock, QrCode, Landmark, ShieldCheck 
} from 'lucide-react';
import jsPDF from 'jspdf';

const PaiementAdministration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupération des données passées via la navigation (ou valeurs par défaut)
  const { docName, montant } = location.state || { 
    docName: "Extrait de Naissance", 
    montant: "2.500" 
  };

  const userData = JSON.parse(localStorage.getItem('user_ashel')) || { 
    nom: 'Utilisateur', 
    prenom: 'Citoyen',
    cin: '08888888',
  };

  const transactionRef = `GOV-${Math.floor(100000 + Math.random() * 900000)}`;

  // ─── GÉNÉRATION PDF ───────────────────────────────────────────────────────────
  const generateReceiptPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.text("REPUBLIQUE TUNISIENNE", 105, 20, { align: 'center' });
    doc.text("MINISTERE DE L'INTERIEUR", 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`REÇU DE PAIEMENT : ${docName}`, 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`Bénéficiaire : ${userData.nom} ${userData.prenom}`, 20, 60);
    doc.text(`CIN : ${userData.cin}`, 20, 70);
    doc.text(`Référence : ${transactionRef}`, 20, 80);
    doc.text(`Montant Total : ${montant} DT`, 20, 90);
    
    doc.save(`Recu_${docName}.pdf`);
  };

  return (
    <div style={styles.screenWrapper}>
      <div className="app-container" style={{ background: '#F1F5F9' }}>
        <div className="moucharabieh-overlay"></div>

        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={20} />
          </button>
          <span style={styles.headerTitle}>Détails de la demande</span>
          <div style={{ width: 40 }} />
        </div>

        <div className="page-content" style={{ padding: '0 20px', paddingBottom: '40px' }}>

          {/* LA "FEUILLE" DE FACTURE / DOCUMENT */}
          <div style={styles.billPaper}>
            {/* Barre de couleur institutionnelle (Bleu Gouv) */}
            <div style={{ ...styles.topBar, background: '#0056D2' }} />

            <div style={styles.orgHeader}>
              <div>
                <h2 style={styles.orgName}>ÉTAT TUNISIEN</h2>
                <p style={styles.orgSub}>Portail National e-Administration</p>
              </div>
              <div style={{ ...styles.iconCircle, color: '#0056D2', background: `#0056D215` }}>
                <Landmark size={24} />
              </div>
            </div>

            <div style={styles.dashedDivider} />

            <div style={styles.section}>
              <p style={styles.sectionLabel}>BÉNÉFICIAIRE DU DOCUMENT</p>
              <div style={styles.infoRow}>
                <User size={14} color="#94a3b8" />
                <b style={{ textTransform: 'uppercase' }}>{userData.nom} {userData.prenom}</b>
              </div>
              <div style={styles.infoRow}>
                <ShieldCheck size={14} color="#94a3b8" />
                <span>CIN : {userData.cin}</span>
              </div>
            </div>

            <div style={styles.refGrid}>
              <div style={styles.refItem}>
                <p style={styles.refLabel}>Référence dossier</p>
                <b style={styles.refValue}>{transactionRef}</b>
              </div>
              <div style={{ ...styles.refItem, borderRight: 'none' }}>
                <p style={styles.refLabel}>Date Demande</p>
                <b style={styles.refValue}>{new Date().toLocaleDateString('fr-TN')}</b>
              </div>
            </div>

            <div style={styles.priceTable}>
              <div style={styles.tableHead}>
                <span>Désignation des frais</span>
                <span>Montant</span>
              </div>
              <div style={styles.tableRow}>
                <span>Délivrance : {docName}</span>
                <span>{montant} DT</span>
              </div>
              <div style={styles.tableRow}>
                <span>Droit de timbre électronique</span>
                <span>0.600 DT</span>
              </div>
            </div>

            <div style={styles.totalBlock}>
              <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>TOTAL NET À REGLER</p>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
                {parseFloat(montant) + 0.600} <small style={{ fontSize: '0.9rem' }}>DT</small>
              </h1>
            </div>

            <div style={styles.qrArea}>
              <QrCode size={50} color="#CBD5E1" />
              <p style={styles.qrText}>Vérification QR-Code sécurisée</p>
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div style={styles.actionGrid}>
            <button style={styles.secondaryBtn} onClick={generateReceiptPDF}>
              <Download size={18} /> DEVIS PDF
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate('/paiement-carte-admin', { state: { montant, docName } })}
            >
              <CreditCard size={18} /> PAYER MAINTENANT
            </button>
          </div>

          <div style={styles.secureFooter}>
            <Lock size={12} /> Connexion chiffrée SSL — Ministère des Technologies
          </div>
        </div>
      </div>

      <style>{`
        .app-container { 
          width: 390px; height: 844px; background: #ffffff; 
          position: relative; overflow: hidden; display: flex; flex-direction: column; 
          box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); 
          border-radius: 50px; border: 4px solid #334155; 
        }
        .moucharabieh-overlay { 
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
          background-image: url("https://www.transparenttextures.com/patterns/arabesque.png"); 
          opacity: 0.02; pointer-events: none; z-index: 0; 
        }
        .page-content { flex: 1; overflow-y: auto; position: relative; z-index: 1; }
      `}</style>
    </div>
  );
};

const styles = {
  screenWrapper:  { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0' },
  header:         { padding: '20px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #f1f5f9', position: 'relative', zIndex: 10, flexShrink: 0 },
  backBtn:        { background: '#f8fafc', border: 'none', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  headerTitle:    { fontWeight: '900', fontSize: '1.1rem', color: '#1e293b' },
  billPaper:      { background: 'white', borderRadius: '4px 4px 25px 25px', padding: '30px 20px', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden', marginTop: '20px' },
  topBar:         { position: 'absolute', top: 0, left: 0, right: 0, height: '6px' },
  orgHeader:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orgName:        { margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#1e293b' },
  orgSub:         { margin: 0, fontSize: '0.65rem', color: '#94a3b8' },
  iconCircle:     { width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dashedDivider:  { height: '1px', borderTop: '2px dashed #F1F5F9', margin: '25px 0' },
  section:        { marginBottom: '20px' },
  sectionLabel:   { fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '10px' },
  infoRow:        { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', marginBottom: '6px', color: '#475569' },
  refGrid:        { display: 'flex', background: '#F8FAFC', borderRadius: '16px', padding: '15px', margin: '20px 0' },
  refItem:        { flex: 1, textAlign: 'center', borderRight: '1px solid #E2E8F0' },
  refLabel:       { margin: 0, fontSize: '0.6rem', color: '#94a3b8', fontWeight: '700' },
  refValue:       { fontSize: '0.8rem', color: '#1e293b', fontWeight: '800' },
  priceTable:     { marginTop: '20px' },
  tableHead:      { display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8' },
  tableRow:       { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F8FAFC', fontSize: '0.85rem', fontWeight: '600' },
  totalBlock:     { marginTop: '25px', background: '#1e293b', padding: '20px', borderRadius: '20px', color: 'white', textAlign: 'center' },
  qrArea:         { marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
  qrText:         { fontSize: '0.6rem', color: '#CBD5E1', fontWeight: '700' },
  actionGrid:     { display: 'flex', gap: '12px', marginTop: '25px' },
  primaryBtn:     { flex: 2, background: '#1e293b', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' },
  secondaryBtn:   { flex: 1, background: 'white', border: '1.5px solid #E2E8F0', padding: '16px', borderRadius: '16px', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  secureFooter:   { textAlign: 'center', fontSize: '0.65rem', color: '#94a3b8', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' },
};

export default PaiementAdministration;