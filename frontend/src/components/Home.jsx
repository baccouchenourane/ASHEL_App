
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, FileText, CreditCard, Users, LayoutGrid,
  User, CreditCard as PassportIcon, Car,
  ChevronRight, Search, QrCode, MessageSquare,
  X, ShieldCheck, ExternalLink, Loader2,
  Signal, Wifi, Battery // Ajouté pour la barre d'état
} from 'lucide-react';
import { homeAPI, authAPI } from '../services/api';

// ─────────────────────── STYLES ORIGINAUX ───────────────────────────────────────────

const navBar = {
  position: 'absolute', bottom: 0, left: 0, right: 0, height: '85px',
  background: 'white', display: 'flex', justifyContent: 'space-around',
  alignItems: 'center', padding: '0 10px 15px 10px',
  borderTop: '1px solid #f1f5f9', zIndex: 100,
  boxShadow: '0 -10px 25px rgba(0,0,0,0.03)'
};
const modalOverlay = {
  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
};
const scannerContainer = {
  background: '#0f172a', borderRadius: '30px 30px 0 0',
  width: '100%', maxWidth: '480px', padding: '25px', paddingBottom: '40px'
};
const modalContentPro = {
  background: 'white', borderRadius: '30px 30px 0 0',
  width: '100%', maxWidth: '480px', padding: '25px', paddingBottom: '40px'
};
const scanWindow = {
  background: 'rgba(255,255,255,0.05)', borderRadius: '20px', height: '260px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  position: 'relative', overflow: 'hidden'
};
const laserLine = {
  position: 'absolute', left: 0, right: 0, height: '2px',
  background: 'linear-gradient(90deg, transparent, #E70011, transparent)',
  animation: 'scan 2s linear infinite', top: '50%'
};
const cornerStyle = { position: 'absolute', width: '24px', height: '24px', border: '3px solid white' };
const cornerTL = { ...cornerStyle, top: 16, left: 16, borderRight: 'none', borderBottom: 'none', borderRadius: '6px 0 0 0' };
const cornerTR = { ...cornerStyle, top: 16, right: 16, borderLeft: 'none', borderBottom: 'none', borderRadius: '0 6px 0 0' };
const cornerBL = { ...cornerStyle, bottom: 16, left: 16, borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 6px' };
const cornerBR = { ...cornerStyle, bottom: 16, right: 16, borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 6px 0' };
const proDocCard = {
  background: '#f8fafc', borderRadius: '20px', padding: '20px',
  marginBottom: '20px', border: '1px solid #e2e8f0'
};
const badgePro = {
  fontSize: '0.6rem', fontWeight: '900', color: '#0056D2',
  background: '#EEF2FF', padding: '4px 10px', borderRadius: '20px'
};
const docIdDisplay = { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', marginBottom: '16px' };
const docPhotoPlaceholder = { width: '60px', height: '75px', background: '#e2e8f0', borderRadius: '10px', flexShrink: 0 };
const docLineFull  = { height: '10px', background: '#e2e8f0', borderRadius: '6px' };
const docLineMid   = { height: '10px', background: '#e2e8f0', borderRadius: '6px', width: '75%' };
const docLineShort = { height: '10px', background: '#e2e8f0', borderRadius: '6px', width: '50%' };
const closeBtnPro = {
  width: '100%', padding: '16px', background: '#0056D2', color: 'white',
  border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer'
};

// ─────────────────────── CONFIG DOCUMENTS ──────────────────────────────────
const DOC_CONFIG = {
  CIN:             { icon: <CreditCard size={22} />,     color: '#EEF2FF', textColor: '#0056D2' },
  PASSEPORT:       { icon: <PassportIcon size={22} />,  color: '#E0F2FE', textColor: '#0369A1' },
  PERMIS_CONDUIRE: { icon: <Car size={22} />,           color: '#FFF7ED', textColor: '#EA580C' },
};

// ─────────────────────── COMPOSANT PRINCIPAL ───────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  // ─── STATE ─────────────────────────────────────────────────────────────
  const [dashboard, setDashboard]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedDoc, setSelectedDoc]   = useState(null);
  const [showScanner, setShowScanner]   = useState(false);

  // ─── CHARGEMENT DU DASHBOARD ───────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('ashel_token');
    if (!token) {
      navigate('/');
      return;
    }

    homeAPI.getDashboard()
      .then(data => setDashboard(data))
      .catch(err => {
        if (err.message?.includes('401') || err.message?.includes('403')) {
          localStorage.removeItem('ashel_token');
          navigate('/');
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try { await homeAPI.logout(); } catch (_) { }
    localStorage.removeItem('ashel_token');
    localStorage.removeItem('user_ashel');
    navigate('/');
  };

  const handleNotifClick = async (notif) => {
    if (!notif.estLu) {
      homeAPI.marquerNotifLue(notif.id).catch(() => {});
    }
    navigate(notif.routeCible);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0' }}>
         <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
            <Loader2 size={40} color="#0056D2" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontWeight: '600' }}>Chargement...</p>
         </div>
         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0' }}>
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px', padding: '20px' }}>
          <p style={{ color: '#E70011', fontWeight: '700', textAlign: 'center' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: '#0056D2', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const { profil, identiteDigitale, documents, notificationsServices } = dashboard;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#e2e8f0', 
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div className="app-container">
        {/* Barre d'état (iPhone Style) */}
        <div style={phoneStyles.statusBar}>
          <span style={phoneStyles.statusTime}>09:41</span>
          <div style={phoneStyles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden', paddingBottom: '100px', scrollbarWidth: 'none' }}>

          {/* ─── HEADER ──────────────────────────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
            height: '240px', padding: '40px 25px', color: 'white',
            borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, pointerEvents: 'none' }}>
              <LayoutGrid size={300} style={{ position: 'absolute', right: -50, top: -50 }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{profil.nomComplet}</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>ID No.: {profil.cinMasque}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Search size={22} />
                <Bell size={22} />
                <span
                  onClick={handleLogout}
                  style={{ fontSize: '0.6rem', fontWeight: '800', background: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  QUITTER
                </span>
              </div>
            </div>

            {/* Carte identité digitale */}
            <div style={{
              background: 'white', borderRadius: '25px', padding: '20px', marginTop: '30px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)', color: '#1e293b',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ color: '#0056D2' }}><QrCode size={35} /></div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, fontWeight: '700' }}>VOTRE IDENTITÉ DIGITALE</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#003FA3' }}>{identiteDigitale.label}</p>
                </div>
              </div>
              <ChevronRight color="#cbd5e1" />
            </div>
          </div>

          {/* ─── MES DOCUMENTS ───────────────────────────────────────────────── */}
          <div style={{ padding: '30px 20px 0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b' }}>Mes Documents</h4>
              <span style={{ fontSize: '0.8rem', color: '#0056D2', fontWeight: '700' }}>Voir tout</span>
            </div>
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              {documents.map(doc => {
                const cfg = DOC_CONFIG[doc.type] || DOC_CONFIG.CIN;
                return (
                  <DocumentCard
                    key={doc.id}
                    icon={cfg.icon}
                    title={doc.label}
                    color={cfg.color}
                    textColor={cfg.textColor}
                    onClick={() => setSelectedDoc(doc)}
                  />
                );
              })}
            </div>
          </div>

          {/* ─── NOTIFICATIONS DE SERVICES ───────────────────────────────────── */}
          <div style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b', marginBottom: '15px' }}>Notifications de services</h4>
            <div style={{ background: 'white', borderRadius: '25px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              {notificationsServices.map((notif, index) => (
                <React.Fragment key={notif.id}>
                  {index > 0 && <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '15px 0' }} />}
                  <NotifItem notif={notif} onClick={() => handleNotifClick(notif)} />
                </React.Fragment>
              ))}

              {notificationsServices.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '10px 0' }}>
                  Aucune notification en cours
                </p>
              )}
            </div>
          </div>

          {/* ─── MODAL SCANNER QR ────────────────────────────────────────────── */}
          {showScanner && (
            <div style={modalOverlay} onClick={() => setShowScanner(false)}>
              <div style={scannerContainer} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>VÉRIFICATION QR</h3>
                  <X onClick={() => setShowScanner(false)} style={{ cursor: 'pointer' }} size={20} color="white" />
                </div>
                <div style={scanWindow}>
                  <div style={laserLine} />
                  <QrCode size={140} color="rgba(255,255,255,0.15)" />
                  <div style={cornerTL} /><div style={cornerTR} />
                  <div style={cornerBL} /><div style={cornerBR} />
                </div>
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '16px' }}>
                  Placez le code dans le cadre
                </p>
              </div>
            </div>
          )}

          {/* ─── MODAL DÉTAIL DOCUMENT ───────────────────────────────────────── */}
          {selectedDoc && (
            <div style={modalOverlay} onClick={() => setSelectedDoc(null)}>
              <div style={modalContentPro} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>{selectedDoc.label}</h3>
                  <X onClick={() => setSelectedDoc(null)} style={{ cursor: 'pointer' }} size={20} />
                </div>
                <div style={proDocCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ShieldCheck color="#0056D2" size={20} />
                    <span style={badgePro}>CERTIFIÉ CONFORME</span>
                  </div>
                  <div style={docIdDisplay}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1.5px' }}>
                      {selectedDoc.numeroMasque}
                    </span>
                    <ExternalLink size={14} color="#94a3b8" />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={docPhotoPlaceholder} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                      <div style={docLineFull} /><div style={docLineMid} /><div style={docLineShort} />
                    </div>
                  </div>
                  {selectedDoc.dateExpiration && (
                    <p style={{ margin: '12px 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>
                      Expire le : <strong>{selectedDoc.dateExpiration}</strong>
                    </p>
                  )}
                </div>
                <button onClick={() => setSelectedDoc(null)} style={closeBtnPro}>RETOUR</button>
              </div>
            </div>
          )}

        </div>

        {/* ─── NAV BAR ─────────────────────────────────────────────────────── */}
       <nav style={navBar}>
        <NavItem icon={<LayoutGrid size={24} />} label="Accueil"       active />
        <NavItem icon={<FileText size={24} />}   label="E-Admin"       onClick={() => navigate('/e-admin')} />
        <NavItem icon={<CreditCard size={24} />} label="Paiements"     onClick={() => navigate('/paiement')} />
        <NavItem icon={<Users size={24} />}      label="Participation" onClick={() => navigate('/reclamation')}  />
        <NavItem icon={<User size={24} />}       label="Profil"  onClick={() => navigate('/profil')}  />
      </nav>
      </div>

      <style>{`
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
        @keyframes scan { 0% { top: 20%; } 50% { top: 80%; } 100% { top: 20%; } }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ─────────────────────── SOUS-COMPOSANTS ORIGINAUX ────────────────────────────────────

const NOTIF_ICONS = {
  AMENDE:         { icon: <CreditCard size={20} color="#E70011" />, bg: '#FEF2F2', msgColor: '#E70011' },
  DOCUMENT_PRET: { icon: <FileText size={20} color="#0056D2" />,   bg: '#EEF2FF', msgColor: '#64748b' },
  SECURITE:       { icon: <ShieldCheck size={20} color="#059669" />, bg: '#ECFDF5', msgColor: '#64748b' },
  INFO:           { icon: <Bell size={20} color="#0056D2" />,        bg: '#EEF2FF', msgColor: '#64748b' },
};

const NotifItem = ({ notif, onClick }) => {
  const cfg = NOTIF_ICONS[notif.type] || NOTIF_ICONS.INFO;
  return (
    <div onClick={onClick} style={{ display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' }}>
      <div style={{ padding: '12px', background: cfg.bg, borderRadius: '15px' }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1 }}>
        <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800' }}>{notif.titre}</h5>
        <p style={{ margin: 0, fontSize: '0.75rem', color: cfg.msgColor }}>{notif.message}</p>
      </div>
      <ChevronRight size={18} color="#cbd5e1" />
    </div>
  );
};

const DocumentCard = ({ icon, title, color, textColor, onClick }) => (
  <div
    onClick={onClick}
    style={{
      minWidth: '130px', background: color, padding: '20px', borderRadius: '25px',
      display: 'flex', flexDirection: 'column', gap: '15px',
      border: `1px solid ${color}`, cursor: 'pointer'
    }}
  >
    <div style={{ color: textColor }}>{icon}</div>
    <span style={{ fontWeight: '900', color: textColor, fontSize: '0.75rem', letterSpacing: '0.3px' }}>{title}</span>
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

// Styles additionnels pour le simulateur de téléphone
const phoneStyles = {
  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', color: '#1e293b', background: '#0056D2', color: 'white' },
  statusTime: { fontWeight: '700', fontSize: '13px' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
};

export default Home;
