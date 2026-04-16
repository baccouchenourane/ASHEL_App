import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, FileText, AlertTriangle, Star,
  ChevronRight, Users, List
} from 'lucide-react';

// ── Catégories ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Tous', 'Citoyen', 'Signalement', 'Évaluation'];

// ── Services ──────────────────────────────────────────────────────────────────
const ALL_ITEMS = [
  {
    id: 'reclamation',
    title: 'Réclamation',
    org: 'SERVICES PUBLICS',
    subtitle: 'Déposez une réclamation officielle',
    cat: 'Citoyen',
    icon: <FileText size={22} />,
    color: '#0056D2',
    badge: 'DISPONIBLE',
    route: '/reclamation',
  },
  {
    id: 'signalement',
    title: 'Signalement',
    org: 'INFRASTRUCTURE',
    subtitle: 'Signalez un dysfonctionnement',
    cat: 'Signalement',
    icon: <AlertTriangle size={22} />,
    color: '#E70011',
    badge: 'DISPONIBLE',
    route: '/signalement',
  },
  {
    id: 'evaluation',
    title: 'Évaluation',
    org: 'QUALITÉ DE SERVICE',
    subtitle: 'Notez un service public',
    cat: 'Évaluation',
    icon: <Star size={22} />,
    color: '#F59E0B',
    badge: 'DISPONIBLE',
    route: '/evaluation',
  },
  {
    id: 'mes-signalements',
    title: 'Mes signalements',
    org: 'SUIVI',
    subtitle: 'Consultez l\'état de vos signalements',
    cat: 'Signalement',
    icon: <List size={22} />,
    color: '#10B981',
    badge: 'SUIVI',
    route: '/signalement-list',
  },
];

// ── Composant principal ───────────────────────────────────────────────────────
const ParticipationHub = () => {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('Tous');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return ALL_ITEMS.filter(item => {
      const matchCat = activeCat === 'Tous' || item.cat === activeCat;
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.org.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  return (
    <div style={S.screenWrapper}>
      <div className="app-container" style={{ background: '#F8FAFC' }}>

        {/* ── Header ── */}
        <div style={S.headerArea}>
          <div style={S.headerRow}>
            <button onClick={() => navigate('/home')} style={S.backBtn}>
              <ArrowLeft size={20} color="#1e293b" />
            </button>
            <div style={S.headerCenter}>
              <div style={S.headerIconWrap}>
                <Users size={18} color="#E70011" />
              </div>
              <h1 style={S.mainTitle}>Participation</h1>
            </div>
            <div style={{ width: 40 }} />
          </div>

          <p style={S.headerSub}>Réclamations, signalements et évaluations</p>

          {/* Search bar */}
          <div style={S.searchBar}>
            <Search size={17} color="#94A3B8" />
            <input
              placeholder="Rechercher un service..."
              style={S.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Category pills ── */}
        <div style={S.catScroll}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                ...S.catBtn,
                background: activeCat === cat ? '#1e293b' : 'white',
                color: activeCat === cat ? 'white' : '#64748B',
                border: activeCat === cat ? '1.5px solid #1e293b' : '1.5px solid #E2E8F0',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Stats strip ── */}
        <div style={S.statsStrip}>
          <div style={S.statItem}>
            <span style={S.statValue}>{ALL_ITEMS.length}</span>
            <span style={S.statLabel}>Services</span>
          </div>
          <div style={S.statDivider} />
          <div style={S.statItem}>
            <span style={S.statValue}>3 jrs</span>
            <span style={S.statLabel}>Délai réponse</span>
          </div>
          <div style={S.statDivider} />
          <div style={S.statItem}>
            <span style={{ ...S.statValue, color: '#10B981' }}>Actif</span>
            <span style={S.statLabel}>Statut</span>
          </div>
        </div>

        {/* ── Service list ── */}
        <div style={S.listContent}>
          {filtered.length === 0 ? (
            <div style={S.emptyState}>
              <Search size={32} color="#CBD5E1" />
              <p style={S.emptyText}>Aucun service trouvé</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(item.route)}
                style={S.card}
              >
                {/* Icon */}
                <div style={{ ...S.iconBox, background: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={S.cardOrg}>{item.org}</p>
                  <h3 style={S.cardTitle}>{item.title}</h3>
                  <p style={S.cardSub}>{item.subtitle}</p>
                </div>

                {/* Right side */}
                <div style={S.cardRight}>
                  <span style={{ ...S.badge, color: item.color, background: `${item.color}12` }}>
                    {item.badge}
                  </span>
                  <ChevronRight size={17} color="#CBD5E1" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .app-container {
          width: 390px; height: 844px;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 0 0 12px #1e293b, 0 30px 60px rgba(0,0,0,0.3);
          border-radius: 50px; border: 4px solid #334155;
        }
        * { scrollbar-width: none; box-sizing: border-box; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  screenWrapper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#e2e8f0',
  },

  /* Header */
  headerArea: {
    padding: '20px 22px 18px',
    background: 'white',
    borderRadius: '0 0 30px 30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    flexShrink: 0,
  },
  headerRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '4px',
  },
  backBtn: {
    width: '40px', height: '40px', border: 'none',
    background: '#F8FAFC', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  headerCenter: {
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  headerIconWrap: {
    width: '32px', height: '32px', borderRadius: '10px',
    background: '#FEF2F2', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  mainTitle: {
    fontSize: '1.35rem', fontWeight: '900',
    color: '#1e293b', margin: 0,
  },
  headerSub: {
    fontSize: '0.78rem', color: '#94A3B8',
    fontWeight: '600', margin: '0 0 16px 0',
    textAlign: 'center',
  },
  searchBar: {
    display: 'flex', alignItems: 'center',
    background: '#F8FAFC', padding: '12px 16px',
    borderRadius: '16px', gap: '10px',
    border: '1.5px solid #F1F5F9',
  },
  searchInput: {
    border: 'none', outline: 'none',
    background: 'transparent', width: '100%',
    fontSize: '0.88rem', fontWeight: '600',
    color: '#1e293b',
  },

  /* Category pills */
  catScroll: {
    display: 'flex', gap: '8px',
    padding: '16px 22px 8px',
    overflowX: 'auto', flexShrink: 0,
  },
  catBtn: {
    padding: '8px 18px', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: '800',
    whiteSpace: 'nowrap', cursor: 'pointer',
    transition: 'all 0.2s',
  },

  /* Stats strip */
  statsStrip: {
    display: 'flex', justifyContent: 'space-around',
    alignItems: 'center',
    margin: '4px 22px 8px',
    background: 'white', borderRadius: '18px',
    padding: '12px 10px',
    border: '1px solid #F1F5F9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    flexShrink: 0,
  },
  statItem: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '2px',
  },
  statValue: {
    fontSize: '1rem', fontWeight: '900', color: '#1e293b',
  },
  statLabel: {
    fontSize: '0.6rem', color: '#94A3B8', fontWeight: '700',
  },
  statDivider: {
    width: '1px', height: '28px', background: '#F1F5F9',
  },

  /* List */
  listContent: {
    flex: 1, overflowY: 'auto',
    padding: '4px 22px 30px',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    paddingTop: '50px', gap: '12px',
  },
  emptyText: {
    color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600',
  },

  /* Card */
  card: {
    background: 'white', padding: '16px 18px',
    borderRadius: '22px', marginBottom: '10px',
    display: 'flex', gap: '14px', alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    border: '1px solid #F1F5F9',
    cursor: 'pointer', transition: 'transform 0.15s',
  },
  iconBox: {
    width: '48px', height: '48px', borderRadius: '14px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  cardOrg: {
    margin: 0, fontSize: '0.6rem', fontWeight: '800',
    color: '#94A3B8', textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    margin: '2px 0 3px', fontSize: '0.92rem', fontWeight: '900',
    color: '#1e293b',
  },
  cardSub: {
    margin: 0, fontSize: '0.75rem',
    color: '#64748B', fontWeight: '600',
  },
  cardRight: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: '6px', flexShrink: 0,
  },
  badge: {
    fontSize: '0.58rem', fontWeight: '900',
    textTransform: 'uppercase', letterSpacing: '0.4px',
    padding: '4px 8px', borderRadius: '8px',
  },
};

export default ParticipationHub;
