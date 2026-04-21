import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import SplashScreen from './components/SplashScreen';

// IMPORT DU PROVIDER (Indispensable pour corriger l'écran bleu)
import { VaultProvider } from './components/VaultContext';

// Imports des composants
import Home from './components/Home'; 
import EAmende from './components/EAmende';
import EAdministration from './components/EAdministration'; 
import BirthCertificationForm from './components/BirthCertificationForm'; 
import BulletinB3Form from './components/BulletinB3Form'; 
import WorkCertificateForm from './components/WorkCertificateForm'; 
import Login from './components/Login';
import Register from './components/Register';
import DocumentVault from './components/DocumentVault'; 
import PaiementAmende from './components/paiementAmende';   // casse corrigée (fichier 2)
import PaymentHub from './components/Paymenthub';
import FacturePage from './components/Facturepage';
import PaiementFacture from './components/PaiementFacture';
import FactureDetail from './components/FactureDetail';
import PaiementAdministration from './components/PaiementAdministration';  // casse corrigée (fichier 2)
import CheckoutService from './components/PaiementAdministrationAction.jsx'; 
import Profil from './components/Profiltemp'; 
import VerifyOTP from "./components/VOTP"; 
import Signalement from './components/Signalement';
import Evaluation from './components/Evaluation';
import Reclamation from './components/Reclamation';
import ParticipationHub from './components/ParticipationHub';   // ajout fichier 2
import SupportAide from './components/SupportAide'; 
import SignalementList from './components/SignalementList';      // ajout fichier 2
import ReclamationList from './components/ReclamationList';      // ajout fichier 2

// ─── Chatbot flottant ────────────────────────────────────────────────────────
const GlobalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hiddenRoutes = ['/', '/register', '/verify-otp'];
    if (!hiddenRoutes.includes(location.pathname)) {
      const timer = setTimeout(() => setShowTooltip(true), 1500);
      const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
      return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    } else {
      setShowTooltip(false);
      setIsOpen(false);
    }
  }, [location.pathname]);

  const hiddenRoutes = ['/', '/register', '/verify-otp'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <>
      {isOpen ? (
        <div style={chatWrapper} className="slide-up">
          <div style={chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={onlineDot}></div>
              <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>Assistant Tunis-Bot</span>
            </div>
            <X size={20} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
            <SupportAide isEmbedded={true} />
          </div>
        </div>
      ) : (
        <div style={fabContainer}>
          {showTooltip && (
            <div style={tooltipStyle} className="fade-in-right">
              Besoin d'aide ? 👋
              <div style={tooltipArrow}></div>
            </div>
          )}
          <button style={fabStyle} onClick={() => setIsOpen(true)} className="pulse-button">
            <MessageCircle color="white" size={28} />
            <span style={notifBadge}>1</span>
          </button>
        </div>
      )}
    </>
  );
};

// ─── App principale ──────────────────────────────────────────────────────────
function App() {
  const [showSplash, setShowSplash] = useState(true);   // SplashScreen (fichier 1)

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <VaultProvider>
      <Router>
        <GlobalChatbot />

        <Routes>
          <Route path="/"                           element={<Login />} />
          <Route path="/register"                   element={<Register />} />
          <Route path="/verify-otp"                 element={<VerifyOTP />} />
          <Route path="/home"                       element={<Home />} />
          <Route path="/profil"                     element={<Profil />} />
          <Route path="/e-admin"                    element={<EAdministration />} />
          <Route path="/vault"                      element={<DocumentVault onBack={() => window.history.back()} />} />
          <Route path="/birth-certification"        element={<BirthCertificationForm />} />
          <Route path="/bulletin-b3"                element={<BulletinB3Form />} />
          <Route path="/work-certificate"           element={<WorkCertificateForm />} />
          <Route path="/paiement-administration"    element={<PaiementAdministration />} />
          <Route path="/paiement-carte-admin"       element={<CheckoutService />} />
          <Route path="/e-amende"                   element={<EAmende />} />
          <Route path="/paiement-amende"            element={<PaiementAmende />} />
          <Route path="/paiement"                   element={<PaymentHub />} />
          <Route path="/facture/:id"                element={<FactureDetail />} />
          <Route path="/paiement-facture/:type"     element={<FacturePage />} />
          <Route path="/paiement-facture/:type/payer" element={<PaiementFacture />} />
          <Route path="/checkout-service/:type"     element={<CheckoutService />} />
          <Route path="/signalement"                element={<Signalement />} />
          <Route path="/signalement-list"           element={<SignalementList />} />
          <Route path="/evaluation"                 element={<Evaluation />} />
          <Route path="/reclamation"                element={<Reclamation />} />
          <Route path="/reclamation-list"           element={<ReclamationList />} />
          <Route path="/participation"              element={<ParticipationHub />} />
          <Route path="/support-aide"               element={<SupportAide />} />
        </Routes>

        {/* Animations CSS globales (fichier 2) */}
        <style>{`
          .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
          @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .fade-in-right { animation: fadeInRight 0.5s ease-out; }
          @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .pulse-button { animation: pulseShadow 2s infinite; transition: transform 0.2s; }
          .pulse-button:hover { transform: scale(1.1); }
          @keyframes pulseShadow {
            0%   { box-shadow: 0 0 0 0 rgba(0, 86, 210, 0.4); }
            70%  { box-shadow: 0 0 0 15px rgba(0, 86, 210, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 86, 210, 0); }
          }
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </Router>
    </VaultProvider>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
// FAB positionné au-dessus de la navbar mobile (95px) + safe area (fichier 1)
const fabContainer  = { position: 'fixed', bottom: 'calc(95px + env(safe-area-inset-bottom, 0px))', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 9999 };
const fabStyle      = { background: '#0056D2', width: '65px', height: '65px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', position: 'relative' };
const notifBadge    = { position: 'absolute', top: '2px', right: '2px', background: '#EF4444', color: 'white', fontSize: '10px', padding: '3px 7px', borderRadius: '10px', border: '2px solid white', fontWeight: 'bold' };
const tooltipStyle  = { background: '#1E293B', color: 'white', padding: '12px 18px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', position: 'relative', whiteSpace: 'nowrap' };
const tooltipArrow  = { position: 'absolute', bottom: '-6px', right: '25px', width: '12px', height: '12px', background: '#1E293B', transform: 'rotate(45deg)' };
// chatWrapper : plein écran mobile (fichier 1) avec coins arrondis en haut seulement
const chatWrapper   = { position: 'fixed', bottom: 'env(safe-area-inset-bottom, 0px)', right: '0', left: '0', height: '82vh', maxWidth: '480px', margin: '0 auto', background: 'white', borderRadius: '28px 28px 0 0', boxShadow: '0 -10px 60px rgba(0,0,0,0.3)', zIndex: 10000, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #E2E8F0' };
const chatHeader    = { padding: '18px 20px', background: '#1E293B', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const onlineDot     = { width: '10px', height: '10px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981' };

export default App;
