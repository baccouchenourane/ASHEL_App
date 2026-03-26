import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, ShieldCheck, CheckCircle, 
  Download, Mail, Smartphone, Lock, ChevronRight 
} from 'lucide-react';

const PaiementAmende = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Résumé, 2: Paiement, 3: Confirmation
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(step + 1);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="app-container" style={{ height: 'auto', minHeight: '820px' }}>
      <div className="moucharabieh-overlay"></div>

      {/* 1. Barre de Progression (UX Moderne) */}
      <div style={{ padding: '40px 25px 20px 25px', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <ArrowLeft onClick={() => navigate('/e-amende')} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Règlement sécurisé</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: '#f1f5f9', zIndex: 1 }}></div>
          <div style={{ position: 'absolute', top: '15px', left: '10%', width: step === 1 ? '0%' : step === 2 ? '40%' : '80%', height: '2px', background: 'var(--ashal-red)', zIndex: 2, transition: '0.5s' }}></div>
          
          <StepIcon active={step >= 1} icon={<Lock size={14}/>} label="Détails" />
          <StepIcon active={step >= 2} icon={<CreditCard size={14}/>} label="Paiement" />
          <StepIcon active={step >= 3} icon={<CheckCircle size={14}/>} label="Succès" />
        </div>
      </div>

      <div style={{ padding: '20px', flex: 1 }}>
        
        {/* ÉTAPE 1 : RÉSUMÉ AVANT PAIEMENT */}
        {step === 1 && (
          <div className="fade-in">
            <div style={{ background: 'white', borderRadius: '25px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#64748b' }}>RÉSUMÉ DE L'INFRACTION</h4>
              <DetailRow label="ID Amende" value="PV-2026-001" />
              <DetailRow label="Type" value="Excès de vitesse" />
              <DetailRow label="Date" value="15 Mars 2026" />
              <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '20px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700' }}>Total à payer</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--ashal-red)' }}>60.000 DT</span>
              </div>
            </div>
            <button onClick={handleNext} className="btn-ashal" style={{ width: '100%', marginTop: '30px' }}>
              CONTINUER VERS LE PAIEMENT
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : FORMULAIRE DE PAIEMENT */}
        {step === 2 && (
          <div className="fade-in">
            <h4 style={{ fontWeight: '800', marginBottom: '20px' }}>Mode de paiement</h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
               <PaymentOption icon={<CreditCard size={20}/>} label="Carte" active />
               <PaymentOption icon={<Smartphone size={20}/>} label="e-Dinar" />
            </div>

            <div style={{ background: 'white', borderRadius: '25px', padding: '25px' }}>
              <input type="text" placeholder="Nom sur la carte" className="login-input" style={{ marginBottom: '15px' }} />
              <input type="text" placeholder="0000 0000 0000 0000" className="login-input" style={{ marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="MM/YY" className="login-input" />
                <input type="password" placeholder="CVV" className="login-input" />
              </div>
            </div>

            <button onClick={handleNext} className="btn-ashal" style={{ width: '100%', marginTop: '30px' }}>
              {loading ? "TRAITEMENT SECURISE..." : "CONFIRMER LE PAIEMENT"}
            </button>
          </div>
        )}

        {/* ÉTAPE 3 : CONFIRMATION SUCCÈS */}
        {step === 3 && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '40px 10px' }}>
            <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <CheckCircle size={40} color="#059669" />
            </div>
            <h2 style={{ fontWeight: '900', marginBottom: '10px' }}>Paiement Réussi !</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '40px' }}>Votre amende a été régularisée avec succès. Un reçu vous a été envoyé par email.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button className="btn-ashal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Download size={18} /> TÉLÉCHARGER LE REÇU (PDF)
              </button>
              <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sous-composants ---
const StepIcon = ({ active, icon, label }) => (
  <div style={{ zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
    <div style={{ 
      width: '32px', height: '32px', borderRadius: '50%', 
      background: active ? 'var(--ashal-red)' : 'white', 
      color: active ? 'white' : '#cbd5e1',
      border: `2px solid ${active ? 'var(--ashal-red)' : '#f1f5f9'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s'
    }}>
      {icon}
    </div>
    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: active ? '#1e293b' : '#cbd5e1' }}>{label}</span>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{label}</span>
    <span style={{ color: '#1e293b', fontWeight: '800' }}>{value}</span>
  </div>
);

const PaymentOption = ({ icon, label, active = false }) => (
  <div style={{ 
    flex: 1, padding: '15px', borderRadius: '20px', border: `2px solid ${active ? 'var(--ashal-red)' : '#f1f5f9'}`,
    background: active ? 'white' : '#f8fafc', textAlign: 'center', cursor: 'pointer'
  }}>
    <div style={{ color: active ? 'var(--ashal-red)' : '#94a3b8', marginBottom: '5px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: active ? '#1e293b' : '#94a3b8' }}>{label}</span>
  </div>
);

export default PaiementAmende;