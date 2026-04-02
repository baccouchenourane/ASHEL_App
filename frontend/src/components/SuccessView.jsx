import { CheckCircle2, Download } from 'lucide-react';

const SuccessView = ({ navigate, id, montant }) => (
  <div className="page-content" style={styles.successContainer}>
    {/* Animation simple CSS pour l'entrée de la carte */}
    <div style={styles.successCard} className="fade-in-up">
      <div style={styles.checkCircle}>
        <CheckCircle2 size={50} color="#059669" />
      </div>
      
      <h2 style={{ fontWeight: "900", color: "#1e293b", margin: '0 0 10px 0' }}>Paiement Réussi !</h2>
      <p style={{ color: "#64748b", fontSize: '0.9rem', marginBottom: '30px' }}>
        Votre transaction a été approuvée avec succès.
      </p>

      <div style={styles.miniReceipt}>
        <div style={styles.receiptRow}>
          <span>Montant payé</span>
          <b style={{color: '#059669'}}>{montant} DT</b>
        </div>
        <div style={styles.receiptRow}>
          <span>Référence</span>
          <b style={{textTransform: 'uppercase'}}>ASH-{Math.random().toString(36).substr(2, 9)}</b>
        </div>
        <div style={styles.receiptRow}>
          <span>Date</span>
          <b>{new Date().toLocaleDateString()}</b>
        </div>
      </div>

      <button 
        onClick={() => navigate("/home")} 
        style={styles.homeBtn}
      >
        RETOUR À L'ACCUEIL
      </button>

      <button 
        style={styles.downloadBtn}
        onClick={() => window.print()}
      >
        <Download size={16} /> TÉLÉCHARGER LE REÇU
      </button>
    </div>
  </div>
);
const styles = {
  successContainer: { 
    height: "90vh", display: "flex", alignItems: "center", 
    justifyContent: "center", padding: "20px"
  },
  successCard: { 
    background: "white", width: "100%", maxWidth: "400px", padding: "40px 30px", 
    borderRadius: "30px", textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" 
  },
  checkCircle: { 
    width: "80px", height: "80px", background: "#ecfdf5", borderRadius: "50%", 
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" 
  },
  miniReceipt: { 
    background: "#F8FAFC", padding: "20px", borderRadius: "20px", 
    marginBottom: "30px", border: "1px dashed #CBD5E1" 
  },
  receiptRow: { 
    display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.85rem" 
  },
  homeBtn: { 
    width: "100%", padding: "16px", borderRadius: "16px", border: "none", 
    background: "#1e293b", color: "white", fontWeight: "900", cursor: "pointer", marginBottom: '12px' 
  },
  downloadBtn: { 
    width: "100%", padding: "14px", borderRadius: "16px", border: "1.5px solid #E2E8F0", 
    background: "white", color: "#1e293b", fontWeight: "800", cursor: "pointer", 
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
  }
};