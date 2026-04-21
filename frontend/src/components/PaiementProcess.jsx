import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

const PaiementProcess = () => {
  const { type } = useParams(); // ← était "type", maintenant "id"
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [facture, setFacture] = useState(null);
  const [numTxn, setNumTxn] = useState(null);

  // Récupérer la facture depuis le backend au chargement
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_ashel'));
    if (!user?.cin) return;

    fetch(`http://localhost:8081/api/paiement/facture?cin=${user.cin}&type=${type}`)
      .then(r => r.json())
      .then(data => {
      //  Vérifier que c'est bien une facture et pas une erreur
      if (data.error) {
        console.error("Erreur backend:", data.error);
        return;
      }
      setFacture(data);
    })
    .catch(() => console.error("Erreur chargement facture"));
}, [id]);

  // Initier le paiement via le backend
  const handlePay = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user_ashel'));

    try {
      // Étape A : initier (crée TXN EN_COURS)
      const initRes = await fetch('http://localhost:8081/api/paiement/initier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cin: user.cin,
          referenceFacture: facture.reference,
          methodePaiement: 'CARTE'
        })
      });
      const initData = await initRes.json();
      setNumTxn(initData.numeroTransaction);

      // Étape B : confirmer (marque SUCCES + met à jour la facture)
      await fetch('http://localhost:8081/api/paiement/confirmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroTransaction: initData.numeroTransaction })
      });

      setLoading(false);
      setStep(2);
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      setLoading(false);
      alert("Une erreur est survenue lors du paiement");
    }
  };

  // Générer le reçu PDF avec les vraies données
  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("RECU DE PAIEMENT - ASHEL", 105, 40, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Organisme : ${facture?.organisme || 'N/A'}`, 20, 70);
    doc.text(`Montant payé : ${facture?.montant || '0'} DT`, 20, 80);
    doc.text(`Référence : ${facture?.reference || 'N/A'}`, 20, 90);
    doc.text(`N° Transaction : ${numTxn || 'N/A'}`, 20, 100);
    doc.text(`Date : ${new Date().toLocaleString('fr-TN')}`, 20, 110);
    doc.save(`Recu_${facture?.reference || 'paiement'}.pdf`);
  };

  if (step === 2) {
    return (
      <div style={styles.successContainer}>
        <CheckCircle2 size={80} color="#10b981" />
        <h1 style={{ fontWeight: '900', marginTop: 20 }}>Paiement Réussi !</h1>
        <p style={{ textAlign: 'center', color: '#64748B' }}>Votre facture a été réglée avec succès.</p>
        <button onClick={downloadReceipt} style={styles.downloadBtn}>
          <Download size={18} /> TÉLÉCHARGER LE REÇU (PDF)
        </button>
        <button onClick={() => navigate('/e-pay')} style={styles.backHomeBtn}>RETOUR</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <p style={{ fontWeight: '900', margin: 0 }}>Paiement Sécurisé</p>
      </div>

      <div style={{ padding: '20px 25px' }}>
        {/* Informations de la facture */}
        {facture && (
          <div style={styles.factureInfo}>
            <h3>Détails de la facture</h3>
            <p><strong>Organisme :</strong> {facture.organisme}</p>
            <p><strong>Montant :</strong> {facture.montant} DT</p>
            <p><strong>Référence :</strong> {facture.reference}</p>
            <p><strong>Date d'échéance :</strong> {new Date(facture.dateEcheance).toLocaleDateString('fr-TN')}</p>
          </div>
        )}

        {/* Carte Bancaire Stylisée */}
        <div style={styles.cardPreview}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '900', fontSize: '1.2rem', fontStyle: 'italic' }}>VISA</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '600', letterSpacing: 3, marginTop: 20 }}>
            **** **** **** 4421
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>TITULAIRE CARTE</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>12/28</span>
          </div>
        </div>

        <button 
          onClick={handlePay} 
          style={styles.payBtn} 
          disabled={loading || !facture}
        >
          {loading ? <Loader2 className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : "CONFIRMER LE PAIEMENT"}
        </button>
        
        {!facture && (
          <p style={{ textAlign: 'center', marginTop: 20, color: '#ef4444' }}>
            Chargement des informations de la facture...
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#F8FAFC' },
  header: { padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '20px' },
  backBtn: { background: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' },
  factureInfo: { 
    background: 'white', 
    borderRadius: '16px', 
    padding: '20px', 
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  cardPreview: { 
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
    borderRadius: '24px', 
    padding: '25px', 
    color: 'white', 
    boxShadow: '0 15px 30px rgba(0,0,0,0.15)' 
  },
  payBtn: { 
    width: '100%', 
    marginTop: '30px', 
    padding: '20px', 
    borderRadius: '20px', 
    border: 'none', 
    background: '#0056D2', 
    color: 'white', 
    fontWeight: '900', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  successContainer: { 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40, 
    background: 'white' 
  },
  downloadBtn: { 
    width: '100%', 
    padding: '18px', 
    borderRadius: '16px', 
    background: '#F1F5F9', 
    border: 'none', 
    color: '#1e293b', 
    fontWeight: '800', 
    display: 'flex', 
    justifyContent: 'center', 
    gap: 10, 
    marginTop: 40,
    cursor: 'pointer'
  },
  backHomeBtn: { 
    width: '100%', 
    marginTop: 15, 
    padding: '18px', 
    borderRadius: '16px', 
    background: '#1e293b', 
    color: 'white', 
    border: 'none', 
    fontWeight: '900',
    cursor: 'pointer'
  }
};

export default PaiementProcess;