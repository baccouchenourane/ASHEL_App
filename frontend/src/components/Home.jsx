import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Home as HomeIcon, 
  FileText, 
  Settings, 
  ShieldAlert, 
  MessageSquare, 
  User, 
  Bell 
} from 'lucide-react';
import '../App.css';

const Home = () => {
  const navigate = useNavigate();
  
  // Récupération sécurisée des données de l'identité numérique
  const user = JSON.parse(localStorage.getItem('user_ashel')) || { nom: "Citoyen Tunisien" };

  const handleLogout = () => {
    // Retour à la page de connexion
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>
      
      {/* HEADER : IDENTITÉ ET NOTIFICATIONS */}
      <div style={{ padding: '50px 25px 20px', background: 'white', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
        <div className="fade-in">
          <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>Bienvenue,</p>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1A1D23' }}>{user.nom}</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '12px', position: 'relative' }}>
                <Bell size={20} color="#64748B" />
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#E70011', borderRadius: '50%', border: '2px solid white' }}></span>
            </div>
            <div onClick={handleLogout} style={{ cursor: 'pointer', padding: '10px', background: '#FEF2F2', borderRadius: '12px' }}>
                <LogOut size={20} color="#E70011" />
            </div>
        </div>
      </div>
      
      {/* CONTENU PRINCIPAL */}
      <div style={{ padding: '25px', zIndex: 2, flex: 1, overflowY: 'auto' }}>
        
        {/* CARTE D'IDENTITÉ NUMÉRIQUE (Module Authentification) */}
        <div className="fade-in" style={{ background: 'linear-gradient(135deg, #0056D2, #003FA3)', color: 'white', padding: '20px', borderRadius: '25px', marginBottom: '25px', boxShadow: '0 10px 20px rgba(0,86,210,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <ShieldAlert size={24} opacity={0.8} />
            <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>STATUT : CERTIFIÉ</span>
          </div>
          <p style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '5px' }}>Identité Numérique Unique</p>
          <h4 style={{ fontSize: '1rem', letterSpacing: '1px' }}>CIN DIGITALE ACTIVE</h4>
        </div>

        <h4 style={{ fontSize: '0.9rem', marginBottom: '15px', color: '#1A1D23', fontWeight: '700' }}>Services SMART e-GOV</h4>

        {/* GRILLE DES MODULES DE TON PROJET */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="fade-in">
            
            {/* MODULE 2 : E-ADMINISTRATION (Vers ta tâche actuelle) */}
            <div className="service-card" onClick={() => navigate('/e-admin')}>
                <div className="icon-box" style={{ background: '#EEF2FF' }}>
                    <FileText color="#0056D2" />
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>E-Admin</p>
                <p style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Extraits & Suivi</p>
            </div>

            {/* MODULE 1 : E-AMENDES */}
            <div className="service-card" onClick={() => alert("Module E-Amendes bientôt disponible")}>
                <div className="icon-box" style={{ background: '#FFF7ED' }}>
                    <ShieldAlert color="#EA580C" />
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>E-Amendes</p>
                <p style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Consultation & Paiement</p>
            </div>

            {/* MODULE 3 : E-PARTICIPATION */}
            <div className="service-card" onClick={() => alert("Module Citizen Pulse bientôt disponible")}>
                <div className="icon-box" style={{ background: '#F0FDF4' }}>
                    <MessageSquare color="#16A34A" />
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>Citizen Pulse</p>
                <p style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Signalements</p>
            </div>

            {/* PROFIL / PARAMÈTRES */}
            <div className="service-card">
                <div className="icon-box" style={{ background: '#F8FAFC' }}>
                    <User color="#64748B" />
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>Mon Profil</p>
                <p style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Données CIN</p>
            </div>
        </div>

        {/* BANNIÈRE D'INFORMATION */}
        <div style={{ marginTop: '25px', padding: '15px', background: '#F1F5F9', borderRadius: '15px', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '0.7rem', color: '#475569', lineHeight: '1.4' }}>
                <strong>Note :</strong> Toutes vos demandes sont horodatées et certifiées via le Registre National.
            </p>
        </div>
      </div>

      {/* BARRE DE NAVIGATION INFÉRIEURE (NAVBAR) */}
      <div style={{ height: '85px', background: 'white', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 10, paddingBottom: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <HomeIcon size={22} color="#E70011" />
            <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#E70011' }}>Accueil</span>
        </div>
        <div onClick={() => navigate('/e-admin')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <FileText size={22} color="#94A3B8" />
            <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#94A3B8' }}>Dossiers</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Settings size={22} color="#94A3B8" />
            <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#94A3B8' }}>Réglages</span>
        </div>
      </div>
    </div>
  );
};

export default Home;