import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, KeyRound, Phone, CreditCard,
  Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2,
  Signal, Wifi, Battery, AlertCircle, Camera, ScanFace,
  Fingerprint, Shield, Zap, Activity
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
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const [scanAttempts, setScanAttempts] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectedFeatures, setDetectedFeatures] = useState({
    eyes: false,
    nose: false,
    mouth: false,
    quality: 0
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [form, setForm] = useState({
    nom: '', prenom: '', cin: '', telephone: '', email: '',
    password: '', confirmPassword: ''
  });

  const faceIdIllustration = "https://img.freeimg.fr/vecteurs-premium/concept-reconnaissance-faciale-pour-authentification-biometrique_199064-1100.jpg?w=826";

  const handleChange = (field) => (e) => {
    setError("");
    setForm({ ...form, [field]: e.target.value });
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (form.cin.length !== 8) {
      setError('Le numéro CIN doit contenir 8 chiffres.');
      return;
    }
    if (form.telephone.length < 8) {
      setError('Numéro de téléphone invalide.');
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setStep(3);
  };

  // Simulation réaliste de scan biométrique
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        startFaceDetection();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
      simulateBiometricScan();
    }
  };

  const startFaceDetection = () => {
    const detectFace = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simulation de détection faciale réaliste
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Détection simulée basée sur les couleurs et positions
        const skinToneDetected = analyzeSkinTone(imageData);
        const eyesDetected = detectEyes(imageData, centerX, centerY);
        const faceCentered = checkFaceCentering(centerX, centerY, canvas.width, canvas.height);
        
        setDetectedFeatures({
          eyes: eyesDetected,
          nose: skinToneDetected,
          mouth: skinToneDetected,
          quality: Math.min(100, (eyesDetected ? 30 : 0) + (skinToneDetected ? 30 : 0) + (faceCentered ? 40 : 0))
        });
        
        if (scanProgress < 100 && scanStatus !== 'completed') {
          animationRef.current = requestAnimationFrame(detectFace);
        }
      } else {
        animationRef.current = requestAnimationFrame(detectFace);
      }
    };
    
    detectFace();
  };

  const analyzeSkinTone = (imageData) => {
    // Simulation simple de détection de tons de peau
    let skinPixelCount = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      // Vérification approximative des tons de peau
      if (r > 60 && g > 40 && b > 20 && Math.abs(r - g) < 40 && Math.abs(r - b) < 40) {
        skinPixelCount++;
      }
    }
    return skinPixelCount > 1000;
  };

  const detectEyes = (imageData, centerX, centerY) => {
    // Simulation de détection des yeux basée sur la luminosité
    const eyeRegionSize = 50;
    let darkPixelCount = 0;
    
    for (let y = centerY - eyeRegionSize; y < centerY + eyeRegionSize; y += 10) {
      for (let x = centerX - eyeRegionSize; x < centerX + eyeRegionSize; x += 10) {
        const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
        if (imageData.data[index] < 100 && imageData.data[index + 1] < 100 && imageData.data[index + 2] < 100) {
          darkPixelCount++;
        }
      }
    }
    return darkPixelCount > 20;
  };

  const checkFaceCentering = (centerX, centerY, width, height) => {
    const isCentered = Math.abs(centerX - width/2) < width/4 && Math.abs(centerY - height/2) < height/4;
    return isCentered;
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCameraActive(false);
  };

  const simulateBiometricScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStatus('initialisation');
    setScanAttempts(prev => prev + 1);
    
    const scanPhases = [
      { progress: 20, status: 'Analyse faciale en cours...', duration: 800 },
      { progress: 45, status: 'Extraction des traits biométriques...', duration: 600 },
      { progress: 70, status: 'Vérification de l\'unicité...', duration: 500 },
      { progress: 90, status: 'Cryptage des données...', duration: 400 },
      { progress: 100, status: 'Enregistrement terminé ✓', duration: 300 }
    ];
    
    let currentPhase = 0;
    
    const updateScan = () => {
      if (currentPhase < scanPhases.length) {
        const phase = scanPhases[currentPhase];
        setScanProgress(phase.progress);
        setScanStatus(phase.status);
        currentPhase++;
        setTimeout(updateScan, phase.duration);
      } else {
        setTimeout(() => {
          completeBiometricRegistration();
        }, 500);
      }
    };
    
    updateScan();
  };

  const completeBiometricRegistration = async () => {
    setLoading(true);
    
    try {
      // Sauvegarde des données biométriques simulées
      const biometricData = {
        faceId: `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        scanQuality: Math.floor(Math.random() * 20) + 80,
        timestamp: new Date().toISOString(),
        attempts: scanAttempts + 1,
        deviceInfo: navigator.userAgent,
        features: detectedFeatures
      };
      
      localStorage.setItem('biometric_data', JSON.stringify(biometricData));
      
      // Appel au Backend
      await axios.post("http://localhost:8081/api/auth/register", {
        cin: form.cin,
        nom: `${form.prenom} ${form.nom}`,
        password: form.password,
        phone: form.telephone,
        biometricId: biometricData.faceId
      });

      localStorage.setItem("user_ashel", JSON.stringify({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        cin: form.cin,
        biometricEnabled: true,
        biometricId: biometricData.faceId,
        dateInscription: new Date().toLocaleDateString('fr-TN'),
        adresse: "",
        ville: "",
        profession: "",
        genre: ""
      }));

      localStorage.setItem("userCIN", form.cin);
      localStorage.setItem("userIdentifier", form.email || form.telephone);
      
      setLoading(false);
      setStep(4);

      setTimeout(() => {
        navigate('/verify-otp');
      }, 2000);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement biométrique.");
      setStep(1);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      stopCamera();
    }
  };

  const handleBiometricScan = async () => {
    setError("");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      await startCamera();
      simulateBiometricScan();
    } else {
      simulateBiometricScan();
    }
  };

  const totalSteps = 3;
  const progressWidth = `${(step / totalSteps) * 100}%`;

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="auth-container dark-theme">
      <div className="app-container">
        <div className="moucharabieh-overlay" />

        <div style={styles.statusBar}>
          <span style={styles.statusTime}>09:41</span>
          <div style={styles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

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

          {step === 2 && (
            <div style={styles.card} className="fade-in">
              <div style={styles.stepIcon}><Shield size={28} color="#0056D2" /></div>
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
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBar}>
                    <div style={{ ...styles.strengthFill, width: `${Math.min(100, form.password.length * 12.5)}%`, background: getStrengthColor(form.password) }} />
                  </div>
                  <span style={styles.strengthText}>{getStrengthText(form.password)}</span>
                </div>
                <button type="submit" className="btn-primary-ashel">Finaliser</button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div style={styles.card} className="fade-in">
              <div className="biometric-container">
                {cameraActive && (
                  <div style={styles.cameraPreview}>
                    <video ref={videoRef} style={styles.video} autoPlay playsInline muted />
                    <canvas ref={canvasRef} style={styles.canvas} />
                    {detectedFeatures.quality > 0 && (
                      <div style={styles.detectionOverlay}>
                        <div style={styles.qualityBar}>
                          <div style={{ ...styles.qualityFill, width: `${detectedFeatures.quality}%` }} />
                        </div>
                        <div style={styles.features}>
                          {detectedFeatures.eyes && <Zap size={14} color="#4ade80" />}
                          {detectedFeatures.nose && <Activity size={14} color="#4ade80" />}
                          {detectedFeatures.mouth && <ScanFace size={14} color="#4ade80" />}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`biometric-icon-container ${isScanning ? 'scanning-active' : ''}`}>
                  <div className={`scan-wrapper ${isScanning ? 'is-scanning' : ''}`}>
                    {!cameraActive && (
                      <img src={faceIdIllustration} alt="Face ID" className={`bio-illustration ${isScanning ? 'pulse-animation' : ''}`} />
                    )}
                  </div>
                </div>

                {isScanning && (
                  <div style={styles.scanProgress}>
                    <div style={styles.progressCircle}>
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="4"/>
                        <circle 
                          cx="60" cy="60" r="54" fill="none" 
                          stroke="#0056D2" strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 54}`}
                          strokeDashoffset={`${2 * Math.PI * 54 * (1 - scanProgress / 100)}`}
                          transform="rotate(-90 60 60)"
                          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                        />
                      </svg>
                      <div style={styles.progressPercent}>{scanProgress}%</div>
                    </div>
                    <p style={styles.scanStatusText}>{scanStatus}</p>
                    <div style={styles.scanAnimation}>
                      <div className="scan-line" />
                    </div>
                  </div>
                )}
                
                <h2 className="title-text">
                  {isScanning ? 'Analyse biométrique' : cameraActive ? 'Positionnez votre visage' : 'Biométrie'}
                </h2>
                
                {!isScanning && !loading && !cameraActive && (
                  <>
                    <p className="subtitle-text" style={{textAlign: 'center'}}>
                      <Fingerprint size={16} style={{display: 'inline', marginRight: '5px'}} />
                      Enregistrez votre visage pour une authentification rapide et sécurisée
                    </p>
                    <button type="button" className="btn-primary-ashel" style={{marginTop: '20px'}} onClick={handleBiometricScan}>
                      <Camera size={18} style={{marginRight: '8px'}} />
                      Activer la reconnaissance faciale
                    </button>
                  </>
                )}
                
                {cameraActive && !isScanning && (
                  <button type="button" className="btn-secondary" style={{marginTop: '20px'}} onClick={stopCamera}>
                    Annuler la capture
                  </button>
                )}
                
                {(isScanning || loading) && <Loader2 className="animate-spin" size={32} color="#0056D2" style={{marginTop: '20px'}} />}
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ ...styles.card, textAlign: 'center' }} className="fade-in">
              <div style={styles.successCircle}>
                <CheckCircle2 size={48} color="#4ade80" />
              </div>
              <h2 className="title-text" style={{ marginTop: '20px' }}>Inscription réussie !</h2>
              <p className="subtitle-text">
                Votre identité biométrique a été enregistrée.<br/>
                Vérification OTP en cours...
              </p>
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
        .btn-primary-ashel { width: 100%; padding: 16px; border-radius: 16px; border: none; background: #1e293b; font-weight: 900; cursor: pointer; margin-top: 10px; color: white; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary-ashel:hover { background: #0056D2; transform: scale(1.02); }
        .btn-secondary { width: 100%; padding: 14px; border-radius: 16px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-secondary:hover { background: #f8fafc; border-color: #0056D2; }
        .scan-wrapper { width: 160px; height: 160px; border-radius: 50%; overflow: hidden; border: 3px solid #e2e8f0; margin: 0 auto; position: relative; }
        .scan-wrapper.is-scanning { border-color: #0056D2; box-shadow: 0 0 20px rgba(0,86,210,0.3); animation: borderPulse 1.5s ease-in-out infinite; }
        .bio-illustration { width: 100%; height: 100%; object-fit: cover; }
        .pulse-animation { animation: pulse 1s ease-in-out infinite alternate; }
        .scanning-active { animation: scanPulse 2s ease-in-out infinite; }
        @keyframes pulse { from { opacity: 0.6; transform: scale(0.98); } to { opacity: 1; transform: scale(1.02); } }
        @keyframes borderPulse { 0%, 100% { border-color: #e2e8f0; } 50% { border-color: #0056D2; } }
        @keyframes scanPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .animate-spin { animation: spin 1s linear infinite; display: block; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .moucharabieh-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url("https://www.transparenttextures.com/patterns/arabesque.png"); opacity: 0.02; pointer-events: none; }
        .scan-line { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #0056D2, transparent); animation: scanMove 2s linear infinite; }
        @keyframes scanMove { 0% { top: 0; } 100% { top: 100%; } }
        .biometric-container { position: relative; }
        .camera-preview { position: relative; margin-bottom: 20px; }
      `}</style>
    </div>
  );
};

// Fonctions utilitaires pour la force du mot de passe
const getStrengthColor = (password) => {
  const strength = getPasswordStrength(password);
  if (strength < 30) return '#ef4444';
  if (strength < 60) return '#f59e0b';
  return '#4ade80';
};

const getStrengthText = (password) => {
  const strength = getPasswordStrength(password);
  if (strength < 30) return 'Faible';
  if (strength < 60) return 'Moyen';
  return 'Fort';
};

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]/)) strength += 25;
  if (password.match(/[A-Z]/)) strength += 25;
  if (password.match(/[0-9]/)) strength += 25;
  return strength;
};

const styles = {
  card: { paddingTop: '10px' },
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
  errorBanner: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: '600' },
  passwordStrength: { marginTop: '8px', marginBottom: '16px' },
  strengthBar: { height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' },
  strengthFill: { height: '100%', transition: 'width 0.3s ease' },
  strengthText: { fontSize: '11px', color: '#64748b', fontWeight: '600' },
  scanProgress: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' },
  progressCircle: { position: 'relative', width: '120px', height: '120px', marginBottom: '16px' },
  progressPercent: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', fontWeight: 'bold', color: '#0056D2' },
  scanStatusText: { fontSize: '14px', color: '#64748b', fontWeight: '500', marginTop: '8px' },
  scanAnimation: { position: 'relative', width: '100%', height: '2px', background: '#e2e8f0', marginTop: '16px', overflow: 'hidden' },
  cameraPreview: { position: 'relative', width: '100%', height: '200px', background: '#000', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
  canvas: { display: 'none' },
  detectionOverlay: { position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.7)', padding: '8px', color: 'white', fontSize: '12px' },
  qualityBar: { height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' },
  qualityFill: { height: '100%', background: '#4ade80', transition: 'width 0.3s ease' },
  features: { display: 'flex', gap: '8px', justifyContent: 'center' }
};

export default RegisterForm;