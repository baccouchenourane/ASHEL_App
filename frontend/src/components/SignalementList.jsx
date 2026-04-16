import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, ChevronLeft, Clock, CheckCircle, XCircle,
  AlertCircle, Plus, Signal, Wifi, Battery, RefreshCw,
  LayoutGrid, FileText, CreditCard, Users, User,
  ShieldCheck, X
} from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png';

// ── Status configuration ──────────────────────────────────────────────────────
const STATUT_CONFIG = {
  NOUVEAU:  { color: '#E70011', bg: '#fef2f2', border: '#fecaca', icon: AlertCircle, label: 'Nouveau'  },
  EN_COURS: { color: '#F59E0B', bg: '#fffbeb', border: '#fde68a', icon: Clock,       label: 'En cours' },
  RESOLU:   { color: '#10B981', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle, label: 'Résolu'   },
  REJETE:   { color: '#6B7280', bg: '#f8fafc', border: '#e2e8f0', icon: XCircle,     label: 'Rejeté'   },
};

const FILTER_TABS = [
  { key: 'ALL', label: 'Tous' },
  ...Object.entries(STATUT_CONFIG).map(([k, v]) => ({ key: k, label: v.label })),
];

const API = 'http://localhost:8081/api/signalements';

// ── Component ─────────────────────────────────────────────────────────────────
const SignalementList = () => {
  const navigate = useNavigate();

  // Detect admin role — checks dedicated key first, then user_ashel object
  const isAdmin = (() => {
    const role = localStorage.getItem('user_role');
    if (role) return role === 'ADMIN';
    try {
      const user = JSON.parse(localStorage.getItem('user_ashel') || '{}');
      return user.role === 'ADMIN';
    } catch { return false; }
  })();

  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [toast, setToast]               = useState(null); // { type: 'success'|'error', text }

  // ── Data fetching ───────────────────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // Admin sees all signalements; citizen sees only their own
      let url = API;
      if (!isAdmin) {
        const user = JSON.parse(localStorage.getItem('user_ashel') || '{}');
        const citoyenId = user.cin || 1;
        url = `${API}/citoyen/${citoyenId}`;
      }
      const res  = await fetch(url);
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setSignalements(data);
    } catch {
      showToast('error', 'Impossible de charger les signalements.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Status change (admin only) ──────────────────────────────────────────────
  const changerStatut = async (id, statut) => {
    try {
      const res = await fetch(`${API}/${id}/statut?statut=${statut}`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      setSignalements(prev => prev.map(s => s.id === id ? { ...s, statut } : s));
      showToast('success', `Statut mis à jour : ${STATUT_CONFIG[statut]?.label}`);
    } catch {
      showToast('error', 'Erreur lors de la mise à jour du statut.');
    }
  };

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = activeFilter === 'ALL'
    ? signalements
    : signalements.filter(s => s.statut === activeFilter);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = Object.entries(STATUT_CONFIG).map(([key, cfg]) => ({
    key, cfg, count: signalements.filter(s => s.statut === key).length,
  }));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={S.screenWrapper}>
      <div className="app-container">
        <div className="moucharabieh-overlay" />

        {/* ── Status Bar ── */}
        <div style={S.statusBar}>
          <span style={S.statusTime}>09:41</span>
          <div style={S.statusIcons}><Signal size={13} /><Wifi size={13} /><Battery size={15} /></div>
        </div>

        {/* ── Hero Header ── */}
        <div style={S.hero}>
          <div style={S.heroTop}>
            <button onClick={() => navigate('/participation')} style={S.iconBtn}>
              <ChevronLeft size={20} color="white" />
            </button>
            <img src={logoAshel} alt="ASHEL" style={S.logo} />
            <button
              onClick={() => fetchData(true)}
              style={S.iconBtn}
              disabled={refreshing}
              aria-label="Rafraîchir"
            >
              <RefreshCw
                size={16} color="white"
                style={refreshing ? { animation: 'spin 0.8s linear infinite' } : {}}
              />
            </button>
          </div>

          <div style={S.heroBody}>
            <div style={S.heroIconBox}>
              {isAdmin ? <ShieldCheck size={22} color="white" /> : <AlertTriangle size={22} color="white" />}
            </div>
            <h2 style={S.heroTitle}>
              {isAdmin ? 'Gestion des signalements' : 'Mes signalements'}
            </h2>
            <p style={S.heroSub}>
              {isAdmin
                ? `${signalements.length} signalement${signalements.length !== 1 ? 's' : ''} au total`
                : 'Suivez l\'état de vos signalements'}
            </p>
          </div>

          {/* Stats strip — shown when there is data */}
          {!loading && signalements.length > 0 && (
            <div style={S.statsStrip}>
              {stats.filter(s => isAdmin || s.count > 0).map(({ key, cfg, count }, i, arr) => (
                <React.Fragment key={key}>
                  <div style={S.statItem}>
                    <span style={{ ...S.statValue, color: cfg.color }}>{count}</span>
                    <span style={S.statLabel}>{cfg.label}</span>
                  </div>
                  {i < arr.length - 1 && <div style={S.statDivider} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div style={{ ...S.toast, ...(toast.type === 'success' ? S.toastSuccess : S.toastError) }} className="fade-in">
            {toast.type === 'success' ? <CheckCircle size={14} /> : <X size={14} />}
            <span>{toast.text}</span>
          </div>
        )}

        {/* ── Filter tabs (admin only) ── */}
        {isAdmin && (
          <div style={S.filterRow}>
            {FILTER_TABS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  ...S.filterBtn,
                  ...(activeFilter === f.key ? S.filterBtnActive : {}),
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Scroll Area ── */}
        <div style={S.scrollArea}>
          {loading ? (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>Chargement...</p>
            </div>

          ) : filtered.length === 0 ? (
            <div style={S.emptyBox} className="fade-in">
              <div style={S.emptyIconWrap}>
                <AlertTriangle size={28} color="#CBD5E1" />
              </div>
              <p style={S.emptyTitle}>
                {activeFilter !== 'ALL'
                  ? `Aucun signalement "${STATUT_CONFIG[activeFilter]?.label}"`
                  : 'Aucun signalement'}
              </p>
              <p style={S.emptySub}>
                {activeFilter === 'ALL' && !isAdmin
                  ? 'Vous n\'avez pas encore soumis de signalement.'
                  : 'Aucun résultat pour ce filtre.'}
              </p>
              {!isAdmin && (
                <button onClick={() => navigate('/signalement')} style={S.emptyBtn}>
                  <div style={S.emptyBtnIcon}><Plus size={14} color="#E70011" /></div>
                  Soumettre un signalement
                </button>
              )}
            </div>

          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="fade-in">
              {filtered.map(s => {
                const cfg  = STATUT_CONFIG[s.statut] || STATUT_CONFIG.NOUVEAU;
                const Icon = cfg.icon;
                return (
                  <div key={s.id} style={{ ...S.card, borderLeftColor: cfg.color }}>

                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: s.description ? '8px' : '0' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={S.cardTitle}>{s.titre}</p>
                        <p style={S.cardCategory}>{s.categorie}</p>
                      </div>
                      <div style={{ ...S.badge, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        <Icon size={11} />
                        <span>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {s.description && <p style={S.cardDesc}>{s.description}</p>}

                    {/* Date */}
                    <p style={S.cardDate}>
                      {s.dateCreation
                        ? new Date(s.dateCreation).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </p>

                    {/* Admin action buttons */}
                    {isAdmin && (
                      <div style={S.actionsRow}>
                        <ActionBtn
                          label="En cours"
                          icon={<Clock size={11} />}
                          color="#92400E" bg="#FEF3C7" border="#FDE68A"
                          disabled={s.statut === 'EN_COURS'}
                          onClick={() => changerStatut(s.id, 'EN_COURS')}
                        />
                        <ActionBtn
                          label="Résolu"
                          icon={<CheckCircle size={11} />}
                          color="#065F46" bg="#D1FAE5" border="#A7F3D0"
                          disabled={s.statut === 'RESOLU'}
                          onClick={() => changerStatut(s.id, 'RESOLU')}
                        />
                        <ActionBtn
                          label="Rejeter"
                          icon={<XCircle size={11} />}
                          color="#475569" bg="#F1F5F9" border="#E2E8F0"
                          disabled={s.statut === 'REJETE'}
                          onClick={() => changerStatut(s.id, 'REJETE')}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── New signalement button (citizen only, when list is non-empty) ── */}
        {!isAdmin && signalements.length > 0 && (
          <div style={S.fabRow}>
            <button onClick={() => navigate('/signalement')} style={S.newBtn}>
              <div style={S.newBtnIcon}><Plus size={14} color="#E70011" /></div>
              Nouveau signalement
            </button>
          </div>
        )}

        {/* ── Nav Bar ── */}
        <nav style={S.navBar}>
          <NavItem icon={<LayoutGrid size={22} />} label="Accueil"       onClick={() => navigate('/home')} />
          <NavItem icon={<FileText size={22} />}   label="E-Admin"       onClick={() => navigate('/e-admin')} />
          <NavItem icon={<CreditCard size={22} />} label="Paiements"     onClick={() => navigate('/paiement')} />
          <NavItem icon={<Users size={22} />}      label="Participation" active />
          <NavItem icon={<User size={22} />}       label="Profil"        onClick={() => navigate('/profil')} />
        </nav>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .app-container {
          width: 390px; height: 844px; background: #F8FAFC;
          position: relative; overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 0 0 12px #1e293b, 0 30px 60px rgba(0,0,0,0.3);
          border-radius: 50px; border: 4px solid #334155;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .app-container *, .app-container button {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .moucharabieh-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("https://www.transparenttextures.com/patterns/arabesque.png");
          opacity: 0.03; pointer-events: none; z-index: 1;
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const ActionBtn = ({ label, icon, color, bg, border, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: 'flex', alignItems: 'center', gap: '5px',
      padding: '6px 11px', borderRadius: '10px',
      border: `1px solid ${border}`, background: bg,
      color, fontSize: '0.7rem', fontWeight: '800',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'opacity 0.2s',
    }}
  >
    {icon}{label}
  </button>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}>
    <div style={{ color: active ? '#0056D2' : '#94a3b8' }}>{icon}</div>
    <span style={{ fontSize: '0.58rem', fontWeight: '700', color: active ? '#0056D2' : '#94a3b8' }}>{label}</span>
  </div>
);

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  screenWrapper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#cbd5e1',
  },
  statusBar: {
    height: '44px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0 28px',
    background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
    color: 'white', flexShrink: 0, zIndex: 10,
  },
  statusTime: { fontWeight: '700', fontSize: '13px' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
  hero: {
    background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
    padding: '0 20px 20px', color: 'white', flexShrink: 0,
    borderBottomLeftRadius: '36px', borderBottomRightRadius: '36px',
    zIndex: 5,
  },
  heroTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', paddingBottom: '20px',
  },
  iconBtn: {
    width: '38px', height: '38px', background: 'rgba(255,255,255,0.15)',
    border: 'none', borderRadius: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  logo: { height: '28px', filter: 'brightness(0) invert(1)' },
  heroBody: { textAlign: 'center', paddingTop: '4px' },
  heroIconBox: {
    width: '52px', height: '52px', borderRadius: '18px',
    background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px',
  },
  heroTitle: { fontSize: '1.4rem', fontWeight: '900', margin: '0 0 6px', color: 'white' },
  heroSub: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: 0 },
  statsStrip: {
    display: 'flex', justifyContent: 'space-around',
    background: 'rgba(255,255,255,0.12)', borderRadius: '16px',
    padding: '12px 10px', marginTop: '16px',
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  statValue: { fontSize: '1.05rem', fontWeight: '900', color: 'white' },
  statLabel: { fontSize: '0.58rem', color: 'rgba(255,255,255,0.65)', fontWeight: '700' },
  statDivider: { width: '1px', background: 'rgba(255,255,255,0.2)' },
  toast: {
    position: 'absolute', top: '52px', left: '16px', right: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '11px 14px', borderRadius: '14px',
    fontSize: '0.8rem', fontWeight: '700', zIndex: 200,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  toastSuccess: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  toastError:   { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  filterRow: {
    display: 'flex', gap: '6px', padding: '12px 16px 6px',
    overflowX: 'auto', flexShrink: 0,
  },
  filterBtn: {
    padding: '7px 14px', borderRadius: '20px',
    border: '1.5px solid #E2E8F0', background: 'white',
    fontSize: '0.7rem', fontWeight: '800', color: '#64748B',
    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
    transition: 'all 0.2s',
  },
  filterBtnActive: { background: '#0056D2', color: 'white', border: '1.5px solid #0056D2' },
  scrollArea: {
    flex: 1, overflowY: 'auto', padding: '16px 16px 160px',
    scrollbarWidth: 'none',
  },
  loadingBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '14px', paddingTop: '60px',
  },
  spinner: {
    width: '30px', height: '30px', borderRadius: '50%',
    border: '3px solid #E2E8F0', borderTopColor: '#0056D2',
    animation: 'spin 0.8s linear infinite',
  },
  emptyBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', paddingTop: '40px',
  },
  emptyIconWrap: {
    width: '68px', height: '68px', borderRadius: '22px',
    background: '#f1f5f9', border: '2px dashed #CBD5E1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '14px',
  },
  emptyTitle: { fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '6px' },
  emptySub: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '22px', lineHeight: '1.5' },
  emptyBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 26px', borderRadius: '16px', border: 'none',
    background: '#1e293b', color: 'white', fontWeight: '900',
    fontSize: '0.88rem', cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(30,41,59,0.25)',
  },
  emptyBtnIcon: {
    width: '24px', height: '24px', borderRadius: '7px',
    background: '#FEF2F2', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  card: {
    background: 'white', borderRadius: '18px', padding: '14px 16px',
    border: '1px solid #E2E8F0', borderLeft: '4px solid',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  },
  cardTitle: { fontWeight: '800', fontSize: '0.9rem', color: '#1e293b', marginBottom: '3px' },
  cardCategory: {
    fontSize: '0.68rem', color: '#64748B', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.4px',
  },
  cardDesc: {
    fontSize: '0.76rem', color: '#94a3b8', margin: '6px 0',
    lineHeight: '1.45',
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  cardDate: { fontSize: '0.68rem', color: '#CBD5E1', fontWeight: '600', marginTop: '6px' },
  badge: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '5px 9px', borderRadius: '10px',
    fontSize: '0.68rem', fontWeight: '800', flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  actionsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' },
  fabRow: {
    position: 'absolute', bottom: '88px', left: '16px', right: '16px', zIndex: 50,
  },
  newBtn: {
    width: '100%', padding: '14px 20px', borderRadius: '16px', border: 'none',
    background: '#1e293b', color: 'white', fontWeight: '900',
    fontSize: '0.9rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    boxShadow: '0 8px 24px rgba(30,41,59,0.25)',
  },
  newBtnIcon: {
    width: '26px', height: '26px', borderRadius: '8px',
    background: '#FEF2F2', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  navBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
    background: 'white', display: 'flex', justifyContent: 'space-around',
    alignItems: 'center', padding: '0 10px 12px',
    borderTop: '1px solid #f1f5f9', zIndex: 100,
    boxShadow: '0 -8px 20px rgba(0,0,0,0.04)',
  },
};

export default SignalementList;
