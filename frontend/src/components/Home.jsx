import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, FileText, CreditCard, Users, LayoutGrid,
  User, CreditCard as PassportIcon, Car,
  ChevronRight, Search, QrCode, MessageSquare,
  X, ShieldCheck, ExternalLink, Loader2,
  Signal, Wifi, Battery, LogOut, ArrowRight
} from 'lucide-react';
import { homeAPI } from '../services/api';

// ─────────────────────── STYLES ───────────────────────────────────────────────

const navBar = {
  position: 'absolute', bottom: 0, left: 0, right: 0, height: '85px',
  background: 'white', display: 'flex', justifyContent: 'space-around',
  alignItems: 'center', padding: '0 10px 15px 10px',
  borderTop: '1px solid #f1f5f9', zIndex: 100,
  boxShadow: '0 -10px 25px rgba(0,0,0,0.03)'
};
const modalOverlay = {
  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  backdropFilter: 'blur(4px)'
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

  const [dashboard, setDashboard]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedDoc, setSelectedDoc]   = useState(null);
  const [showScanner, setShowScanner]   = useState(false);
  const [showSearch, setShowSearch]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [showNotifs, setShowNotifs]     = useState(false);
  const [showDigitalId, setShowDigitalId] = useState(false);
  const [showAllDocs, setShowAllDocs]   = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ashel_token');
    if (!token) { navigate('/'); return; }

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
    setShowNotifs(false);
    navigate(notif.routeCible);
  };

  // Search filter across documents
  const searchResults = dashboard && searchQuery.length > 1
    ? [
        ...(dashboard.documents || []).filter(d => d.label?.toLowerCase().includes(searchQuery.toLowerCase())),
      ]
    : [];

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
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: '#0056D2', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Réessayer</button>
        </div>
      </div>
    );
  }

  const { profil, identiteDigitale, documents, notificationsServices } = dashboard;
  const unreadCount = notificationsServices.filter(n => !n.estLu).length;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0', padding: '20px', fontFamily: 'sans-serif' }}>
      <div className="app-container">

        {/* Status Bar */}
        <div style={phoneStyles.statusBar}>
          <span style={phoneStyles.statusTime}>09:41</span>
          <div style={phoneStyles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden', paddingBottom: '100px', scrollbarWidth: 'none' }}>

          {/* ─── HEADER ─────────────────────────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
            padding: '20px 25px 30px', color: 'white',
            borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.06, pointerEvents: 'none' }}>
              <LayoutGrid size={300} style={{ position: 'absolute', right: -50, top: -50 }} />
            </div>

            {/* Top row: avatar + name + icons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              {/* Left: avatar + name */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onClick={() => navigate('/profil')}
              >
                <div style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.22)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                  <User size={26} />
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', opacity: 0.75, margin: 0, fontWeight: '600' }}>Bonjour 👋</p>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '900', margin: 0, letterSpacing: '-0.3px' }}>{profil.nomComplet}</h3>
                </div>
              </div>

              {/* Right: action icons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Search */}
                <button
                  onClick={() => { setShowSearch(true); setShowNotifs(false); }}
                  style={iconBtn}
                  title="Rechercher"
                >
                  <Search size={18} />
                </button>

                {/* Notifications */}
                <button
                  onClick={() => { setShowNotifs(true); setShowSearch(false); }}
                  style={{ ...iconBtn, position: 'relative' }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#E70011', color: 'white', fontSize: '9px', fontWeight: '900', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0056D2' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile shortcut */}
                <button
                  onClick={() => navigate('/profil')}
                  style={iconBtn}
                  title="Mon profil"
                >
                  <User size={18} />
                </button>
              </div>
            </div>

            {/* CIN tag */}
            <div style={{ marginTop: '8px', paddingLeft: '58px', position: 'relative', zIndex: 2 }}>
              <span style={{ fontSize: '0.72rem', opacity: 0.7, fontWeight: '700' }}>ID No.: {profil.cinMasque}</span>
            </div>

            {/* Digital Identity Card */}
            <div
              onClick={() => setShowDigitalId(true)}
              style={{
                background: 'white', borderRadius: '22px', padding: '18px 20px', marginTop: '22px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.15)', color: '#1e293b',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', position: 'relative', zIndex: 2,
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #0056D2, #003FA3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={24} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Votre Identité Digitale</p>
                  <p style={{ fontSize: '0.92rem', fontWeight: '900', margin: '2px 0 0', color: '#003FA3' }}>{identiteDigitale.label}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', borderRadius: '10px', padding: '8px 12px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#0056D2' }}>VOIR</span>
                <ChevronRight size={14} color="#0056D2" />
              </div>
            </div>
          </div>

          {/* ─── MES DOCUMENTS ──────────────────────────────────────────────── */}
          <div style={{ padding: '28px 20px 0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b', margin: 0 }}>Mes Documents</h4>
              <button
                onClick={() => setShowAllDocs(true)}
                style={{ fontSize: '0.8rem', color: '#0056D2', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
              >
                Voir tout <ArrowRight size={14} />
              </button>
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

          {/* ─── NOTIFICATIONS DE SERVICES ──────────────────────────────────── */}
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
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '10px 0' }}>Aucune notification en cours</p>
              )}
            </div>
          </div>

          {/* ─── MODAL SEARCH ────────────────────────────────────────────────── */}
          {showSearch && (
            <div style={modalOverlay} onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
              <div style={{ ...modalContentPro, paddingBottom: '30px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: '#1e293b' }}>Rechercher</h3>
                  <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={22} color="#64748b" />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f1f5f9', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px' }}>
                  <Search size={18} color="#94a3b8" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un document, service..."
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.9rem', outline: 'none', color: '#1e293b', fontWeight: '600' }}
                  />
                  {searchQuery && <X size={16} color="#94a3b8" onClick={() => setSearchQuery('')} style={{ cursor: 'pointer' }} />}
                </div>
                {searchQuery.length > 1 && (
                  <div>
                    {searchResults.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: '0.85rem' }}>Aucun résultat pour « {searchQuery} »</p>
                    ) : (
                      searchResults.map(doc => {
                        const cfg = DOC_CONFIG[doc.type] || DOC_CONFIG.CIN;
                        return (
                          <div key={doc.id} onClick={() => { setSelectedDoc(doc); setShowSearch(false); setSearchQuery(''); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                            <div style={{ width: '40px', height: '40px', background: cfg.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.textColor }}>
                              {cfg.icon}
                            </div>
                            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{doc.label}</span>
                            <ChevronRight size={16} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                {!searchQuery && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
                    {['CIN', 'Passeport', 'Permis', 'Amende'].map(tag => (
                      <button key={tag} onClick={() => setSearchQuery(tag)} style={{ background: '#EEF2FF', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: '700', color: '#0056D2', cursor: 'pointer' }}>{tag}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── MODAL NOTIFICATIONS ─────────────────────────────────────────── */}
          {showNotifs && (
            <div style={modalOverlay} onClick={() => setShowNotifs(false)}>
              <div style={{ ...modalContentPro, maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: '#1e293b' }}>Notifications</h3>
                    {unreadCount > 0 && <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>}
                  </div>
                  <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={22} color="#64748b" />
                  </button>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {notificationsServices.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0', fontSize: '0.85rem' }}>Aucune notification</p>
                  ) : (
                    notificationsServices.map((notif, index) => (
                      <React.Fragment key={notif.id}>
                        {index > 0 && <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />}
                        <NotifItem notif={notif} onClick={() => handleNotifClick(notif)} showUnread />
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── MODAL IDENTITÉ DIGITALE ──────────────────────────────────────── */}
          {showDigitalId && (
            <div style={modalOverlay} onClick={() => setShowDigitalId(false)}>
              <div style={{ ...modalContentPro }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#1e293b' }}>Identité Digitale</h3>
                  <button onClick={() => setShowDigitalId(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={22} color="#64748b" />
                  </button>
                </div>
                {/* Digital ID Card */}
                <div style={{ background: 'linear-gradient(135deg, #0056D2, #003FA3)', borderRadius: '24px', padding: '24px', color: 'white', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
                    <QrCode size={120} color="white" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <p style={{ fontSize: '0.6rem', opacity: 0.7, margin: 0, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>République Tunisienne</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: '900', margin: '4px 0 0' }}>Identité Digitale Citoyenne</p>
                    </div>
                    <ShieldCheck size={24} color="rgba(255,255,255,0.8)" />
                  </div>
                  <p style={{ fontSize: '1.3rem', fontWeight: '900', margin: '0 0 4px', letterSpacing: '1px' }}>{profil.nomComplet}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.75, margin: 0 }}>CIN: {profil.cinMasque}</p>
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.6rem', opacity: 0.6, margin: 0 }}>ID DIGITAL</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: '800', margin: 0 }}>{identiteDigitale.label}</p>
                    </div>
                    <div style={{ background: 'white', borderRadius: '10px', padding: '8px' }}>
                      <QrCode size={40} color="#0056D2" />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0fdf4', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px' }}>
                  <ShieldCheck size={18} color="#16a34a" />
                  <p style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: '700', margin: 0 }}>Identité certifiée et sécurisée par l'État tunisien</p>
                </div>
                <button onClick={() => setShowDigitalId(false)} style={closeBtnPro}>FERMER</button>
              </div>
            </div>
          )}

          {/* ─── MODAL TOUS LES DOCUMENTS ─────────────────────────────────────── */}
          {showAllDocs && (
            <div style={modalOverlay} onClick={() => setShowAllDocs(false)}>
              <div style={{ ...modalContentPro, maxHeight: '75vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: '#1e293b' }}>Tous mes documents</h3>
                  <button onClick={() => setShowAllDocs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={22} color="#64748b" />
                  </button>
                </div>
                <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {documents.map(doc => {
                    const cfg = DOC_CONFIG[doc.type] || DOC_CONFIG.CIN;
                    return (
                      <div key={doc.id}
                        onClick={() => { setSelectedDoc(doc); setShowAllDocs(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', borderRadius: '18px', padding: '16px 18px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '48px', height: '48px', background: cfg.color, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.textColor, flexShrink: 0 }}>
                          {cfg.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: '800', fontSize: '0.9rem', color: '#1e293b' }}>{doc.label}</p>
                          {doc.dateExpiration && <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>Expire: {doc.dateExpiration}</p>}
                        </div>
                        <ChevronRight size={18} color="#cbd5e1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '16px' }}>Placez le code dans le cadre</p>
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
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1.5px' }}>{selectedDoc.numeroMasque}</span>
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
          <NavItem icon={<LayoutGrid size={24} />} label="Accueil" active />
          <NavItem icon={<FileText size={24} />}   label="E-Admin"       onClick={() => navigate('/e-admin')} />
          <NavItem icon={<CreditCard size={24} />} label="Paiements"     onClick={() => navigate('/paiement')} />
          <NavItem icon={<Users size={24} />}      label="Participation" onClick={() => navigate('/participation')} />
          <NavItem icon={<User size={24} />}       label="Profil"        onClick={() => navigate('/profil')} />
        </nav>
      </div>

      <style>{`
        .app-container { 
          width: 390px; height: 844px; background: #ffffff; position: relative; 
          overflow: hidden; display: flex; flex-direction: column; 
          box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); 
          border-radius: 50px; border: 4px solid #334155; 
        }
        @keyframes scan { 0% { top: 20%; } 50% { top: 80%; } 100% { top: 20%; } }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ─────────────────────── ICON BUTTON STYLE ────────────────────────────────────
const iconBtn = {
  width: '38px', height: '38px', borderRadius: '12px',
  background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', position: 'relative', backdropFilter: 'blur(4px)'
};

// ─────────────────────── SOUS-COMPOSANTS ─────────────────────────────────────

const NOTIF_ICONS = {
  AMENDE:         { icon: <CreditCard size={20} color="#E70011" />, bg: '#FEF2F2', msgColor: '#E70011' },
  DOCUMENT_PRET: { icon: <FileText size={20} color="#0056D2" />,   bg: '#EEF2FF', msgColor: '#64748b' },
  SECURITE:       { icon: <ShieldCheck size={20} color="#059669" />, bg: '#ECFDF5', msgColor: '#64748b' },
  INFO:           { icon: <Bell size={20} color="#0056D2" />,        bg: '#EEF2FF', msgColor: '#64748b' },
};

const NotifItem = ({ notif, onClick, showUnread }) => {
  const cfg = NOTIF_ICONS[notif.type] || NOTIF_ICONS.INFO;
  return (
    <div onClick={onClick} style={{ display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer', opacity: showUnread && notif.estLu ? 0.6 : 1 }}>
      <div style={{ padding: '12px', background: cfg.bg, borderRadius: '15px', position: 'relative' }}>
        {cfg.icon}
        {showUnread && !notif.estLu && (
          <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '8px', height: '8px', background: '#E70011', borderRadius: '50%', border: '1.5px solid white' }} />
        )}
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

const phoneStyles = {
  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#0056D2', color: 'white' },
  statusTime: { fontWeight: '700', fontSize: '13px' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
};

export default Home;

