import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, ShieldCheck, LogOut, ChevronRight,
  QrCode, MapPin, Signal, Wifi, Battery, CreditCard,
  Calendar, Edit3, ChevronLeft, Copy, Check, Globe,
  Briefcase, Hash, Lock
} from 'lucide-react';

const Profil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nom: "Utilisateur",
    prenom: "",
    email: "non défini",
    telephone: "non défini",
    cin: "00000000",
    dateNaissance: "",
    adresse: "",
    ville: "",
    profession: "",
    dateInscription: "récemment",
    genre: ""
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'docs' | 'securite'

  useEffect(() => {
    const savedData = localStorage.getItem('user_ashel');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_ashel');
    localStorage.removeItem('ashel_token');
    navigate('/');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(userData.cin).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullName = [userData.prenom, userData.nom].filter(Boolean).join(' ') || userData.nom;
  const initials = fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <div style={styles.screenWrapper}>
      <div className="app-container">

        {/* Status Bar */}
        <div style={styles.statusBar}>
          <span style={styles.statusTime}>09:41</span>
          <div style={styles.statusIcons}><Signal size={13} /> <Wifi size={13} /> <Battery size={15} /></div>
        </div>

        {/* Content scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: '90px' }}>

          {/* ── HEADER ────────────────────────────────────────────────────────── */}
          <div style={styles.headerHero}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={() => navigate('/home')} style={styles.backBtn}>
                <ChevronLeft size={20} color="white" />
              </button>
              <h4 style={{ color: 'white', margin: 0, fontWeight: '800', fontSize: '0.95rem' }}>Mon Profil</h4>
              <button style={{ ...styles.backBtn, opacity: 0.6 }}>
                <Edit3 size={18} color="white" />
              </button>
            </div>

            {/* Avatar */}
            <div style={{ textAlign: 'center' }}>
              <div style={styles.avatarCircle}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0056D2' }}>{initials}</span>
              </div>
              <h3 style={styles.userName}>{fullName}</h3>
              <div style={styles.cinRow}>
                <Hash size={12} style={{ opacity: 0.7 }} />
                <span style={{ opacity: 0.75, fontSize: '0.8rem', letterSpacing: '1px' }}>{userData.cin}</span>
                <button onClick={handleCopyId} style={styles.copyBtn}>
                  {copied ? <Check size={12} color="#4ade80" /> : <Copy size={12} color="rgba(255,255,255,0.7)" />}
                </button>
              </div>
              <div style={styles.verifiedBadge}>
                <ShieldCheck size={14} color="#4ade80" />
                <span>Profil Vérifié</span>
              </div>
            </div>

            {/* Stats strip */}
            <div style={styles.statsStrip}>
              <div style={styles.statItem}>
                <span style={styles.statValue}>3</span>
                <span style={styles.statLabel}>Documents</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statValue}>0</span>
                <span style={styles.statLabel}>Amendes</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statValue}>Actif</span>
                <span style={styles.statLabel}>Statut</span>
              </div>
            </div>
          </div>

          {/* ── TABS ──────────────────────────────────────────────────────────── */}
          <div style={styles.tabRow}>
            {[
              { key: 'info', label: 'Informations' },
              { key: 'docs', label: 'Documents' },
              { key: 'securite', label: 'Sécurité' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{ ...styles.tabBtn, ...(activeTab === tab.key ? styles.tabBtnActive : {}) }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: INFORMATIONS ─────────────────────────────────────────────── */}
          {activeTab === 'info' && (
            <div style={{ padding: '0 20px' }}>

              <InfoSection title="Identité">
                <InfoRow icon={<User size={17} color="#0056D2" />} label="Nom complet" value={fullName} />
                {userData.genre && <InfoRow icon={<User size={17} color="#0056D2" />} label="Genre" value={userData.genre} />}
                {userData.dateNaissance && <InfoRow icon={<Calendar size={17} color="#0056D2" />} label="Date de naissance" value={userData.dateNaissance} />}
                <InfoRow icon={<CreditCard size={17} color="#0056D2" />} label="Numéro CIN" value={userData.cin} last />
              </InfoSection>

              <InfoSection title="Coordonnées">
                <InfoRow icon={<Mail size={17} color="#7C3AED" />} label="Adresse email" value={userData.email} />
                <InfoRow icon={<Phone size={17} color="#7C3AED" />} label="Téléphone" value={userData.telephone} />
                {userData.adresse && <InfoRow icon={<MapPin size={17} color="#7C3AED" />} label="Adresse" value={userData.adresse} />}
                {userData.ville && <InfoRow icon={<MapPin size={17} color="#7C3AED" />} label="Ville" value={userData.ville} />}
                <InfoRow icon={<Globe size={17} color="#7C3AED" />} label="Pays" value="Tunisie" last />
              </InfoSection>

              {userData.profession && (
                <InfoSection title="Professionnel">
                  <InfoRow icon={<Briefcase size={17} color="#EA580C" />} label="Profession" value={userData.profession} last />
                </InfoSection>
              )}

              <InfoSection title="Compte">
                <InfoRow icon={<Calendar size={17} color="#059669" />} label="Inscrit le" value={userData.dateInscription} last />
              </InfoSection>
            </div>
          )}

          {/* ── TAB: DOCUMENTS ────────────────────────────────────────────────── */}
          {activeTab === 'docs' && (
            <div style={{ padding: '0 20px' }}>
              {/* Digital ID Card */}
              <div style={styles.digitalIdCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div>
                    <p style={{ fontSize: '0.6rem', opacity: 0.6, margin: 0, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>République Tunisienne</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '900', margin: '4px 0 0', color: 'white' }}>Carte Numérique Citoyenne</p>
                  </div>
                  <ShieldCheck size={22} color="rgba(255,255,255,0.7)" />
                </div>
                <p style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 4px', color: 'white', letterSpacing: '-0.3px' }}>{fullName}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{userData.cin}</p>
                <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Inscrit le</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: '800', margin: 0, color: 'white' }}>{userData.dateInscription}</p>
                  </div>
                  <div style={{ background: 'white', borderRadius: '10px', padding: '8px' }}>
                    <QrCode size={38} color="#0056D2" />
                  </div>
                </div>
              </div>

              {/* Doc list */}
              <InfoSection title="Mes Documents">
                <DocRow icon={<CreditCard size={17} color="#0056D2" />} label="Carte d'Identité Nationale" status="Valide" color="#0056D2" bg="#EEF2FF" />
                <DocRow icon={<CreditCard size={17} color="#0369A1" />} label="Passeport" status="À renouveler" color="#DC2626" bg="#FEF2F2" />
                <DocRow icon={<CreditCard size={17} color="#EA580C" />} label="Permis de conduire" status="Valide" color="#0056D2" bg="#EEF2FF" last />
              </InfoSection>
            </div>
          )}

          {/* ── TAB: SÉCURITÉ ─────────────────────────────────────────────────── */}
          {activeTab === 'securite' && (
            <div style={{ padding: '0 20px' }}>
              <InfoSection title="Sécurité du compte">
                <div style={styles.securityItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#ECFDF5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={18} color="#059669" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '800', fontSize: '0.85rem', color: '#1e293b' }}>Vérification OTP</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#059669', fontWeight: '700' }}>Activée</p>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#cbd5e1" />
                </div>
                <div style={{ ...styles.securityItem, borderBottom: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#EEF2FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={18} color="#0056D2" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '800', fontSize: '0.85rem', color: '#1e293b' }}>Mot de passe</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>Modifier</p>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#cbd5e1" />
                </div>
              </InfoSection>

              <InfoSection title="Sessions">
                <div style={styles.sessionItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: '800', fontSize: '0.82rem', color: '#1e293b' }}>Session actuelle</p>
                      <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8' }}>Aujourd'hui • Tunis, TN</p>
                    </div>
                  </div>
                </div>
              </InfoSection>
            </div>
          )}

          {/* ── LOGOUT ────────────────────────────────────────────────────────── */}
          <div style={{ padding: '0 20px 20px' }}>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>

        </div>

        {/* ── NAV BAR ───────────────────────────────────────────────────────── */}
        <nav style={navBar}>
          <NavItem icon={<LayoutGridIcon />} label="Accueil"       onClick={() => navigate('/home')} />
          <NavItem icon={<FileTextIcon />}   label="E-Admin"       onClick={() => navigate('/e-admin')} />
          <NavItem icon={<CardIcon />}       label="Paiements"     onClick={() => navigate('/paiement')} />
          <NavItem icon={<UsersIcon />}      label="Participation" onClick={() => navigate('/reclamation')} />
          <NavItem icon={<UserIcon />}       label="Profil"        active />
        </nav>
      </div>

      <style>{`
        .app-container { 
          width: 390px; height: 844px; background: #f8fafc; 
          position: relative; overflow: hidden; border-radius: 50px; 
          border: 4px solid #334155; 
          box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25);
          display: flex; flex-direction: column;
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ── SUB COMPONENTS ────────────────────────────────────────────────────────────

const InfoSection = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <p style={{ fontSize: '0.68rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>{title}</p>
    <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {children}
    </div>
  </div>
);

const InfoRow = ({ icon, label, value, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: last ? 'none' : '1px solid #f1f5f9' }}>
    <div style={{ width: '34px', height: '34px', background: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8', fontWeight: '700' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#1e293b', fontWeight: '700' }}>{value || '—'}</p>
    </div>
  </div>
);

const DocRow = ({ icon, label, status, color, bg, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: last ? 'none' : '1px solid #f1f5f9', cursor: 'pointer' }}>
    <div style={{ width: '34px', height: '34px', background: bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b', fontWeight: '700' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color, fontWeight: '800' }}>{status}</p>
    </div>
    <ChevronRight size={16} color="#cbd5e1" />
  </div>
);

// Inline icon placeholders for nav
const LayoutGridIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const FileTextIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const CardIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const UsersIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', flex: 1 }}>
    <div style={{ color: active ? '#0056D2' : '#94a3b8' }}>{icon}</div>
    <span style={{ fontSize: '0.6rem', fontWeight: '700', color: active ? '#0056D2' : '#94a3b8' }}>{label}</span>
  </div>
);

const navBar = {
  position: 'absolute', bottom: 0, left: 0, right: 0, height: '85px',
  background: 'white', display: 'flex', justifyContent: 'space-around',
  alignItems: 'center', padding: '0 10px 15px 10px',
  borderTop: '1px solid #f1f5f9', zIndex: 100,
  boxShadow: '0 -10px 25px rgba(0,0,0,0.03)'
};

const styles = {
  screenWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0' },
  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#0056D2', color: 'white' },
  statusTime: { fontWeight: '700', fontSize: '13px' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
  headerHero: {
    background: 'linear-gradient(160deg, #1e293b 0%, #0056D2 100%)',
    padding: '20px 20px 0', color: 'white',
    borderBottomLeftRadius: '36px', borderBottomRightRadius: '36px',
    marginBottom: '6px'
  },
  backBtn: { width: '38px', height: '38px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  avatarCircle: {
    width: '82px', height: '82px', borderRadius: '26px',
    background: 'white', margin: '0 auto 14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
  },
  userName: { margin: '0 0 6px', fontSize: '1.3rem', fontWeight: '900', textAlign: 'center' },
  cinRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px' },
  copyBtn: { background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  verifiedBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700', margin: '0 auto 20px', width: 'fit-content' },
  statsStrip: { display: 'flex', justifyContent: 'space-around', background: 'rgba(255,255,255,0.1)', borderRadius: '18px', padding: '14px 10px', margin: '0 0 20px' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  statValue: { fontSize: '1rem', fontWeight: '900', color: 'white' },
  statLabel: { fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  statDivider: { width: '1px', background: 'rgba(255,255,255,0.2)' },
  tabRow: { display: 'flex', padding: '16px 20px 8px', gap: '8px' },
  tabBtn: { flex: 1, padding: '10px 0', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', cursor: 'pointer' },
  tabBtnActive: { background: '#0056D2', color: 'white', border: '1px solid #0056D2' },
  logoutBtn: { width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#FEF2F2', color: '#EF4444', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' },
  digitalIdCard: {
    background: 'linear-gradient(135deg, #0056D2, #003FA3)',
    borderRadius: '24px', padding: '22px', marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(0,86,210,0.3)'
  },
  securityItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
  sessionItem: { padding: '14px 18px' },
};

export default Profil;