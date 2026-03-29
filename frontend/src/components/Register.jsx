import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, KeyRound, Phone, CreditCard,
  Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2,
  Signal, Wifi, Battery
} from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Infos, 2: Sécurité, 3: Biométrique, 4: Succès
  const [isScanning, setIsScanning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    nom: '', prenom: '', cin: '', telephone: '', email: '',
    password: '', confirmPassword: ''
  });

  const faceIdIllustration = "https://img.freepik.com/vecteurs-premium/concept-reconnaissance-faciale-pour-authentification-biometrique_199064-1100.jpg?w=826";

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    setStep(3);
  };

  const handleBiometricScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep(4);
    }, 2500);
  };

  const totalSteps = 3;
  const progressWidth = `${(step / totalSteps) * 100}%`;

  return (
    <div className="auth-container dark-theme">
      <div className="app-container">

        {/* Overlay décoratif */}
        <div className="moucharabieh-overlay" />

        {/* Barre d'état */}
        <div style={styles.statusBar}>
          <span style={styles.statusTime}>09:41</span>
          <div style={styles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

        {/* Header avec bouton retour + progress */}
        {step < 4 && (
          <div style={styles.header}>
            <button
              type="button"
              style={styles.backBtn}
              onClick={step === 1 ? () => navigate('/') : () => setStep(step - 1)}
            >
              <ArrowLeft size={20} color="#e2e8f0" />
            </button>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressFill, width: progressWidth }} />
            </div>
            <span style={styles.stepLabel}>{step}/{totalSteps}</span>
          </div>
        )}

        {/* CONTENU SCROLLABLE */}
        <div style={styles.scrollArea}>

          {/* ───── ÉTAPE 1 : INFORMATIONS PERSONNELLES ───── */}
          {step === 1 && (
            <div style={styles.card} className="fade-in">
              <div className="logo-container" style={{ marginBottom: '24px' }}>
                <img src={logoAshel} alt="ASHEL Logo" className="main-logo-img" />
                <p className="app-slogan">SERVICES QUOTIDIENS. SIMPLIFIÉS.</p>
              </div>

              <h2 className="title-text">Créer un compte</h2>
              <p className="subtitle-text">Renseignez vos informations personnelles pour commencer.</p>

              <form onSubmit={handleStep1} style={{ marginTop: '24px' }}>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input
                    type="text" placeholder="Prénom" required
                    value={form.prenom} onChange={handleChange('prenom')}
                  />
                </div>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input
                    type="text" placeholder="Nom de famille" required
                    value={form.nom} onChange={handleChange('nom')}
                  />
                </div>
                <div className="input-with-icon">
                  <CreditCard className="input-icon" size={18} />
                  <input
                    type="text" placeholder="Numéro CIN" required maxLength={8}
                    value={form.cin} onChange={handleChange('cin')}
                  />
                </div>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel" placeholder="Numéro de téléphone" required
                    value={form.telephone} onChange={handleChange('telephone')}
                  />
                </div>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email" placeholder="Adresse email" required
                    value={form.email} onChange={handleChange('email')}
                  />
                </div>
                <button type="submit" className="btn-primary-ashel" style={{ marginTop: '8px' }}>
                  Continuer
                </button>
              </form>

              <button
                type="button"
                className="btn-secondary-ashel"
                style={{ marginTop: '12px' }}
                onClick={() => navigate('/')}
              >
                Déjà inscrit ? Se connecter
              </button>
            </div>
          )}

          {/* ───── ÉTAPE 2 : MOT DE PASSE ───── */}
          {step === 2 && (
            <div style={styles.card} className="fade-in">
              <div style={styles.stepIcon}>
                <KeyRound size={28} color="#0056D2" />
              </div>
              <h2 className="title-text">Sécurisez votre compte</h2>
              <p className="subtitle-text">Choisissez un mot de passe fort pour protéger vos accès.</p>

              <form onSubmit={handleStep2} style={{ marginTop: '28px' }}>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <KeyRound className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mot de passe" required minLength={8}
                    value={form.password} onChange={handleChange('password')}
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                  </button>
                </div>

                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <KeyRound className="input-icon" size={18} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirmer le mot de passe" required
                    value={form.confirmPassword} onChange={handleChange('confirmPassword')}
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeBtn}
                  >
                    {showConfirm ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                  </button>
                </div>

                {/* Indicateur force */}
                <div style={styles.strengthBar}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      ...styles.strengthSegment,
                      background: form.password.length >= i * 2
                        ? i <= 1 ? '#ef4444' : i <= 2 ? '#f97316' : i <= 3 ? '#eab308' : '#22c55e'
                        : 'rgba(255,255,255,0.1)'
                    }} />
                  ))}
                  <span style={styles.strengthLabel}>
                    {form.password.length === 0 ? '' :
                      form.password.length < 4 ? 'Faible' :
                      form.password.length < 6 ? 'Moyen' :
                      form.password.length < 8 ? 'Bien' : 'Fort'}
                  </span>
                </div>

                <button type="submit" className="btn-primary-ashel" style={{ marginTop: '20px' }}>
                  Continuer
                </button>
              </form>
            </div>
          )}

          {/* ───── ÉTAPE 3 : BIOMÉTRIQUE ───── */}
          {step === 3 && (
            <div style={styles.card} className="fade-in">
              <div className="biometric-icon-container">
                <div className={`scan-wrapper ${isScanning ? 'is-scanning' : ''}`}>
                  <img
                    src={faceIdIllustration} alt="Face ID"
                    className={`bio-illustration ${isScanning ? 'pulse-animation' : ''}`}
                  />
                </div>
              </div>

              <h2 className="title-text">
                {isScanning ? 'Enregistrement...' : 'Vérification biométrique'}
              </h2>
              <p className="subtitle-text">
                {isScanning
                  ? 'Veuillez ne pas bouger pendant le traitement.'
                  : 'Enregistrez votre visage pour sécuriser vos futures connexions.'}
              </p>

              {!isScanning && (
                <>
                  <div className="guidelines-list">
                    <p>✓ Éclairage suffisant</p>
                    <p>✓ Visage bien centré</p>
                    <p>✓ Pas de lunettes de soleil</p>
                  </div>
                  <button
                    type="button" className="btn-primary-ashel"
                    onClick={handleBiometricScan}
                    style={{ marginTop: '20px' }}
                  >
                    Démarrer l'enregistrement
                  </button>
                  <button
                    type="button" className="btn-back-ashel"
                    onClick={() => setStep(2)}
                  >
                    Retour
                  </button>
                </>
              )}

              {isScanning && (
                <Loader2 className="animate-spin" size={32} color="var(--ashel-green)" style={{ marginTop: '20px' }} />
              )}
            </div>
          )}

          {/* ───── ÉTAPE 4 : SUCCÈS ───── */}
          {step === 4 && (
            <div style={{ ...styles.card, textAlign: 'center' }} className="fade-in">
              <div style={styles.successCircle}>
                <CheckCircle2 size={48} color="#4ade80" />
              </div>
              <h2 className="title-text" style={{ marginTop: '20px' }}>Compte créé !</h2>
              <p className="subtitle-text">
                Bienvenue, <strong style={{ color: '#0056D2' }}>{form.prenom} {form.nom}</strong>.<br />
                Votre compte gouvernemental est prêt.
              </p>

              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryKey}>CIN</span>
                  <span style={styles.summaryVal}>{form.cin}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryKey}>Email</span>
                  <span style={styles.summaryVal}>{form.email}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryKey}>Téléphone</span>
                  <span style={styles.summaryVal}>{form.telephone}</span>
                </div>
              </div>

              <button
                type="button" className="btn-primary-ashel"
                style={{ marginTop: '24px' }}
                onClick={() => navigate('/')}
              >
                Se connecter maintenant
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        /* Mode jour */
        .auth-container.dark-theme {
          background: #f1f5f9;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .app-container {
          width: 390px;
          height: 844px;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25);
          border-radius: 50px;
          border: 4px solid #334155;
        }

        .logo-container { display: flex; flex-direction: column; align-items: center; }
        .main-logo-img { width: 80px; margin-bottom: 8px; }
        .app-slogan { font-size: 9px; font-weight: 900; color: #0056D2; letter-spacing: 2px; }

        .title-text { font-size: 1.5rem; font-weight: 900; color: #1e293b; margin: 12px 0 6px; }
        .subtitle-text { font-size: 0.85rem; color: #64748b; line-height: 1.5; }

        .input-with-icon { position: relative; margin-bottom: 14px; }
        .input-with-icon .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .input-with-icon input {
          width: 100%; padding: 15px 16px 15px 46px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px; color: #1e293b; font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        .input-with-icon input:focus { outline: none; border-color: #0056D2; }
        .input-with-icon input::placeholder { color: #94a3b8; }

        .btn-primary-ashel {
          width: 100%; padding: 16px; border-radius: 16px; border: none;
          background: #1e293b;
          color: #ffffff; font-weight: 900; font-size: 0.95rem; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 8px 20px rgba(30,41,59,0.2);
        }
        .btn-primary-ashel:hover { transform: translateY(-2px); background: #0056D2; box-shadow: 0 12px 24px rgba(0,86,210,0.25); }

        .btn-secondary-ashel {
          width: 100%; padding: 14px; border-radius: 16px;
          background: transparent; border: 1.5px solid #e2e8f0;
          color: #64748b; font-weight: 600; font-size: 0.85rem; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary-ashel:hover { border-color: #0056D2; color: #0056D2; }

        .btn-back-ashel {
          width: 100%; padding: 12px; border-radius: 16px; margin-top: 12px;
          background: transparent; border: none; color: #94a3b8;
          font-weight: 600; cursor: pointer;
        }

        .biometric-icon-container { display: flex; justify-content: center; margin-bottom: 20px; }
        .scan-wrapper { width: 160px; height: 160px; border-radius: 50%; overflow: hidden; border: 3px solid #e2e8f0; }
        .scan-wrapper.is-scanning { border-color: #0056D2; box-shadow: 0 0 0 8px rgba(0,86,210,0.08); }
        .bio-illustration { width: 100%; height: 100%; object-fit: cover; }
        .pulse-animation { animation: pulse 1s ease-in-out infinite alternate; }
        @keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }

        .guidelines-list { margin: 16px 0; }
        .guidelines-list p { font-size: 0.82rem; color: #0056D2; margin-bottom: 6px; font-weight: 600; }

        .animate-spin { animation: spin 1s linear infinite; display: block; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .moucharabieh-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("https://www.transparenttextures.com/patterns/arabesque.png");
          opacity: 0.02; pointer-events: none; z-index: 0;
        }
      `}</style>
    </div>
  );
};

// Styles JS pour les éléments non couverts par les classes CSS
const styles = {
  statusBar: {
    height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 30px', color: '#64748b', position: 'relative', zIndex: 2, flexShrink: 0
  },
  statusTime: { fontWeight: '700', fontSize: '13px', color: '#1e293b' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },

  header: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '8px 20px 12px', position: 'relative', zIndex: 2, flexShrink: 0
  },
  backBtn: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#f1f5f9', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0
  },
  progressContainer: {
    flex: 1, height: '4px', background: '#e2e8f0',
    borderRadius: '10px', overflow: 'hidden'
  },
  progressFill: {
    height: '100%', background: 'linear-gradient(90deg, #0056D2, #1e293b)',
    borderRadius: '10px', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)'
  },
  stepLabel: { fontSize: '11px', fontWeight: '800', color: '#0056D2', flexShrink: 0 },

  scrollArea: {
    flex: 1, overflowY: 'auto', padding: '10px 24px 24px',
    position: 'relative', zIndex: 2,
    scrollbarWidth: 'none'
  },

  card: { paddingTop: '8px' },

  stepIcon: {
    width: '60px', height: '60px', borderRadius: '20px',
    background: '#eff6ff', border: '1px solid #bfdbfe',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
  },

  eyeBtn: {
    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
  },

  strengthBar: {
    display: 'flex', gap: '6px', alignItems: 'center', marginTop: '10px'
  },
  strengthSegment: {
    flex: 1, height: '4px', borderRadius: '10px', transition: 'background 0.3s'
  },
  strengthLabel: { fontSize: '10px', fontWeight: '700', color: '#64748b', minWidth: '30px' },

  successCircle: {
    width: '90px', height: '90px', borderRadius: '50%',
    background: '#eff6ff', border: '2px solid #bfdbfe',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px auto 0'
  },

  summaryBox: {
    background: '#f8fafc', borderRadius: '16px',
    border: '1px solid #e2e8f0', padding: '16px', marginTop: '20px'
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #f1f5f9'
  },
  summaryKey: { fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' },
  summaryVal: { fontSize: '12px', color: '#1e293b', fontWeight: '600' },
};

export default RegisterForm;