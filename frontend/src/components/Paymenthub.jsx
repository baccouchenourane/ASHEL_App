import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Zap, Droplets, Wifi, ShieldAlert, 
  ChevronRight, Signal, Battery, Car, Sparkles, 
  GraduationCap, Gavel, Laptop 
} from 'lucide-react';

// 1. Catégories fixes (comme e-admin)
const CATEGORIES = ["Tous", "Vie Quotidienne", "Transport", "Justice", "Éducation"];

// 2. Base de données
const ALL_PAYMENTS = [
  { id: 'electricite', title: 'Facture Électricité', org: 'STEG', cat: 'Vie Quotidienne', icon: <Zap size={22} />, color: '#f59e0b', montant: '85.500 DT', status: 'DUE BIENTÔT' },
  { id: 'eau', title: 'Facture Eau', org: 'SONEDE', cat: 'Vie Quotidienne', icon: <Droplets size={22} />, color: '#0ea5e9', montant: '42.200 DT', status: 'PAYÉ' },
  { id: 'radar', title: 'Amende Radar', org: 'MIN. INTÉRIEUR', cat: 'Transport', icon: <ShieldAlert size={22} />, color: '#e11d48', montant: '60.000 DT', status: 'À PAYER' },
  { id: 'etude', title: 'Frais Inscription', org: 'UNIVERSITÉ', cat: 'Éducation', icon: <GraduationCap size={22} />, color: '#8b5cf6', montant: '10.000 DT', status: 'À PAYER' }
];

const PaymentHub = () => {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return ALL_PAYMENTS.filter(p => {
      const matchCat = activeCat === "Tous" || p.cat === activeCat;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.org.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  return (
    <div style={styles.screenWrapper}>
      <div className="app-container" style={{ background: '#F8FAFC' }}>
        
        {/* Header & Recherche */}
        <div style={styles.headerArea}>
           <div style={styles.header}>
              <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={20}/></button>
              <h1 style={styles.mainTitle}>Paiements</h1>
           </div>
           
           <div style={styles.searchBar}>
              <Search size={18} color="#94A3B8" />
              <input placeholder="Rechercher..." style={styles.searchInput} onChange={(e) => setSearch(e.target.value)} />
           </div>
        </div>

        {/* Catégories Fixes (Sous la recherche) */}
        <div style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              style={{...styles.catBtn, background: activeCat === cat ? '#1e293b' : 'white', color: activeCat === cat ? 'white' : '#64748B'}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Liste des Factures (Design Carreaux) */}
        <div style={styles.listContent}>
          {filtered.map((p) => (
            <div key={p.id} onClick={() => {
  if (p.id === 'radar') {
    navigate('/paiement-amende'); // Route vers ton fichier PaiementAmende.jsx
  } else {
    navigate(`/facture/${p.id}`); // Reste sur le détail facture pour le reste
  }
}} style={styles.card}>
              <div style={{ ...styles.iconBox, background: `${p.color}15`, color: p.color }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={styles.cardOrg}>{p.org}</p>
                <h3 style={styles.cardTitle}>{p.title}</h3>
                <p style={styles.cardAmount}>{p.montant}</p>
              </div>
              <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap: 5}}>
                 <span style={{...styles.badge, color: p.status === 'PAYÉ' ? '#10b981' : '#e11d48'}}>{p.status}</span>
                 <ChevronRight size={18} color="#CBD5E1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  screenWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0' },
  headerArea: { padding: '20px 25px 10px', background: 'white', borderRadius: '0 0 30px 30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' },
  mainTitle: { fontSize: '1.4rem', fontWeight: '900', margin: 0 },
  backBtn: { border: 'none', background: '#F8FAFC', padding: '10px', borderRadius: '12px' },
  searchBar: { display: 'flex', alignItems: 'center', background: '#F8FAFC', padding: '12px 18px', borderRadius: '16px', gap: '12px' },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', width: '100%', fontWeight: '700' },
  catScroll: { display: 'flex', gap: '10px', padding: '20px 25px', overflowX: 'auto', msOverflowStyle: 'none' },
  catBtn: { padding: '10px 20px', borderRadius: '12px', border: 'none', fontSize: '0.8rem', fontWeight: '800', whiteSpace: 'nowrap' },
  listContent: { padding: '0 25px 30px' },
  card: { background: 'white', padding: '18px', borderRadius: '24px', marginBottom: '12px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' },
  iconBox: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardOrg: { margin: 0, fontSize: '0.6rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  cardTitle: { margin: '2px 0', fontSize: '0.9rem', fontWeight: '900' },
  cardAmount: { margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#64748B' },
  badge: { fontSize: '0.6rem', fontWeight: '900', textTransform: 'uppercase' }
};

export default PaymentHub;