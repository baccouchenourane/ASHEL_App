import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Printer, Download, CreditCard, 
  MapPin, User, Lock, QrCode, Landmark 
} from 'lucide-react';

const FacturePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- RÉCUPÉRATION DES DONNÉES DYNAMIQUES ---
  // On récupère l'objet utilisateur stocké dans le navigateur
  const userData = JSON.parse(localStorage.getItem('user_ashel')) || { 
    nom: "Utilisateur", 
    prenom: "Client",
    cin: "00000000"
  };

  return (
    <div style={styles.screenWrapper}>
      <div className="app-container" style={{ background: '#F1F5F9' }}>
        <div className="moucharabieh-overlay"></div>

        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={20}/></button>
          <span style={{fontWeight:'900', color: '#1e293b'}}>Détails Facture</span>
        </div>

        <div className="page-content" style={{padding: '0 20px', paddingBottom: '40px'}}>
          {/* LE PAPIER DE LA FACTURE */}
          <div style={styles.billPaper}>
            <div style={styles.topCut}></div>
            
            {/* 1. Header Organisme */}
            <div style={styles.orgHeader}>
                <div>
                    <h2 style={styles.orgName}>STEG TUNISIE</h2>
                    <p style={styles.orgInfo}>38, Rue Kamel Ataturk, Tunis</p>
                </div>
                <div style={styles.iconCircle}>
                   <Landmark size={24} color="#f59e0b" />
                </div>
            </div>

            <div style={styles.divider} />

            {/* 2. Infos Citoyen (DYNAMIQUE) */}
            <div style={styles.section}>
                <p style={styles.sectionTitle}>BÉNÉFICIAIRE / CITOYEN</p>
                <div style={styles.citizenRow}>
                    <User size={14} color="#94a3b8"/> 
                    <span style={{fontWeight: '700', textTransform: 'uppercase'}}>
                        {userData.nom} {userData.prenom}
                    </span>
                </div>
                <div style={styles.citizenRow}>
                    <Lock size={14} color="#94a3b8"/> 
                    <span>CIN: {userData.cin}</span>
                </div>
                <div style={styles.citizenRow}>
                    <MapPin size={14} color="#94a3b8"/> 
                    <span>Cité Ennasr 2, Ariana (Profil vérifié)</span>
                </div>
            </div>

            {/* 3. Détails Facture */}
            <div style={styles.detailsGrid}>
                <div style={styles.infoCol}>
                    <p style={styles.gridLabel}>N° Facture</p>
                    <b style={styles.gridVal}>FAC-2026-992</b>
                </div>
                <div style={styles.infoCol}>
                    <p style={styles.gridLabel}>Échéance</p>
                    <b style={{...styles.gridVal, color: '#e11d48'}}>30/04/2026</b>
                </div>
            </div>

            {/* 4. Tableau des montants */}
            <div style={styles.table}>
                <div style={styles.trHead}><span>Désignation</span><span>Total</span></div>
                <div style={styles.tr}><span>Consommation Trimestrielle</span><span>72.500 DT</span></div>
                <div style={styles.tr}><span>Redevances & Taxes (13%)</span><span>13.000 DT</span></div>
                <div style={styles.tr}><span>Pénalités retard</span><span>0.000 DT</span></div>
            </div>

            {/* 5. Total mis en évidence */}
            <div style={styles.totalBox}>
                <span style={{fontSize: '0.65rem', opacity: 0.8, letterSpacing: '1px'}}>TOTAL À PAYER</span>
                <h1 style={{margin: '5px 0 0 0', fontSize: '1.8rem'}}>85.500 <small style={{fontSize: '0.9rem'}}>DT</small></h1>
            </div>

            <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop: 25, gap: 8}}>
                <QrCode size={55} color="#cbd5e1" />
                <p style={{fontSize: '0.55rem', color: '#94a3b8', fontWeight: '700'}}>ID TRANSACTION: ASHEL-STG-88291</p>
            </div>
          </div>

          {/* 6. Actions de Paiement */}
          <div style={styles.actionArea}>
            <button style={styles.printBtn} onClick={() => window.print()}>
                <Download size={18}/> PDF
            </button>
            <button style={styles.payBtn} onClick={() => navigate(`/paiement-facture/${id}/payer`)}>
                <CreditCard size={18}/> PAYER MAINTENANT
            </button>
          </div>
          
          <p style={styles.secureText}><Lock size={12}/> Transaction cryptée via Serveur National de Paiement</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0' },
  header: { padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '20px' },
  backBtn: { background: 'white', border: 'none', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', cursor: 'pointer' },
  billPaper: { background: 'white', borderRadius: '4px 4px 25px 25px', padding: '30px 20px', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' },
  topCut: { position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: '#f59e0b' },
  orgHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orgName: { margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#1e293b' },
  orgInfo: { margin: 0, fontSize: '0.65rem', color: '#94A3B8' },
  iconCircle: { width: '45px', height: '45px', background: '#fffbeb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  divider: { height: '1px', borderTop: '2px dashed #F1F5F9', margin: '25px 0' },
  sectionTitle: { fontSize: '0.6rem', fontWeight: '900', color: '#94A3B8', letterSpacing: '1px', marginBottom: '12px' },
  citizenRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', marginBottom: '8px' },
  detailsGrid: { display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '15px', borderRadius: '16px', margin: '20px 0' },
  infoCol: { flex: 1 },
  gridLabel: { margin: 0, fontSize: '0.6rem', color: '#94a3b8', fontWeight: '700' },
  gridVal: { fontSize: '0.8rem', color: '#1e293b' },
  table: { marginTop: '20px' },
  trHead: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '900', color: '#94A3B8', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' },
  tr: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '12px 0', borderBottom: '1px solid #F8FAFC', fontWeight: '600' },
  totalBox: { marginTop: '25px', background: '#1e293b', padding: '20px', borderRadius: '20px', color: 'white', textAlign: 'center' },
  actionArea: { display: 'flex', gap: '12px', marginTop: '25px' },
  printBtn: { flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px solid #E2E8F0', background: 'white', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  payBtn: { flex: 2.5, padding: '16px', borderRadius: '16px', border: 'none', background: '#1e293b', color: 'white', fontWeight: '900', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  secureText: { textAlign: 'center', fontSize: '0.65rem', color: '#94A3B8', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }
};

export default FacturePage;