import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ShieldCheck, Lock, CreditCard,
  CheckCircle2, Zap, Droplets, Wifi, ShieldAlert, GraduationCap,
  Building2, Banknote, Smartphone, Check
} from 'lucide-react';
import { paiementAPI, getCin } from '../services/api';

// ─── CONFIG FACTURES (pour l'affichage) ─────────────────────────────────────
const factureInfo = {
  electricite: { label: 'Facture STEG', color: '#f59e0b', Icon: Zap },
  eau:         { label: 'Facture SONEDE', color: '#0ea5e9', Icon: Droplets },
  wifi:        { label: 'Facture Tunisie Telecom', color: '#8b5cf6', Icon: Wifi },
  etude:       { label: "Frais d'Inscription", color: '#8b5cf6', Icon: GraduationCap },
  amende:      { label: 'Amende', color: '#e11d48', Icon: ShieldAlert },
};

// ─── MÉTHODES DE PAIEMENT ─────────────────────────────────────────────────────
const METHODES = [
  { id: 'carte',    label: 'Carte bancaire',       sousTitre: 'Visa / Mastercard / CIB',       icon: CreditCard, color: '#0056D2', bg: '#eff6ff' },
  { id: 'edinar',   label: 'E-Dinar',              sousTitre: 'Porte-monnaie électronique',    icon: Smartphone, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'virement', label: 'Virement bancaire',    sousTitre: 'STB / BNA / Attijari / BIAT',  icon: Building2,  color: '#059669', bg: '#f0fdf4' },
  { id: 'poste',    label: 'La Poste Tunisienne',  sousTitre: 'Paiement en espèces / CCP',    icon: Banknote,   color: '#ea580c', bg: '#fff7ed' },
];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
const PaiementFacture = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const config = factureInfo[type] || factureInfo['electricite'];

  const [methode, setMethode]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');
  const [recu, setRecu]             = useState(null);
  const [facture, setFacture]       = useState(null); // Stocker la vraie facture du backend
  const [chargementFacture, setChargementFacture] = useState(true);
  
  // États pour les formulaires
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry]         = useState('');
  const [cvv, setCvv]               = useState('');
  const [phone, setPhone]           = useState('');
  const [rib, setRib]               = useState('');

  // Charger la facture depuis le backend au chargement
  useEffect(() => {
    const chargerFacture = async () => {
      const cin = getCin();
      if (!cin) {
        navigate('/');
        return;
      }

      try {
        setChargementFacture(true);
        // Récupérer les factures de l'utilisateur
        const factures = await paiementAPI.getFactures(cin);
        
        // Trouver une facture du type correspondant
        let factureTrouvee = null;
        
        // Mapping des types frontend vers backend
        const typeMapping = {
          electricite: 'ELECTRICITE',
          eau: 'EAU',
          wifi: 'INTERNET',
          etude: 'ETUDE',
          amende: 'AMENDE'
        };
        
        const backendType = typeMapping[type] || type.toUpperCase();
        
        // Chercher une facture non payée du bon type
        factureTrouvee = factures.find(
          f => f.type === backendType && f.statut !== 'PAYEE'
        );
        
        if (factureTrouvee) {
          setFacture(factureTrouvee);
        } else {
          setError(`Aucune facture ${config.label} trouvée à payer`);
        }
      } catch (err) {
        console.error('Erreur chargement facture:', err);
        setError('Impossible de charger les factures');
      } finally {
        setChargementFacture(false);
      }
    };

    chargerFacture();
  }, [type, navigate, config.label]);

const handlePay = async () => {
    if (cardNumber.length < 19 || cardHolder.trim() === '' || expiry.length < 5 || cvv.length < 3) {
      alert('Veuillez remplir correctement les informations de votre carte.');
      return;
    }

    setLoading(true);

    try {
      // Nettoyage du montant pour le transformer en Double Java
      const montantNumerique = parseFloat(facture.total);
      const methode = paymentType.toUpperCase();

      // ÉTAPE A : Initier le paiement
      const initiation = await paiementAPI.initierPaiement(
        facture.ref,
        methode,
        montantNumerique
      );

      // ÉTAPE B : Confirmer le paiement
      await paiementAPI.confirmerPaiement(initiation.numeroTransaction);

      setStep('success');

    } catch (err) {
      // GESTION SPÉCIFIQUE : Si la facture est déjà payée, on traite ça comme un succès
      if (err.message.includes("déjà effectué") || err.message.includes("déjà payée")) {
        setStep('success');
      } else {
        console.error("Erreur de paiement:", err);
        alert(err.message || "Le paiement a échoué.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Affichage du chargement
  if (chargementFacture) {
    return (
      <div style={wrapper}>
        <div className="app-container" style={{ background: '#f4f7fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <p>Chargement de la facture...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success && recu) {
    return <SuccessView navigate={navigate} recu={recu} label={config.label} />;
  }

  return (
    <div style={wrapper}>
      <div className="app-container" style={{ background: '#f4f7fe' }}>
        <div className="moucharabieh-overlay" />

        {/* HEADER FIXE */}
        <div style={s.topBar}>
          <div onClick={() => navigate(-1)} style={s.backBtn}>
            <ArrowLeft size={18} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#059669" />
            <span style={s.secureLabel}>PAIEMENT SÉCURISÉ</span>
          </div>
          <div style={{ width: '38px' }} />
        </div>

        {/* ZONE SCROLLABLE */}
        <div className="page-content" style={{ padding: '20px', paddingBottom: '40px' }}>

          {/* MONTANT - Utiliser les vraies données */}
          <div style={{ textAlign: 'center', margin: '20px 0 28px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
              <config.Icon size={16} color={config.color} />
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0, fontWeight: '700' }}>{config.label}</p>
            </div>
            <h1 style={{ fontSize: '2.6rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>
              {facture ? facture.montant.toFixed(3) : '0.000'} <span style={{ fontSize: '1rem', fontWeight: '600' }}>DT</span>
            </h1>
            {facture && (
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px' }}>
                Réf: {facture.reference}
              </p>
            )}
          </div>

          {/* AFFICHAGE ERREUR */}
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '14px', padding: '12px', marginBottom: '20px' }}>
              <p style={{ margin: 0, color: '#dc2626', fontSize: '0.8rem', fontWeight: '600' }}>{error}</p>
            </div>
          )}

          {/* SÉLECTION MÉTHODE */}
          <h4 style={s.sectionTitle}>CHOISIR UN MOYEN DE PAIEMENT</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {METHODES.map((m) => {
              const MIcon = m.icon;
              const isSelected = methode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setMethode(m.id);
                    setError('');
                  }}
                  style={{
                    ...s.methodeCard,
                    border: isSelected ? `2px solid ${m.color}` : '2px solid #e2e8f0',
                    background: isSelected ? m.bg : 'white',
                  }}
                >
                  <div style={{ ...s.methodeIcon, background: m.bg, color: m.color }}>
                    <MIcon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '0.88rem', color: '#1e293b' }}>{m.label}</p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600' }}>{m.sousTitre}</p>
                  </div>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: isSelected ? 'none' : '2px solid #cbd5e1',
                    background: isSelected ? m.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {isSelected && <Check size={12} color="white" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FORMULAIRES */}
          {methode === 'carte' && (
            <FormulaireCarte
              cardNumber={cardNumber} setCardNumber={setCardNumber}
              expiry={expiry} setExpiry={setExpiry}
              cvv={cvv} setCvv={setCvv}
              loading={loading} handlePay={handlePay}
            />
          )}
          {methode === 'edinar' && (
            <FormulaireEDinar phone={phone} setPhone={setPhone} loading={loading} handlePay={handlePay} />
          )}
          {methode === 'virement' && (
            <FormulaireVirement rib={rib} setRib={setRib} loading={loading} handlePay={handlePay} montant={facture?.montant || 0} />
          )}
          {methode === 'poste' && (
            <FormulairePoste loading={loading} handlePay={handlePay} montant={facture?.montant || 0} />
          )}

          {/* LOGOS */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px', opacity: 0.35 }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width="36" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" width="28" />
            <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '0.5px' }}>MONÉTIQUE TUNISIE</span>
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
        .spinner { width: 20px; height: 20px; border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #0056D2; animation: spin 0.8s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ─── FORMULAIRE CARTE ─────────────────────────────────────────────────────────
const FormulaireCarte = ({ cardNumber, setCardNumber, expiry, setExpiry, cvv, setCvv, loading, handlePay }) => (
  <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={s.cardVisual}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ width: '42px', height: '30px', background: '#fbbf24', borderRadius: '5px', opacity: 0.85 }} />
        <CreditCard size={26} opacity={0.4} />
      </div>
      <p style={{ fontSize: '1.1rem', letterSpacing: '3px', marginBottom: '16px', fontWeight: '700' }}>
        {cardNumber ? cardNumber.padEnd(16, '•').replace(/(.{4})/g, '$1 ') : '•••• •••• •••• ••••'}
      </p>
      <div style={{ display: 'flex', gap: '20px', fontSize: '0.65rem', opacity: 0.6 }}>
        <span>EXP: {expiry || 'MM/YY'}</span>
        <span>CVV: •••</span>
      </div>
    </div>
    <div>
      <label style={s.label}>Numéro de carte</label>
      <input type="text" maxLength="16" minLength="16" placeholder="4000 1234 5678 9012"
        value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
        style={s.input} required />
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ flex: 1 }}>
        <label style={s.label}>Expiration</label>
        <input type="text" placeholder="MM/YY" maxLength="5" value={expiry}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
            setExpiry(v);
          }}
          style={s.input} required />
      </div>
      <div style={{ flex: 1 }}>
        <label style={s.label}>Code CVV</label>
        <input type="password" placeholder="123" maxLength="3"
          value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
          style={s.input} required />
      </div>
    </div>
    <button type="submit" disabled={loading} style={s.payBtn}>
      {loading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : <><Lock size={16} /> CONFIRMER LE PAIEMENT</>}
    </button>
  </form>
);

// ─── FORMULAIRE E-DINAR ───────────────────────────────────────────────────────
const FormulaireEDinar = ({ phone, setPhone, loading, handlePay }) => (
  <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={s.infoBox}>
      <Smartphone size={16} color="#8b5cf6" />
      <p style={{ margin: 0, fontSize: '0.78rem', color: '#4c1d95', fontWeight: '700' }}>
        Un code OTP sera envoyé sur votre numéro pour confirmer le paiement.
      </p>
    </div>
    <div>
      <label style={s.label}>Numéro de téléphone</label>
      <input type="tel" placeholder="2X XXX XXX" maxLength="8"
        value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        style={s.input} required />
    </div>
    <div>
      <label style={s.label}>Code PIN E-Dinar</label>
      <input type="password" placeholder="••••" maxLength="4" style={s.input} required />
    </div>
    <button type="submit" disabled={loading} style={{ ...s.payBtn, background: '#8b5cf6', boxShadow: '0 10px 15px -3px rgba(139,92,246,0.3)' }}>
      {loading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : <><Lock size={16} /> PAYER AVEC E-DINAR</>}
    </button>
  </form>
);

// ─── FORMULAIRE VIREMENT ──────────────────────────────────────────────────────
const FormulaireVirement = ({ rib, setRib, loading, handlePay, montant }) => (
  <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={s.infoBox}>
      <Building2 size={16} color="#059669" />
      <p style={{ margin: 0, fontSize: '0.78rem', color: '#065f46', fontWeight: '700' }}>
        Effectuez un virement vers le RIB ci-dessous et confirmez en entrant votre RIB source.
      </p>
    </div>
    <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '14px 16px', border: '1px solid #bbf7d0' }}>
      <p style={{ margin: 0, fontSize: '0.6rem', color: '#059669', fontWeight: '900', letterSpacing: '1px', marginBottom: '4px' }}>RIB DESTINATAIRE</p>
      <p style={{ margin: 0, fontWeight: '900', fontSize: '0.85rem', color: '#1e293b', letterSpacing: '1.5px' }}>17 001 0000 1234567890 28</p>
      <p style={{ margin: '4px 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>Société de Recouvrement — Tunisie</p>
    </div>
    <div>
      <label style={s.label}>Montant à virer</label>
      <input type="text" value={`${montant.toFixed(3)} DT`} style={{ ...s.input, background: '#f8fafc', color: '#64748b' }} readOnly />
    </div>
    <div>
      <label style={s.label}>Votre RIB (banque source)</label>
      <input type="text" placeholder="17 XXX XXXX XXXXXXXXXX XX" maxLength="23"
        value={rib} onChange={(e) => setRib(e.target.value)} style={s.input} required />
    </div>
    <button type="submit" disabled={loading} style={{ ...s.payBtn, background: '#059669', boxShadow: '0 10px 15px -3px rgba(5,150,105,0.3)' }}>
      {loading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : <><Check size={16} /> CONFIRMER LE VIREMENT</>}
    </button>
  </form>
);

// ─── FORMULAIRE POSTE ─────────────────────────────────────────────────────────
const FormulairePoste = ({ loading, handlePay, montant }) => (
  <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
    <div style={{ ...s.infoBox, background: '#fff7ed', borderColor: '#fed7aa' }}>
      <Banknote size={16} color="#ea580c" />
      <p style={{ margin: 0, fontSize: '0.78rem', color: '#9a3412', fontWeight: '700' }}>
        Présentez-vous dans n'importe quel bureau de poste avec votre référence de facture.
      </p>
    </div>
    <div style={{ background: 'white', borderRadius: '18px', padding: '18px', border: '1px dashed #e2e8f0', textAlign: 'center' }}>
      <p style={{ margin: '0 0 4px 0', fontSize: '0.6rem', color: '#94a3b8', fontWeight: '900', letterSpacing: '1px' }}>RÉFÉRENCE DE PAIEMENT</p>
      <p style={{ margin: '0 0 12px 0', fontSize: '1.4rem', fontWeight: '900', color: '#1e293b', letterSpacing: '3px' }}>PT-2026-4821</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.75rem', color: '#64748b' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.55rem', color: '#94a3b8', fontWeight: '800' }}>MONTANT</p>
          <p style={{ margin: 0, fontWeight: '900', color: '#ea580c' }}>{montant.toFixed(3)} DT</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.55rem', color: '#94a3b8', fontWeight: '800' }}>EXPIRE LE</p>
          <p style={{ margin: 0, fontWeight: '800' }}>07 Avril 2026</p>
        </div>
      </div>
    </div>
    <div>
      <label style={s.label}>Numéro CCP (optionnel)</label>
      <input type="text" placeholder="XXXXXXXX Clé XX" style={s.input} />
    </div>
    <button type="submit" disabled={loading} style={{ ...s.payBtn, background: '#ea580c', boxShadow: '0 10px 15px -3px rgba(234,88,12,0.3)' }}>
      {loading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : <><CheckCircle2 size={16} /> GÉNÉRER LE REÇU DE PAIEMENT</>}
    </button>
  </form>
);

// ─── PAGE SUCCÈS ─────────────────────────────────────────────────────────────
const SuccessView = ({ navigate, recu, label }) => (
  <div style={wrapper}>
    <div className="app-container" style={{ background: 'white' }}>
      <div className="moucharabieh-overlay" />
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
          <CheckCircle2 size={50} color="#059669" />
        </div>
        <h1 style={{ fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>Paiement Terminé !</h1>
        <p style={{ color: '#64748b', marginBottom: '6px', fontWeight: '700' }}>{label} réglée avec succès.</p>
        
        {/* Affichage des infos du reçu */}
        {recu && (
          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', margin: '20px 0', width: '100%', textAlign: 'left' }}>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Transaction:</strong> {recu.numeroTransaction}</p>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Référence facture:</strong> {recu.referenceFacture}</p>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Montant:</strong> {recu.montant} DT</p>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Méthode:</strong> {recu.methodePaiement}</p>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Date:</strong> {new Date(recu.datePaiement).toLocaleString()}</p>
          </div>
        )}
        
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '40px' }}>Votre transaction a été approuvée par Monétique Tunisie.</p>
        <button onClick={() => navigate('/paiement')} className="btn-ashal-primary" style={{ maxWidth: '300px', width: '100%' }}>
          RETOUR AUX PAIEMENTS
        </button>
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
          opacity: 0.02; pointer-events: none; z-index: 0;
        }
        .page-content { flex: 1; overflow-y: auto; position: relative; z-index: 1; }
        .btn-ashal-primary { background: #1e293b; color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 900; font-size: 0.9rem; cursor: pointer; }
      `}</style>
    </div>
  </div>
);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const wrapper = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0' };

const s = {
  topBar:       { padding: '20px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #e2e8f0', position: 'relative', zIndex: 10, flexShrink: 0 },
  backBtn:      { background: '#f1f5f9', padding: '9px', borderRadius: '12px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  secureLabel:  { fontSize: '0.75rem', fontWeight: '900', color: '#1e293b' },
  sectionTitle: { fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1.5px', marginBottom: '12px', textTransform: 'uppercase' },
  methodeCard:  { background: 'white', padding: '14px 16px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.15s ease' },
  methodeIcon:  { padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardVisual:   { background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '20px', padding: '22px', color: 'white', boxShadow: '0 15px 25px rgba(0,0,0,0.12)', marginBottom: '10px' },
  infoBox:      { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' },
  input:        { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', background: 'white', boxSizing: 'border-box', fontFamily: 'sans-serif' },
  label:        { fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '7px', display: 'block', marginLeft: '3px' },
  payBtn:       { marginTop: '8px', backgroundColor: '#0056D2', color: 'white', border: 'none', borderRadius: '14px', padding: '16px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(0,86,210,0.3)', width: '100%' },
};

export default PaiementFacture;