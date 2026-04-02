import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, CalendarDays,
  ShieldCheck, Lock, Fingerprint, Bell,
  Globe, LogOut, ChevronRight, Camera,
  Edit2, QrCode, Loader2, LayoutGrid, FileText, CreditCard, Users
} from 'lucide-react';
// Importe tes API services ici quand ils seront prêts
// import { userAPI } from '../services/api';

// ─────────────────────── STYLES (Cohérents avec Home) ─────────────────────

const navBar = {
  position: 'fixed', bottom: 0, left: 0, right: 0, height: '85px',
  background: 'white', display: 'flex', justifyContent: 'space-around',
  alignItems: 'center', padding: '0 10px 15px 10px',
  borderTop: '1px solid #f1f5f9', zIndex: 100,
  boxShadow: '0 -10px 25px rgba(0,0,0,0.03)'
};

const sectionCard = {
  background: 'white',
  borderRadius: '25px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
  border: '1px solid #f1f5f9'
};

const infoItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '15px 0',
  borderBottom: '1px solid #f1f5f9'
};

const iconContainer = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const menuLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '18px 0',
  cursor: 'pointer',
  borderBottom: '1px solid #f1f5f9',
  color: '#1e293b',
  textDecoration: 'none'
};

const badgeVerification = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  background: '#ECFDF5', // Vert très clair
  color: '#059669', // Vert succès
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '700',
  marginTop: '8px'
};

// ─────────────────────── COMPOSANT PRINCIPAL ───────────────────────────────
const Profil = () => {
  const navigate = useNavigate();

  // ─── STATE (Simulé pour l'intégration) ──────────────────────────────────
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── CHARGEMENT DES DONNÉES (Simulé) ────────────────────────────────────
  useEffect(() => {
    // Simule un appel API
    setTimeout(() => {
      setUser({
        nomComplet: 'Mohamed Ben Ali',
        photo: null, // URL de la photo si existante
        niveauVerification: 'Niveau 3 - Rapproché', // Spécifique e-gov
        cinMasque: '******89',
        email: 'm.benali@email.tn',
        telephone: '+216 98 *** 456',
        adresse: '12 Rue de la Liberté, 1002 Tunis',
        dateNaissance: '15/05/1988'
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ashel_token');
    navigate('/');
  };

  // ─── ÉTAT DE CHARGEMENT ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '15px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
        <Loader2 size={40} color="#0056D2" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748b', fontWeight: '600' }}>Chargement du profil…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', paddingBottom: '110px' }}>

      {/* ─── HEADER PROFIL ────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
        padding: '50px 25px 30px 25px', color: 'white',
        borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px',
        textAlign: 'center', position: 'relative'
      }}>
        {/* Bouton Éditer (Haut Droite) */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
            <Edit2 size={18} />
        </div>

        {/* Avatar avec bouton photo */}
        <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 15px auto' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e2e8f0', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            {user.photo ? 
                <img src={user.photo} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> 
                : 
                <User size={60} color="#94a3b8" />
            }
          </div>
          <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#0056D2', padding: '8px', borderRadius: '50%', border: '3px solid white', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <Camera size={18} color="white" />
          </div>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 5px 0' }}>{user.nomComplet}</h3>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>CIN: {user.cinMasque}</p>
        
        <div style={badgeVerification}>
            <ShieldCheck size={16} />
            {user.niveauVerification}
        </div>
      </div>

      {/* ─── CORPS DE LA PAGE ─────────────────────────────────────────────── */}
      <div style={{ padding: '25px 20px 0 20px' }}>
        
        {/* Raccourci Identité Digitale (Cohérence avec Home) */}
        <div style={{...sectionCard, background: '#0056D2', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '25px'}}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <QrCode size={30} />
                <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Afficher mon QR Code</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>Pour vérification rapide</p>
                </div>
            </div>
            <ChevronRight color="white" opacity={0.7} />
        </div>

        {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
        <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b', marginBottom: '15px', paddingLeft: '5px' }}>Informations Personnelles</h4>
        <div style={sectionCard}>
          <InfoItem icon={<Mail />} label="Email" value={user.email} iconBg="#EEF2FF" iconColor="#0056D2" />
          <InfoItem icon={<Phone />} label="Téléphone" value={user.telephone} iconBg="#FFF7ED" iconColor="#EA580C" />
          <InfoItem icon={<MapPin />} label="Adresse" value={user.adresse} iconBg="#E0F2FE" iconColor="#0369A1" />
          <InfoItem icon={<CalendarDays />} label="Date de naissance" value={user.dateNaissance} iconBg="#F0FDFA" iconColor="#0F766E" last />
        </div>

        {/* SECTION 2 : PARAMÈTRES AVANCÉS */}
        <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b', marginBottom: '15px', marginTop: '25px', paddingLeft: '5px' }}>Paramètres & Sécurité</h4>
        <div style={sectionCard}>
            <MenuLink icon={<Lock size={20}/>} label="Changer le mot de passe" />
            <MenuLink icon={<Fingerprint size={20}/>} label="Biométrie (FaceID / Empreinte)" />
            <MenuLink icon={<Bell size={20}/>} label="Préférences de notifications" />
            <MenuLink icon={<Globe size={20}/>} label="Langue de l'application" value="Français" last />
        </div>

        {/* BOUTON DÉCONNEXION */}
        <button 
          onClick={handleLogout}
          style={{
            width: '100%', padding: '18px', background: 'white', color: '#E70011',
            border: '1px solid #fee2e2', borderRadius: '18px', fontWeight: '800', 
            fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: '10px', marginTop: '30px',
            boxShadow: '0 4px 15px rgba(231,0,17,0.03)'
          }}
        >
          <LogOut size={20} />
          Déconnexion
        </button>
        
        <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.7rem', marginTop: '20px'}}>Ashel Tunisie - v1.0.0</p>

      </div>

      {/* ─── NAV BAR (Identique à Home) ──────────────────────────────────── */}
      <nav style={navBar}>
        <NavItem icon={<LayoutGrid size={24} />} label="Accueil" onClick={() => navigate('/home')} />
        <NavItem icon={<FileText size={24} />}   label="E-Admin" onClick={() => navigate('/e-admin')} />
        <NavItem icon={<CreditCard size={24} />} label="Amendes" onClick={() => navigate('/e-amende')} />
        <NavItem icon={<Users size={24} />}      label="Participation" />
        <NavItem icon={<User size={24} />}       label="Profil" active />
      </nav>

    </div>
  );
};

// ─────────────────────── SOUS-COMPOSANTS PETITS ─────────────────────────────

const InfoItem = ({ icon, label, value, iconBg, iconColor, last }) => (
  <div style={{ ...infoItemStyle, borderBottom: last ? 'none' : infoItemStyle.borderBottom }}>
    <div style={{ ...iconContainer, background: iconBg, color: iconColor }}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b', fontWeight: '700' }}>{value}</p>
    </div>
  </div>
);

const MenuLink = ({ icon, label, value, last }) => (
    <div style={{ ...menuLinkStyle, borderBottom: last ? 'none' : menuLinkStyle.borderBottom }}>
        <div style={{ color: '#0056D2', display: 'flex' }}>{icon}</div>
        <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: '600' }}>{label}</span>
        {value && <span style={{fontSize: '0.85rem', color: '#94a3b8', marginRight: '5px'}}>{value}</span>}
        <ChevronRight size={18} color="#cbd5e1" />
    </div>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', flex: 1 }}
  >
    <div style={{ color: active ? '#0056D2' : '#94a3b8' }}>{icon}</div>
    <span style={{ fontSize: '0.6rem', fontWeight: '700', color: active ? '#0056D2' : '#94a3b8' }}>{label}</span>
  </div>
);

export default Profil;