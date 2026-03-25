import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound } from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png'; 

const Login = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Illustration pour l'étape de biométrie
  const faceIdIllustration = "https://img.freepik.com/vecteurs-premium/concept-reconnaissance-faciale-pour-authentification-biometrique_199064-1100.jpg?w=826";

  const handleNext = () => {
    if (step === 1) {
      setStep(2); // Passe à la biométrie
    } else {
      navigate('/home'); // Redirection vers l'accueil
    }
  };

  return (
    <div className="auth-container dark-theme">
      
      {/* --- ÉTAPE 1 : IDENTIFICATION --- */}
      {step === 1 && (
        <div className="auth-card central-content">
          <div className="logo-container">
            <img src={logoAshel} alt="ASHEL Logo" className="main-logo-img" />
            <p className="app-slogan">SERVICES QUOTIDIENS. SIMPLIFIÉS.</p>
          </div>
          
          <h2 className="title-text">Identifiez-vous</h2>
          <p className="subtitle-text">Accédez en toute sécurité à vos services numériques gouvernementaux.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input type="email" placeholder="Email ou Numéro CIN" required />
            </div>
            
            <div className="input-with-icon">
              <KeyRound className="input-icon" size={20} />
              <input type="password" placeholder="Mot de passe" required />
            </div>
            
            <div className="options-row">
              <span className="forgot-pass">Mot de passe oublié ?</span>
            </div>
            
            <button type="submit" className="btn-primary-ashel">Suivant</button>
            <button type="button" className="btn-secondary-ashel" onClick={() => navigate('/register')}>
              Nouvel utilisateur ? S'inscrire
            </button>
          </form>
        </div>
      )}

      {/* --- ÉTAPE 2 : BIOMÉTRIE --- */}
      {step === 2 && (
        <div className="auth-card central-content">
          <div className="biometric-icon-container">
            <img src={faceIdIllustration} alt="Face ID Animation" className="bio-illustration pulse-animation" />
          </div>
          
          <h2 className="title-text">Vérification d'identité</h2>
          <p className="subtitle-text">Placez votre visage dans le cadre de la caméra pour finaliser la connexion.</p>
          
          <div className="guidelines-list">
            <p>✓ Éclairage suffisant</p>
            <p>✓ Visage bien visible</p>
          </div>
          
          <button type="button" className="btn-primary-ashel" onClick={handleNext}>
            Démarrer le scan
          </button>
          <button type="button" className="btn-back-ashel" onClick={() => setStep(1)}>
            Retour
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;