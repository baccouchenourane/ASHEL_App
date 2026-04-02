import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';

// --- IMPORTS DES COMPOSANTS ---
import Home from './components/Home'; 
import EAmende from './components/EAmende';
import EAdministration from './components/EAdministration'; 
import BirthCertificationForm from './components/BirthCertificationForm'; 
import BulletinB3Form from './components/BulletinB3Form'; 
import WorkCertificateForm from './components/WorkCertificateForm'; 
import Login from './components/Login';
import Register from './components/Register';
import PaiementAmende from './components/PaiementAmende'; 
import PaymentHub from './components/Paymenthub';
import FacturePage from './components/Facturepage';
import PaiementFacture from './components/PaiementFacture';
import FactureDetail from './components/FactureDetail';

import Profil from './components/Profiltemp'; // <--- AJOUT DE L'IMPORT

// CORRECTION : On pointe vers le nom réel du fichier "VOTP"
import VerifyOTP from "./components/VOTP"; 

// Nouveaux imports issus de la fusion
import Signalement from './components/Signalement';
import Evaluation from './components/Evaluation';
import Reclamation from './components/Reclamation';
import SupportAide from './components/SupportAide'; 

// --- COMPOSANT CHATBOT GLOBAL ---
const GlobalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Liste des routes où le chatbot doit être masqué
    const hiddenRoutes = ['/', '/register', '/verify-otp'];
    
    if (!hiddenRoutes.includes(location.pathname)) {
      // Apparition du tooltip après 1.5s, disparition après 5.5s
      const timer = setTimeout(() => setShowTooltip(true), 1500);
      const hideTimer = setTimeout(() => setShowTooltip(false), 5500);
      return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    } else {
      // Si on est sur une page d'auth, on ferme tout
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
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
               <div style={onlineDot}></div>
               <span style={{fontSize: '0.9rem', fontWeight:'800'}}>Assistant Tunis-Bot</span>
            </div>
            <X size={20} onClick={() => setIsOpen(false)} style={{cursor:'pointer'}} />
          </div>
          <div style={{flex: 1, overflow: 'hidden', backgroundColor: '#F8FAFC'}}>
             <SupportAide onBack={() => setIsOpen(false)} isEmbedded={true} />
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

// --- COMPOSANT PRINCIPAL APP ---
function App() {
  return (
    <Router>
      <GlobalChatbot /> 

      <Routes>
  {/* Authentification */}
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/verify-otp" element={<VerifyOTP />} />

  {/* Accueil & Profil */}
  <Route path="/home" element={<Home />} />        
  <Route path="/profil" element={<Profil />} />

  {/* Services E-Administration */}
  <Route path="/e-admin" element={<EAdministration />} />
  <Route path="/birth-certification" element={<BirthCertificationForm />} />
  <Route path="/bulletin-b3" element={<BulletinB3Form />} />
  <Route path="/work-certificate" element={<WorkCertificateForm />} />
  
  {/* Services E-Amende */}
  <Route path="/e-amende" element={<EAmende />} />
  <Route path="/paiement-amende" element={<PaiementAmende />} />

  {/* Hub Paiements & Factures */}
  <Route path="/paiement" element={<PaymentHub />} />
  <Route path="/facture/:id" element={<FactureDetail />} /> {/* Détail de la facture (Design Papier) */}
  
  {/* Ces deux routes sont utiles si tu as gardé l'ancien système de paiement direct */}
  <Route path="/paiement-facture/:type" element={<FacturePage />} />
  <Route path="/paiement-facture/:type/payer" element={<PaiementFacture />} />

  {/* Services GovTech / Citoyenneté */}
  <Route path="/signalement" element={<Signalement />} />
  <Route path="/evaluation" element={<Evaluation />} />
  <Route path="/reclamation" element={<Reclamation />} />
</Routes>

      {/* Animations CSS injectées */}
      <style>{`
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .fade-in-right { animation: fadeInRight 0.5s ease-out; }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .pulse-button { animation: pulseShadow 2s infinite; }
        @keyframes pulseShadow { 
          0% { box-shadow: 0 0 0 0 rgba(0, 86, 210, 0.4); } 
          70% { box-shadow: 0 0 0 15px rgba(0, 86, 210, 0); } 
          100% { box-shadow: 0 0 0 0 rgba(0, 86, 210, 0); } 
        }
      `}</style>
    </Router>
  );
}

// --- STYLES (Objets JavaScript) ---
const fabContainer = { position: 'fixed', bottom: '30px', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 9999 };
const fabStyle = { background: '#0056D2', width: '60px', height: '60px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', position: 'relative' };
const notifBadge = { position: 'absolute', top: '-2px', right: '-2px', background: '#EF4444', color: 'white', fontSize: '10px', padding: '4px 7px', borderRadius: '10px', border: '2px solid white' };
const tooltipStyle = { background: '#1E293B', color: 'white', padding: '10px 15px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative' };
const tooltipArrow = { position: 'absolute', bottom: '-5px', right: '20px', width: '10px', height: '10px', background: '#1E293B', transform: 'rotate(45deg)' };
const chatWrapper = { position: 'fixed', bottom: '20px', right: '20px', left: '20px', height: '75vh', maxWidth: '400px', margin: '0 auto', background: 'white', borderRadius: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', zIndex: 10000, overflow: 'hidden', display: 'flex', flexDirection: 'column' };
const chatHeader = { padding: '15px 20px', background: '#1E293B', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const onlineDot = { width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' };

export default App;