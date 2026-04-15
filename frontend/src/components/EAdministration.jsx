import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import {

  ArrowLeft, FileText, Search, ShieldCheck,

  ChevronRight, Users, Briefcase, Bell,

  Home as HomeIcon, ClipboardList, Shield, X, CheckCircle,

  Signal, Wifi, Battery

} from 'lucide-react';



// --- CONSTANTES DE DONNÉES ---

const CATEGORIES = ["Tous", "Famille", "Justice", "Social", "RNE"];



const SERVICES = [

  { id: 1, title: "Extrait de Naissance", cat: "Famille", icon: <Users size={22} />, prix: "2.500" },

  { id: 2, title: "Bulletin N°3", cat: "Justice", icon: <ShieldCheck size={22} />, prix: "5.000" },

  { id: 3, title: "Registre de Commerce", cat: "RNE", icon: <Briefcase size={22} />, prix: "10.000" },

  { id: 4, title: "Attestation de Travail", cat: "Social", icon: <FileText size={22} />, prix: "2.000" },

  { id: 5, title: "Certificat de Résidence", cat: "Famille", icon: <HomeIcon size={22} />, prix: "2.000" },

  { id: 6, title: "Fiche de Paie (CNRPS)", cat: "Social", icon: <ClipboardList size={22} />, prix: "1.000" }

];



const EAdministration = () => {

  const navigate = useNavigate();

  const [view, setView] = useState('list');

  const [searchTerm, setSearchTerm] = useState("");

  const [activeCategory, setActiveCategory] = useState("Tous");

 

  const [showNotifs, setShowNotifs] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const [notifications, setNotifications] = useState([

    { id: 1, title: "Document Prêt", msg: "Votre Extrait de Naissance est disponible.", time: "Il y a 2h", read: false },

    { id: 2, title: "Sécurité", msg: "Connexion réussie via ID-Numérique.", time: "Hier", read: true }

  ]);



  // FONCTION DE PAIEMENT AJOUTÉE

  const handleServiceClick = (service) => {

    // On redirige vers ta nouvelle page de paiement avec les infos du document

    navigate('/paiement-administration', {

      state: {

        docName: service.title,

        montant: service.prix

      }

    });

  };



  useEffect(() => {

    const toastTimer = setTimeout(() => {

      setShowToast(true);

      const newNotif = { id: Date.now(), title: "Mise à jour", msg: "Votre Bulletin N°3 est en cours de signature.", time: "À l'instant", read: false };

      setNotifications(prev => [newNotif, ...prev]);

      setTimeout(() => setShowToast(false), 5000);

    }, 4000);

    return () => clearTimeout(toastTimer);

  }, []);



  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);



  const markAllAsRead = useCallback(() => {

    setNotifications(prev => prev.map(n => ({...n, read: true})));

  }, []);



  const filteredServices = useMemo(() => {

    return SERVICES.filter(s =>

      (activeCategory === "Tous" || s.cat === activeCategory) &&

      s.title.toLowerCase().includes(searchTerm.toLowerCase())

    );

  }, [activeCategory, searchTerm]);



  // Rendu du coffre-fort conservé

  if (view === 'vault') return <DocumentVault onBack={() => setView('list')} />;



  return (

    <div style={phoneStyles.screenWrapper}>

      <div className="app-container">

        {/* Barre d'état iPhone Style */}

        <div style={phoneStyles.statusBar}>

          <span style={phoneStyles.statusTime}>09:41</span>

          <div style={phoneStyles.statusIcons}>

            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />

          </div>

        </div>



        <div style={styles.container} className="fade-in">

         

          {/* TOAST SECURE */}

          {showToast && (

            <div style={styles.toastContainer} className="slide-down">

              <div style={styles.toastContent}>

                <div style={styles.toastIcon}><CheckCircle size={18} color="white" /></div>

                <div style={{flex: 1}}>

                  <p style={styles.toastTitle}>Notification Système</p>

                  <p style={styles.toastText}>Nouvelle mise à jour de dossier.</p>

                </div>

                <button onClick={() => setShowToast(false)} style={styles.toastClose}><X size={14} /></button>

              </div>

            </div>

          )}



          {/* DRAWER NOTIFICATIONS */}

          {showNotifs && (

            <div style={styles.notifOverlay} onClick={() => { setShowNotifs(false); markAllAsRead(); }}>

              <div style={styles.notifDrawer} onClick={e => e.stopPropagation()} className="slide-right">

                <div style={styles.notifHeader}>

                  <h3 style={{margin:0, fontSize: '1.1rem', fontWeight: 800}}>Notifications</h3>

                  <button onClick={() => { setShowNotifs(false); markAllAsRead(); }} style={styles.closeBtn}><X size={20}/></button>

                </div>

                <div style={{padding: '10px 20px'}}>

                  {notifications.map(n => (

                    <div key={n.id} style={{...styles.notifItem, opacity: n.read ? 0.6 : 1}}>

                      <div style={n.read ? styles.dotRead : styles.dotUnread}></div>

                      <div style={{flex: 1}}>

                        <p style={styles.nTitle}>{n.title}</p>

                        <p style={styles.nMsg}>{n.msg}</p>

                        <p style={styles.nTime}>{n.time}</p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          )}



          {/* BANDEAU DE SÉCURITÉ GOUVERNEMENTAL */}

          <div style={styles.securityBanner}>

            <ShieldCheck size={14} className="pulse" />

            <span>AUTHENTIFICATION NATIONALE — SESSION CHIFFRÉE</span>

            <button onClick={() => setShowNotifs(true)} style={styles.bellBtn}>

              <Bell size={16} color="#68D391" />

              {unreadCount > 0 && <span style={styles.redBadge}>{unreadCount}</span>}

            </button>

          </div>



          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>

            <header style={styles.header}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

                <button onClick={() => navigate('/home')} style={styles.iconBtn} aria-label="Retour">

                  <ArrowLeft size={20} />

                </button>

                <h2 style={styles.mainTitle}>Administration</h2>

              </div>

              <button onClick={() => setView('vault')} style={styles.vaultBtn} title="Coffre-fort">

                <Shield size={20} />

              </button>

            </header>



            {/* RECHERCHE */}

            <div style={styles.searchBox}>

              <Search size={18} color="#A0AEC0" />

              <input

                type="text"

                placeholder="Rechercher un document officiel..."

                style={styles.inputNone}

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

              />

            </div>



            {/* FILTRES PAR CATÉGORIE */}

            <div style={styles.scrollX}>

              {CATEGORIES.map(c => (

                <button

                  key={c}

                  onClick={() => setActiveCategory(c)}

                  style={{

                    ...styles.chipStyle,

                    backgroundColor: activeCategory === c ? '#0056D2' : 'white',

                    color: activeCategory === c ? 'white' : '#4A5568',

                    borderColor: activeCategory === c ? '#0056D2' : '#E2E8F0'

                  }}

                >

                  {c}

                </button>

              ))}

            </div>



            {/* GRILLE DES SERVICES MODIFIÉE POUR APPELER LE PAIEMENT */}

            <div style={styles.gridServices}>

              {filteredServices.map((service, index) => (

                <button

                  key={service.id}

                  onClick={() => handleServiceClick(service)} // APPEL DU PAIEMENT ICI

                  style={{...styles.cardService, animationDelay: `${index * 0.05}s`}}

                  className="slide-up"

                >

                  <div style={styles.iconCircle}>{service.icon}</div>

                  <span style={styles.cardText}>{service.title}</span>

                  <ChevronRight size={14} color="#CBD5E0" style={{marginTop: 'auto'}}/>

                </button>

              ))}

            </div>



            {/* SECTION SUIVI */}

            <h4 style={styles.sectionLabel}>DOSSIERS EN COURS</h4>

            <div style={styles.statusCard} onClick={() => setView('vault')} className="status-hover">

              <div style={styles.indicatorYellow}></div>

              <div style={{ flex: 1 }}>

                <p style={styles.statusTitle}>Bulletin N°3</p>

                <p style={styles.statusSub}>En cours de signature électronique...</p>

              </div>

              <span style={styles.timeLabel}>Paiement Reçu</span>

            </div>

          </div>

        </div>

      </div>



      <style>{`

        .app-container {

          width: 390px;

          height: 844px;

          background: #F8FAFC;

          position: relative;

          overflow: hidden;

          display: flex;

          flex-direction: column;

          box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25);

          border-radius: 50px;

          border: 4px solid #334155;

        }

        .pulse { animation: pulse 2s infinite; }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

        .fade-in { animation: fadeIn 0.4s ease-out; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .slide-up { animation: slideUp 0.5s ease-out both; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .slide-down { animation: slideDown 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28); }

        @keyframes slideDown { from { transform: translateY(-100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .slide-right { animation: slideRight 0.3s ease-out; }

        @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .status-hover:active { transform: scale(0.98); background: #F7FAFC; }

        * { scrollbar-width: none; }

        *::-webkit-scrollbar { display: none; }

      `}</style>

    </div>

  );

};



// --- DESIGN SYSTEM ---

const styles = {

  container: { backgroundColor: '#F8FAFC', flex: 1, fontFamily: '"Inter", sans-serif', position: 'relative', overflowX: 'hidden', display: 'flex', flexDirection: 'column' },

  securityBanner: { background: '#111827', color: '#10B981', fontSize: '0.6rem', padding: '10px 15px', textAlign: 'center', fontWeight: '800', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: '1px solid rgba(16,185,129,0.2)' },

  bellBtn: { background: 'none', border: 'none', position: 'relative', cursor: 'pointer', padding: '5px' },

  redBadge: { position: 'absolute', top: '0', right: '0', background: '#EF4444', color: 'white', fontSize: '7px', width: '12px', height: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid #111827' },

  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', marginTop: '10px' },

  iconBtn: { background: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },

  vaultBtn: { background: '#E0E7FF', border: 'none', color: '#4338CA', padding: '10px', borderRadius: '12px', cursor: 'pointer' },

  mainTitle: { margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#111827' },

  searchBox: { background: 'white', padding: '12px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },

  inputNone: { border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: '500', color: '#1A202C' },

  scrollX: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' },

  chipStyle: { padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' },

  gridServices: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },

  cardService: { background: 'white', padding: '20px 12px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #F1F5F9', cursor: 'pointer', transition: 'transform 0.2s' },

  iconCircle: { background: '#F0F9FF', color: '#0056D2', padding: '12px', borderRadius: '16px', marginBottom: '12px' },

  cardText: { fontSize: '0.8rem', fontWeight: '750', textAlign: 'center', color: '#1F2937', marginBottom: '5px' },

  sectionLabel: { fontSize: '0.65rem', fontWeight: '900', color: '#94A3B8', marginTop: '30px', marginBottom: '15px', letterSpacing: '1px' },

  statusCard: { background: 'white', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },

  indicatorYellow: { width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 10px rgba(245,158,11,0.5)' },

  statusTitle: { margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#111827' },

  statusSub: { margin: 0, fontSize: '0.75rem', color: '#64748B' },

  timeLabel: { fontSize: '0.65rem', color: '#10B981', fontWeight: '700', background: '#ECFDF5', padding: '4px 8px', borderRadius: '6px' },

  toastContainer: { position: 'absolute', top: '55px', left: '0', right: '0', zIndex: 9999, display: 'flex', justifyContent: 'center', padding: '0 20px' },

  toastContent: { background: '#111827', color: 'white', padding: '12px 18px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', width: '100%' },

  toastIcon: { background: '#10B981', padding: '6px', borderRadius: '8px' },

  toastTitle: { margin: 0, fontSize: '0.8rem', fontWeight: '800' },

  toastText: { margin: 0, fontSize: '0.7rem', color: '#94A3B8' },

  toastClose: { background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer' },

  notifOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(2px)' },

  notifDrawer: { width: '85%', background: 'white', height: '100%', boxShadow: '-5px 0 30px rgba(0,0,0,0.1)' },

  notifHeader: { padding: '25px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' },

  notifItem: { display: 'flex', gap: '12px', padding: '15px 0', borderBottom: '1px solid #F8FAFC' },

  dotUnread: { width: '8px', height: '8px', background: '#0056D2', borderRadius: '50%', marginTop: '6px' },

  dotRead: { width: '8px', height: '8px', background: '#E2E8F0', borderRadius: '50%', marginTop: '6px' },

  nTitle: { margin: 0, fontSize: '0.8rem', fontWeight: '800', color: '#111827' },

  nMsg: { margin: '2px 0', fontSize: '0.75rem', color: '#4B5563' },

  nTime: { margin: 0, fontSize: '0.65rem', color: '#94A3B8' },

  closeBtn: { background: '#F3F4F6', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }

};



const phoneStyles = {

  screenWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0', padding: '20px' },

  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#111827', color: 'white' },

  statusTime: { fontWeight: '700', fontSize: '13px' },

  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },

};



export default EAdministration;