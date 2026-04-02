import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Download, CreditCard, 
  MapPin, User, Lock, QrCode, Landmark, ShieldCheck 
} from 'lucide-react';
import jsPDF from 'jspdf';

// ─── DONNÉES DES FACTURES ─────────────────────────────────────────────────────
const FACTURES_DATA = {
  electricite: {
    org: 'STEG TUNISIE',
    adresse: '38, Rue Kamel Ataturk, Tunis',
    ref: 'STG-2026-04421',
    color: '#f59e0b',
    total: '85.500',
    details: [
      { label: 'Consommation HP',  val: '45.200 DT' },
      { label: 'Consommation HC',  val: '27.300 DT' },
      { label: 'TVA (13%)',        val: '13.000 DT' },
    ],
  },
  eau: {
    org: 'SONEDE',
    adresse: '6, Rue Abdelkader, Tunis',
    ref: 'SND-2026-77812',
    color: '#0ea5e9',
    total: '42.200',
    details: [
      { label: 'Consommation trimestrielle', val: '33.500 DT' },
      { label: 'Taxes & redevances (7%)',    val: '8.700 DT'  },
    ],
  },
  radar: {
    org: "MIN. DE L'INTÉRIEUR",
    adresse: 'Avenue Habib Bourguiba, Tunis',
    ref: 'PV-2026-88',
    color: '#e11d48',
    total: '60.000',
    details: [
      { label: 'Excès de vitesse - Radès', val: '60.000 DT' },
    ],
  },
  etude: {
    org: 'UNIVERSITÉ DE TUNIS',
    adresse: 'Campus Universitaire, Tunis',
    ref: 'UNIV-2026-3301',
    color: '#8b5cf6',
    total: '10.000',
    details: [
      { label: "Frais d'inscription annuels", val: '10.000 DT' },
    ],
  },
};

// ─── GÉNÉRATION PDF ───────────────────────────────────────────────────────────
const generatePDF = (data, userData) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const margin = 20;

  // ── Bande couleur en haut ──
  doc.setFillColor(data.color);
  doc.rect(0, 0, W, 8, 'F');

  // ── Logo / Titre organisme ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text(data.org, margin, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(data.adresse, margin, 31);

  // ── Ligne tiretée ──
  doc.setDrawColor(226, 232, 240);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(margin, 38, W - margin, 38);
  doc.setLineDashPattern([], 0);

  // ── Section Citoyen ──
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184);
  doc.text('DESTINATAIRE / CITOYEN', margin, 46);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`${userData.nom.toUpperCase()} ${(userData.prenom || '').toUpperCase()}`, margin, 53);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`CIN : ${userData.cin}`, margin, 59);
  doc.text('Tunisie (Adresse liée au compte)', margin, 65);

  // ── Références ──
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, 72, (W - margin * 2) / 2 - 3, 18, 3, 3, 'F');
  doc.roundedRect(margin + (W - margin * 2) / 2 + 3, 72, (W - margin * 2) / 2 - 3, 18, 3, 3, 'F');

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉFÉRENCE', margin + 5, 78);
  doc.text('ÉCHÉANCE', margin + (W - margin * 2) / 2 + 8, 78);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(data.ref, margin + 5, 85);
  doc.setTextColor(225, 29, 72);
  doc.text('30/04/2026', margin + (W - margin * 2) / 2 + 8, 85);

  // ── Tableau des montants ──
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.3);
  doc.line(margin, 100, W - margin, 100);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184);
  doc.text('DÉSIGNATION', margin, 97);
  doc.text('MONTANT', W - margin - 25, 97);

  let y = 108;
  data.details.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(item.label, margin, y);
    doc.text(item.val, W - margin - 25, y);
    doc.setDrawColor(248, 250, 252);
    doc.line(margin, y + 3, W - margin, y + 3);
    y += 12;
  });

  // ── Bloc Total ──
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y + 5, W - margin * 2, 22, 4, 4, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL À PAYER', W / 2, y + 13, { align: 'center' });

  doc.setFontSize(18);
  doc.text(`${data.total} DT`, W / 2, y + 22, { align: 'center' });

  // ── Footer ──
  const footerY = 270;
  doc.setDrawColor(226, 232, 240);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin, footerY, W - margin, footerY);
  doc.setLineDashPattern([], 0);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('Authenticité garantie par l\'État Tunisien — GovChain Tunisia', W / 2, footerY + 6, { align: 'center' });
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-TN')} à ${new Date().toLocaleTimeString('fr-TN')}`, W / 2, footerY + 11, { align: 'center' });
  doc.text(`Réf. transaction : ASHEL-${data.ref}-${Math.floor(Math.random() * 100000)}`, W / 2, footerY + 16, { align: 'center' });

  doc.save(`Facture_${data.ref}.pdf`);
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
const FactureDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const userData = JSON.parse(localStorage.getItem('user_ashel')) || { 
    nom: 'Utilisateur', 
    prenom: 'Client',
    cin: '00000000',
  };

  const data = FACTURES_DATA[id] || FACTURES_DATA.electricite;

  return (
    <div style={styles.screenWrapper}>
      <div className="app-container" style={{ background: '#F1F5F9' }}>
        <div className="moucharabieh-overlay"></div>

        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={20} />
          </button>
          <span style={styles.headerTitle}>Détails du paiement</span>
          <div style={{ width: 40 }} />
        </div>

        <div className="page-content" style={{ padding: '0 20px', paddingBottom: '40px' }}>

          {/* FACTURE PAPIER */}
          <div style={styles.billPaper}>
            <div style={{ ...styles.topBar, background: data.color }} />

            <div style={styles.orgHeader}>
              <div>
                <h2 style={styles.orgName}>{data.org}</h2>
                <p style={styles.orgSub}>{data.adresse}</p>
              </div>
              <div style={{ ...styles.iconCircle, color: data.color, background: `${data.color}15` }}>
                <Landmark size={24} />
              </div>
            </div>

            <div style={styles.dashedDivider} />

            <div style={styles.section}>
              <p style={styles.sectionLabel}>DESTINATAIRE / CITOYEN</p>
              <div style={styles.infoRow}>
                <User size={14} color="#94a3b8" />
                <b style={{ textTransform: 'uppercase' }}>{userData.nom} {userData.prenom}</b>
              </div>
              <div style={styles.infoRow}>
                <ShieldCheck size={14} color="#94a3b8" />
                <span>CIN: {userData.cin}</span>
              </div>
              <div style={styles.infoRow}>
                <MapPin size={14} color="#94a3b8" />
                <span>Tunisie (Adresse liée au compte)</span>
              </div>
            </div>

            <div style={styles.refGrid}>
              <div style={styles.refItem}>
                <p style={styles.refLabel}>Référence</p>
                <b style={styles.refValue}>{data.ref}</b>
              </div>
              <div style={{ ...styles.refItem, borderRight: 'none' }}>
                <p style={styles.refLabel}>Échéance</p>
                <b style={{ ...styles.refValue, color: '#e11d48' }}>30/04/2026</b>
              </div>
            </div>

            <div style={styles.priceTable}>
              <div style={styles.tableHead}>
                <span>Désignation</span>
                <span>Montant</span>
              </div>
              {data.details.map((item, index) => (
                <div key={index} style={styles.tableRow}>
                  <span>{item.label}</span>
                  <span>{item.val}</span>
                </div>
              ))}
            </div>

            <div style={styles.totalBlock}>
              <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>TOTAL À PAYER</p>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
                {data.total} <small style={{ fontSize: '0.9rem' }}>DT</small>
              </h1>
            </div>

            <div style={styles.qrArea}>
              <QrCode size={50} color="#CBD5E1" />
              <p style={styles.qrText}>Authenticité garantie par l'État</p>
            </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div style={styles.actionGrid}>
            <button style={styles.secondaryBtn} onClick={() => generatePDF(data, userData)}>
              <Download size={18} /> PDF
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate(`/paiement-facture/${id}/payer`)}
            >
              <CreditCard size={18} /> PAYER MAINTENANT
            </button>
          </div>

          <div style={styles.secureFooter}>
            <Lock size={12} /> Transaction sécurisée par GovChain Tunisia
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
  orgName:        { margin: 0, fontSize: '1.3rem', fontWeight: '900', color: '#1e293b' },
  orgSub:         { margin: 0, fontSize: '0.7rem', color: '#94a3b8' },
  iconCircle:     { width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dashedDivider:  { height: '1px', borderTop: '2px dashed #F1F5F9', margin: '25px 0' },
  section:        { marginBottom: '20px' },
  sectionLabel:   { fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '10px' },
  infoRow:        { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', marginBottom: '6px', color: '#475569' },
  refGrid:        { display: 'flex', background: '#F8FAFC', borderRadius: '16px', padding: '15px', margin: '20px 0' },
  refItem:        { flex: 1, textAlign: 'center', borderRight: '1px solid #E2E8F0' },
  refLabel:       { margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700' },
  refValue:       { fontSize: '0.85rem', color: '#1e293b' },
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

export default FactureDetail;