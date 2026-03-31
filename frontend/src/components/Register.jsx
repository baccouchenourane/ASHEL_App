import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, KeyRound, Phone, CreditCard,
  Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2,
  Signal, Wifi, Battery, AlertCircle
} from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    nom: '', prenom: '', cin: '', telephone: '', email: '',
    password: '', confirmPassword: ''
  });

  const faceIdIllustration = "https://img.freepik.com/vecteurs-premium/concept-reconnaissance-faciale-pour-authentification-biometrique_199064-1100.jpg?w=826";

  const handleChange = (field) => (e) => {
    setError("");
    setForm({ ...form, [field]: e.target.value });
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setStep(3);
  };

  // Logique d'inscription et redirection
  const handleBiometricScan = async () => {
    setIsScanning(true);
    setError("");
    
    setTimeout(async () => {
      try {
        setIsScanning(false);
        setLoading(true);

        // Appel au Backend Spring Boot
        const response = await axios.post("http://localhost:8081/api/auth/register", {
          cin: form.cin,
          nom: `${form.prenom} ${form.nom}`,
          password: form.password,
          phone: form.telephone
        });

        // Stockage des infos pour la page OTP
        localStorage.setItem("userCIN", form.cin);
        localStorage.setItem("userIdentifier", form.email || form.telephone);
        
        setLoading(false);
        setStep(4);

        // REDIRECTION AUTOMATIQUE après 1.5 seconde
        setTimeout(() => {
          navigate('/verify-otp');
        }, 1500);

      } catch (err) {
        setIsScanning(false);
        setLoading(false);
        setError(err.response?.data?.error || "Erreur de connexion au serveur.");
        setStep(1); // Retour au début pour correction
      }
    }, 2500);
  };
  const handleFinalStep = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Préparation des données pour correspondre à ton backend
  const userData = {
    cin: form.cin,
    nom: `${form.nom} ${form.prenom}`, // On combine nom et prénom pour le champ 'nom' du backend
    password: form.password,
    phone: form.telephone // On mappe 'telephone' vers 'phone' attendu par l'API
  };

  try {
    const response = await axios.post("http://localhost:8081/api/auth/register", userData);
    
    if (response.data) {
      // On stocke les infos temporairement pour l'étape OTP
      localStorage.setItem("pending_cin", form.cin);
      localStorage.setItem("pending_user", JSON.stringify(userData)); 
      
      setStep(4); // Passe à l'étape de succès ou redirection
      setTimeout(() => navigate("/verify-otp"), 2000);
    }
  } catch (err) {
    // Affiche l'erreur précise du backend s'il y en a une
    setError(err.response?.data?.message || "Erreur lors de la création du compte.");
  } finally {
    setLoading(false);
  }
};

  const totalSteps = 3;
  const progressWidth = `${(step / totalSteps) * 100}%`;

  return (
    <div className="auth-container dark-theme">
      <div className="app-container">
        <div className="moucharabieh-overlay" />

        {/* Barre d'état (iPhone Style) */}
        <div style={styles.statusBar}>
          <span style={styles.statusTime}>09:41</span>
          <div style={styles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

        {/* Header avec bouton retour */}
        {step < 4 && (
          <div style={styles.header}>
            <button
              type="button"
              style={styles.backBtn}
              onClick={step === 1 ? () => navigate('/') : () => setStep(step - 1)}
            >
              <ArrowLeft size={20} color="#1e293b" />
            </button>
            <div style={styles.progressContainer}>
              <div style={{ ...styles.progressFill, width: progressWidth }} />
            </div>
            <span style={styles.stepLabel}>{step}/{totalSteps}</span>
          </div>
        )}

        <div style={styles.scrollArea}>
          
          {error && (
            <div style={styles.errorBanner} className="fade-in">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* ÉTAPE 1 : INFOS PERSONNELLES */}
          {step === 1 && (
            <div style={styles.card} className="fade-in">
              <div className="logo-container" style={{ marginBottom: '24px' }}>
                <img src={logoAshel} alt="ASHEL Logo" className="main-logo-img" />
                <p className="app-slogan">SERVICES QUOTIDIENS. SIMPLIFIÉS.</p>
              </div>
              <h2 className="title-text">Créer un compte</h2>
              <p className="subtitle-text">Identité numérique sécurisée.</p>

              <form onSubmit={handleStep1} style={{ marginTop: '24px' }}>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input type="text" placeholder="Prénom" required value={form.prenom} onChange={handleChange('prenom')} />
                </div>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input type="text" placeholder="Nom" required value={form.nom} onChange={handleChange('nom')} />
                </div>
                <div className="input-with-icon">
                  <CreditCard className="input-icon" size={18} />
                  <input type="text" placeholder="Numéro CIN" required maxLength={8} value={form.cin} onChange={handleChange('cin')} />
                </div>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={18} />
                  <input type="tel" placeholder="Téléphone" required value={form.telephone} onChange={handleChange('telephone')} />
                </div>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={18} />
                  <input type="email" placeholder="Email" required value={form.email} onChange={handleChange('email')} />
                </div>
                <button type="submit" className="btn-primary-ashel">Continuer</button>
              </form>
            </div>
          )}

          {/* ÉTAPE 2 : MOT DE PASSE */}
          {step === 2 && (
            <div style={styles.card} className="fade-in">
              <div style={styles.stepIcon}><KeyRound size={28} color="#0056D2" /></div>
              <h2 className="title-text">Sécurité</h2>
              <p className="subtitle-text">Choisissez un mot de passe robuste.</p>
              <form onSubmit={handleStep2} style={{ marginTop: '28px' }}>
                <div className="input-with-icon">
                  <KeyRound className="input-icon" size={18} />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Mot de passe" required minLength={8} value={form.password} onChange={handleChange('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                  </button>
                </div>
                <div className="input-with-icon">
                  <KeyRound className="input-icon" size={18} />
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmer" required value={form.confirmPassword} onChange={handleChange('confirmPassword')} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    {showConfirm ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                  </button>
                </div>
                <button type="submit" className="btn-primary-ashel">Finaliser</button>
              </form>
            </div>
          )}

          {/* ÉTAPE 3 : BIOMÉTRIE (SCAN) */}
          {step === 3 && (
            <div style={styles.card} className="fade-in">
              <div className="biometric-icon-container">
                <div className={`scan-wrapper ${isScanning ? 'is-scanning' : ''}`}>
                  <img src={faceIdIllustration} alt="Face ID" className={`bio-illustration ${isScanning ? 'pulse-animation' : ''}`} />
                </div>
              </div>
              <h2 className="title-text">{isScanning ? 'Analyse faciale...' : 'Biométrie'}</h2>
              {!isScanning && !loading && (
                <>
                  <p className="subtitle-text" style={{textAlign: 'center'}}>Enregistrez votre visage pour activer l'accès rapide.</p>
                  <button type="button" className="btn-primary-ashel" style={{marginTop: '20px'}} onClick={handleBiometricScan}>Activer Face ID</button>
                </>
              )}
              {(isScanning || loading) && <Loader2 className="animate-spin" size={32} color="#0056D2" style={{marginTop: '20px'}} />}
            </div>
          )}

          {/* ÉTAPE 4 : SUCCÈS & REDIRECTION */}
          {step === 4 && (
            <div style={{ ...styles.card, textAlign: 'center' }} className="fade-in">
              <div style={styles.successCircle}><CheckCircle2 size={48} color="#4ade80" /></div>
              <h2 className="title-text" style={{ marginTop: '20px' }}>Compte prêt !</h2>
              <p className="subtitle-text">Inscription terminée.<br/>Vérification OTP en cours...</p>
              <div className="loading-dots" style={{marginTop: '10px'}}>
                <Loader2 className="animate-spin" size={20} color="#0056D2" />
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .auth-container.dark-theme { background: #f1f5f9; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
        .app-container { width: 390px; height: 844px; background: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); border-radius: 50px; border: 4px solid #334155; }
        .logo-container { display: flex; flex-direction: column; align-items: center; }
        .main-logo-img { width: 80px; margin-bottom: 8px; }
        .app-slogan { font-size: 9px; font-weight: 900; color: #0056D2; letter-spacing: 2px; }
        .title-text { font-size: 1.5rem; font-weight: 900; color: #1e293b; margin: 12px 0 6px; }
        .subtitle-text { font-size: 0.85rem; color: #64748b; line-height: 1.5; }
        .input-with-icon { position: relative; margin-bottom: 14px; }
        .input-with-icon .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .input-with-icon input { width: 100%; padding: 15px 16px 15px 46px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; color: #1e293b; font-size: 0.9rem; transition: 0.2s; }
        .input-with-icon input:focus { border-color: #0056D2; outline: none; background: white; }
        .btn-primary-ashel { width: 100%; padding: 16px; border-radius: 16px; border: none; background: #1e293b; color: #white; font-weight: 900; cursor: pointer; margin-top: 10px; color: white; transition: 0.3s; }
        .btn-primary-ashel:hover { background: #0056D2; transform: scale(1.02); }
        .scan-wrapper { width: 160px; height: 160px; border-radius: 50%; overflow: hidden; border: 3px solid #e2e8f0; margin: 0 auto; }
        .scan-wrapper.is-scanning { border-color: #0056D2; box-shadow: 0 0 20px rgba(0,86,210,0.2); }
        .bio-illustration { width: 100%; height: 100%; object-fit: cover; }
        .pulse-animation { animation: pulse 1s ease-in-out infinite alternate; }
        @keyframes pulse { from { opacity: 0.6; } to { opacity: 1; } }
        .animate-spin { animation: spin 1s linear infinite; display: block; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .moucharabieh-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url("https://www.transparenttextures.com/patterns/arabesque.png"); opacity: 0.02; pointer-events: none; }
      `}</style>
    </div>
  );
};

const styles = {
  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', color: '#64748b' },
  statusTime: { fontWeight: '700', fontSize: '13px', color: '#1e293b' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 20px 12px' },
  backBtn: { width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  progressContainer: { flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #0056D2, #1e293b)', transition: '0.4s' },
  stepLabel: { fontSize: '11px', fontWeight: '800', color: '#0056D2' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '10px 24px 24px' },
  stepIcon: { width: '60px', height: '60px', borderRadius: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  eyeBtn: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' },
  successCircle: { width: '90px', height: '90px', borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' },
  errorBanner: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: '600' }
};

export default RegisterForm;