import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Loader2 } from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const faceIdIllustration = "https://img.freepik.com/vecteurs-premium/concept-reconnaissance-faciale-pour-authentification-biometrique_199064-1100.jpg?w=826";

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBiometricScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="auth-container dark-theme">
      {step === 1 && (
        <div className="auth-card central-content">
          <div className="logo-container">
            <img src={logoAshel} alt="ASHEL Logo" className="main-logo-img" />
            <p className="app-slogan">SERVICES QUOTIDIENS. SIMPLIFIÉS.</p>
          </div>
          <h2 className="title-text">Identifiez-vous</h2>
          <p className="subtitle-text">Accédez en toute sécurité à vos services numériques gouvernementaux.</p>
          <form onSubmit={handleNextStep}>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input type="text" placeholder="Email ou Numéro CIN" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-with-icon">
              <KeyRound className="input-icon" size={20} />
              <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="options-row" style={{ textAlign: 'right', marginBottom: '20px' }}>
              <span className="forgot-pass">Mot de passe oublié ?</span>
            </div>
            <button type="submit" className="btn-primary-ashel">Suivant</button>
            <button type="button" className="btn-secondary-ashel" onClick={() => navigate('/register')}>Nouvel utilisateur ? S'inscrire</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="auth-card central-content">
          <div className="biometric-icon-container">
            <div className={`scan-wrapper ${isScanning ? 'is-scanning' : ''}`}>
              <img src={faceIdIllustration} alt="Face ID" className={`bio-illustration ${isScanning ? 'pulse-animation' : ''}`} />
            </div>
          </div>
          <h2 className="title-text">{isScanning ? "Analyse en cours..." : "Vérification d'identité"}</h2>
          <p className="subtitle-text">{isScanning ? "Veuillez ne pas bouger pendant le traitement." : "Placez votre visage dans le cadre de la caméra pour finaliser la connexion."}</p>
          {!isScanning && (
            <>
              <div className="guidelines-list">
                <p>✓ Éclairage suffisant</p>
                <p>✓ Visage bien visible</p>
              </div>
              <button type="button" className="btn-primary-ashel" onClick={handleBiometricScan}>Démarrer le scan</button>
              <button type="button" className="btn-back-ashel" onClick={() => setStep(1)}>Retour</button>
            </>
          )}
          {isScanning && <Loader2 className="animate-spin" size={32} color="var(--ashel-green)" />}
        </div>
      )}
    </div>
  );
};

export default Login;