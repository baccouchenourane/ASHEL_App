import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Phone, Mail, Lock, Smartphone, ShieldCheck, ScanFace } from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png';

const Register = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="auth-container dark-theme">
      <div className="auth-card central-content">
        
        {/* En-tête avec Logo constant */}
        <div className="logo-container">
          <img src={logoAshel} alt="ASHEL Logo" className="main-logo-img" />
          <p className="step-indicator">Étape {step} sur 4</p>
        </div>

        {/* ÉTAPE 1 : INFORMATIONS PERSONNELLES */}
        {step === 1 && (
          <div className="form-step">
            <h2 className="title-text">Créer un compte</h2>
            <p className="subtitle-text">Entrez vos informations telles qu'elles apparaissent sur votre document d'identité.</p>
            <div className="input-with-icon"><User size={20}/><input type="text" placeholder="Nom" /></div>
            <div className="input-with-icon"><User size={20}/><input type="text" placeholder="Prénom" /></div>
            <div className="input-with-icon"><CreditCard size={20}/><input type="text" placeholder="Numéro CIN ou Passeport" /></div>
            <button className="btn-primary-ashel" onClick={nextStep}>Continuer</button>
            <button className="btn-back-ashel" onClick={() => navigate('/')}>Déjà inscrit ? Se connecter</button>
          </div>
        )}

        {/* ÉTAPE 2 : CONTACT ET SÉCURITÉ */}
        {step === 2 && (
          <div className="form-step">
            <h2 className="title-text">Contact</h2>
            <p className="subtitle-text">Ces informations seront utilisées pour la vérification de votre compte.</p>
            <div className="input-with-icon"><Phone size={20}/><input type="tel" placeholder="Numéro de téléphone" /></div>
            <div className="input-with-icon"><Mail size={20}/><input type="email" placeholder="Adresse Email" /></div>
            <div className="input-with-icon"><Lock size={20}/><input type="password" placeholder="Créer un mot de passe" /></div>
            <button className="btn-primary-ashel" onClick={nextStep}>Suivant</button>
            <button className="btn-back-ashel" onClick={prevStep}>Retour</button>
          </div>
        )}

        {/* ÉTAPE 3 : BIOMÉTRIE (Première fois) */}
        {step === 3 && (
          <div className="form-step">
            <h2 className="title-text">Identité Digitale</h2>
            <p className="subtitle-text">Enregistrez votre empreinte faciale pour sécuriser vos futurs accès.</p>
            <div className="biometric-box">
              <ScanFace size={80} className="pulse-animation" color="#0A9B8D" />
            </div>
            <button className="btn-primary-ashel" onClick={nextStep}>Enregistrer mon visage</button>
            <button className="btn-back-ashel" onClick={prevStep}>Retour</button>
          </div>
        )}

        {/* ÉTAPE 4 : VÉRIFICATION SMS */}
        {step === 4 && (
          <div className="form-step">
            <h2 className="title-text">Vérification</h2>
            <p className="subtitle-text">Un code de confirmation a été envoyé sur votre téléphone.</p>
            <div className="otp-container">
              <input type="text" maxLength="1" className="otp-input" />
              <input type="text" maxLength="1" className="otp-input" />
              <input type="text" maxLength="1" className="otp-input" />
              <input type="text" maxLength="1" className="otp-input" />
            </div>
            <button className="btn-primary-ashel" onClick={() => navigate('/')}>Finaliser l'inscription</button>
            <p className="resend-text">Vous n'avez pas reçu le code ? <span>Renvoyer</span></p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;