import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, FileText, CreditCard, Users, LayoutGrid,
  User, CreditCard as PassportIcon, Car,
  ChevronRight, Search, QrCode, Signal, Wifi, Battery, X, ScanLine, ShieldCheck, ExternalLink
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  // Optimisation : Memoïsation des données utilisateur pour éviter les parse répétitifs
  const userData = useMemo(() => {
    try {
      const saved = localStorage.getItem('user_ashel');
      return saved ? JSON.parse(saved) : { nom: 'Citoyen Tunisien', cin: '00000000' };
    } catch (e) {
      return { nom: 'Citoyen Tunisien', cin: '00000000' };
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('user_ashel')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_ashel');
    navigate('/');
  };

  const formatCIN = (cin) => {
    if (!cin) return '********';
    const strCin = String(cin);
    if (strCin.length < 8) return strCin;
    return `${strCin.substring(0, 3)}****${strCin.substring(strCin.length - 1)}`;
  };

  return (
    <div style={viewport}>
      <div style={phoneFrame}>
        
        <div style={statusBar}>
          <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '-0.2px' }}>09:41</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Signal size={14} strokeWidth={2.5} /> <Wifi size={14} strokeWidth={2.5} /> <Battery size={18} strokeWidth={2} />
          </div>
        </div>

        <div style={scrollContent}>
          
          <div style={headerStyle}>
            <div style={headerBgIcons}>
              <LayoutGrid size={320} style={{ position: 'absolute', right: -60, top: -60, opacity: 0.08 }} />
            </div>

            <div style={headerTopRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={avatarBox}><User size={24} color="white" /></div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, letterSpacing: '-0.3px' }}>{userData.nom}</h3>
                  <p style={{ fontSize: '0.7rem', opacity: 0.8, margin: 0, fontWeight: '600' }}>ID: {formatCIN(userData.cin)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={iconCircle}><Bell size={18} /></div>
                <button onClick={handleLogout} style={logoutBtn}>QUITTER</button>
              </div>
            </div>

            <div onClick={() => setShowScanner(true)} style={idCardStyle}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={qrIconBox}><QrCode size={24} /></div>
                <div>
                  <p style={labelCap}>IDENTITÉ DIGITALE</p>
                  <p style={statusText}>ACTIF / VÉRIFIÉ</p>
                </div>
              </div>
              <div style={scanPulse}>SCANNER</div>
            </div>
          </div>

          <div style={{ padding: '25px 20px 0 20px' }}>
            <div style={sectionHeader}>
              <h4 style={sectionTitle}>Mes Documents</h4>
              <span style={viewAllLink}>Tout voir</span>
            </div>

            <div style={docScrollContainer}>
              <DocumentCard 
                icon={<CreditCard size={20} />} title="CIN" color="#F1F5FF" textColor="#0056D2" 
                onClick={() => setSelectedDoc({ title: "Carte d'Identité", id: userData.cin })}
              />
              <DocumentCard 
                icon={<PassportIcon size={20} />} title="PASSEPORT" color="#F0F9FF" textColor="#0369A1" 
                onClick={() => setSelectedDoc({ title: "Passeport Tunisien", id: "P-TN99210" })}
              />
              <DocumentCard 
                icon={<Car size={20} />} title="PERMIS" color="#FFF9F5" textColor="#EA580C" 
                onClick={() => setSelectedDoc({ title: "Permis de Conduire", id: "01/12345" })}
              />
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            <h4 style={sectionTitle}>Notifications de services</h4>
            <div style={notifBox}>
              <div onClick={() => navigate('/e-amende')} style={notifItem}>
                <div style={notifIconRed}><CreditCard size={18} /></div>
                <div style={{ flex: 1 }}>
                  <h5 style={notifTitle}>E-Amende</h5>
                  <p style={notifSubRed}>1 amende non payée (60.000 DT)</p>
                </div>
                <ChevronRight size={16} color="#cbd5e1" />
              </div>

              <div style={notifDivider} />

              <div onClick={() => navigate('/e-admin')} style={notifItem}>
                <div style={notifIconBlue}><FileText size={18} /></div>
                <div style={{ flex: 1 }}>
                  <h5 style={notifTitle}>E-Administration</h5>
                  <p style={notifSubGrey}>Extrait de naissance disponible</p>
                </div>
                <ChevronRight size={16} color="#cbd5e1" />
              </div>
            </div>
          </div>
          <div style={{ height: '100px' }} />
        </div>

        <nav style={navBar}>
          <NavItem icon={<LayoutGrid size={22} />} label="Accueil" active />
          <NavItem icon={<FileText size={22} />} label="E-Admin" onClick={() => navigate('/e-admin')} />
          <NavItem icon={<CreditCard size={22} />} label="Amendes" onClick={() => navigate('/e-amende')} />
          <NavItem icon={<User size={22} />} label="Profil" onClick={() => navigate('/profil')} />
        </nav>

        {showScanner && (
          <div style={modalOverlay} onClick={() => setShowScanner(false)}>
            <div style={scannerContainer} onClick={e => e.stopPropagation()}>
              <div style={modalHeaderPro}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>VÉRIFICATION QR</h3>
                <X onClick={() => setShowScanner(false)} style={{ cursor: 'pointer' }} size={20} />
              </div>
              <div style={scanWindow}>
                <div style={laserLine} />
                <QrCode size={140} color="rgba(255,255,255,0.15)" />
                <div style={cornerTL} /><div style={cornerTR} />
                <div style={cornerBL} /><div style={cornerBR} />
              </div>
              <p style={scannerSub}>Placez le code dans le cadre</p>
            </div>
          </div>
        )}

        {selectedDoc && (
          <div style={modalOverlay} onClick={() => setSelectedDoc(null)}>
            <div style={modalContentPro} onClick={e => e.stopPropagation()}>
              <div style={modalHeaderProBlack}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>{selectedDoc.title}</h3>
                <X onClick={() => setSelectedDoc(null)} style={{ cursor: 'pointer' }} size={20} />
              </div>
              <div style={proDocCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ShieldCheck color="#0056D2" size={20} />
                  <span style={badgePro}>CERTIFIÉ CONFORME</span>
                </div>
                <div style={docIdDisplay}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1.5px' }}>{selectedDoc.id}</span>
                  <ExternalLink size={14} color="#94a3b8" />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={docPhotoPlaceholder} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                    <div style={docLineFull} /><div style={docLineMid} /><div style={docLineShort} />
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} style={closeBtnPro}>RETOUR</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
        .app-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// --- STYLES (INCHANGÉS) ---
const viewport = { backgroundColor: '#e2e8f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const phoneFrame = { width: '375px', height: '780px', backgroundColor: '#ffffff', borderRadius: '50px', border: '12px solid #0f172a', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column' };
const statusBar = { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', color: '#1e293b' };
const scrollContent = { flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc' };
const headerStyle = { background: 'linear-gradient(135deg, #0056D2 0%, #00388F 100%)', height: '210px', padding: '20px 24px', color: 'white', borderBottomLeftRadius: '35px', borderBottomRightRadius: '35px', position: 'relative' };
const headerTopRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' };
const avatarBox = { width: '42px', height: '42px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' };
const iconCircle = { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const headerBgIcons = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' };
const logoutBtn = { fontSize: '0.65rem', fontWeight: '900', color: 'white', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer' };
const idCardStyle = { background: 'white', borderRadius: '22px', padding: '16px 20px', marginTop: '22px', boxShadow: '0 12px 25px -5px rgba(0,0,0,0.12)', color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' };
const qrIconBox = { color: '#0056D2', background: '#f1f5ff', padding: '10px', borderRadius: '14px' };
const labelCap = { fontSize: '0.65rem', color: '#94a3b8', margin: 0, fontWeight: '800', letterSpacing: '0.8px' };
const statusText = { fontSize: '0.85rem', fontWeight: '900', margin: 0, color: '#003FA3' };
const scanPulse = { fontSize: '0.6rem', fontWeight: '900', color: '#0056D2', background: '#eef2ff', padding: '5px 12px', borderRadius: '20px', animation: 'pulse 2s infinite' };
const sectionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' };
const sectionTitle = { fontWeight: '900', fontSize: '0.95rem', color: '#0f172a', margin: 0, letterSpacing: '-0.2px' };
const viewAllLink = { fontSize: '0.75rem', color: '#0056D2', fontWeight: '800' };
const docScrollContainer = { display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '10px' };
const notifBox = { background: 'white', borderRadius: '24px', padding: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' };
const notifItem = { display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' };
const notifIconRed = { padding: '12px', background: '#FFF1F2', borderRadius: '14px', color: '#E11D48' };
const notifIconBlue = { padding: '12px', background: '#F0F7FF', borderRadius: '14px', color: '#0056D2' };
const notifTitle = { margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' };
const notifSubRed = { margin: 0, fontSize: '0.7rem', color: '#E11D48', fontWeight: '600' };
const notifSubGrey = { margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '600' };
const notifDivider = { height: '1px', background: '#f1f5f9', margin: '16px 0' };
const navBar = { position: 'absolute', bottom: 0, left: 0, right: 0, height: '85px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px 15px 10px', borderTop: '1px solid rgba(0,0,0,0.05)', zIndex: 100 };
const modalOverlay = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' };
const modalContentPro = { background: 'white', borderRadius: '32px', padding: '24px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' };
const modalHeaderPro = { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: 'white', letterSpacing: '1px' };
const modalHeaderProBlack = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#0f172a', letterSpacing: '0.5px' };
const proDocCard = { background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const badgePro = { fontSize: '8px', fontWeight: '900', color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' };
const docIdDisplay = { height: '48px', background: '#f8fafc', margin: '16px 0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', border: '1px solid #f1f5f9' };
const closeBtnPro = { width: '100%', padding: '16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '16px', marginTop: '20px', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '1px' };
const scannerContainer = { width: '100%', textAlign: 'center' };
const scanWindow = { width: '240px', height: '240px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', overflow: 'hidden' };
const laserLine = { position: 'absolute', width: '100%', height: '2px', background: '#0056D2', boxShadow: '0 0 15px #0056D2', animation: 'scan 2.5s linear infinite' };
const scannerSub = { color: 'white', fontSize: '0.75rem', marginTop: '20px', opacity: 0.7, fontWeight: '600' };
const cornerBase = { position: 'absolute', width: '24px', height: '24px', borderColor: '#0056D2', borderStyle: 'solid' };
const cornerTL = { ...cornerBase, top: 0, left: 0, borderLeftWidth: '5px', borderTopWidth: '5px', borderTopLeftRadius: '12px' };
const cornerTR = { ...cornerBase, top: 0, right: 0, borderRightWidth: '5px', borderTopWidth: '5px', borderTopRightRadius: '12px' };
const cornerBL = { ...cornerBase, bottom: 0, left: 0, borderLeftWidth: '5px', borderBottomWidth: '5px', borderBottomLeftRadius: '12px' };
const cornerBR = { ...cornerBase, bottom: 0, right: 0, borderRightWidth: '5px', borderBottomWidth: '5px', borderBottomRightRadius: '12px' };
const docPhotoPlaceholder = { width: '65px', height: '80px', background: '#f1f5f9', borderRadius: '8px' };
const docLineFull = { height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px' };
const docLineMid = { height: '8px', width: '70%', background: '#f1f5f9', borderRadius: '4px' };
const docLineShort = { height: '8px', width: '40%', background: '#f1f5f9', borderRadius: '4px' };

const DocumentCard = ({ icon, title, color, textColor, onClick }) => (
  <div onClick={onClick} style={{ minWidth: '115px', background: color, padding: '18px', borderRadius: '22px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
    <div style={{ color: textColor }}>{icon}</div>
    <span style={{ fontWeight: '900', color: textColor, fontSize: '0.75rem', letterSpacing: '0.3px' }}>{title}</span>
  </div>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}>
    <div style={{ color: active ? '#0056D2' : '#94a3b8', transition: 'color 0.3s' }}>{icon}</div>
    <span style={{ fontSize: '0.6rem', fontWeight: '800', color: active ? '#0056D2' : '#94a3b8' }}>{label}</span>
  </div>
);

export default Home;