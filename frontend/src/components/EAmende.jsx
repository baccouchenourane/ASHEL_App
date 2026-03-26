import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, CreditCard, AlertCircle, CheckCircle, 
  Filter, Download, Eye, Gavel, MapPin, Calendar, 
  TrendingUp, Clock, ShieldCheck, ChevronRight 
} from 'lucide-react';

const EAmende = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('liste'); // liste, dashboard, contestation
  const [filter, setFilter] = useState('toutes');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées riches
  const amendes = [
    { id: "PV-2026-001", type: "Excès de vitesse", date: "2026-03-15", lieu: "A1, Hammamet", montant: 60, statut: "Non payée", gravite: "Elevée" },
    { id: "PV-2026-042", type: "Stationnement", date: "2026-02-10", lieu: "Centre ville, Tunis", montant: 20, statut: "Payée", gravite: "Faible" },
    { id: "PV-2025-112", type: "Feu Rouge", date: "2026-03-20", lieu: "Ennasr, Ariana", montant: 120, statut: "Contestée", gravite: "Critique" },
  ];

  const stats = { total: 200, payé: 20, restant: 180, nb: 3 };

  return (
    <div className="app-container" style={{ height: 'auto', minHeight: '820px' }}>
      <div className="moucharabieh-overlay"></div>
      
      {/* 1. Header Premium */}
      <div style={{ background: 'linear-gradient(135deg, var(--ashal-red) 0%, #99000b 100%)', padding: '30px 20px 50px 20px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <ArrowLeft onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Gestion des Amendes</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
           <StatMiniCard icon={<Clock size={16}/>} label="À régler" value={`${stats.restant} DT`} />
           <StatMiniCard icon={<CheckCircle size={16}/>} label="Payées" value={`${stats.payé} DT`} />
           <StatMiniCard icon={<TrendingUp size={16}/>} label="Total" value={`${stats.total} DT`} />
        </div>
      </div>

      <div style={{ padding: '20px', marginTop: '-30px', zIndex: 5, flex: 1 }}>
        
        {/* 2. Barre de recherche et Filtres */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Rechercher un PV..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '15px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.85rem' }} 
            />
          </div>
          <button style={{ padding: '12px', borderRadius: '15px', border: 'none', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Filter size={18} color="var(--ashal-red)" />
          </button>
        </div>

        {/* 3. Navigation Interne */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '5px', borderRadius: '15px', marginBottom: '20px' }}>
          {['liste', 'statistiques'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800',
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? 'var(--ashal-red)' : '#64748b',
                boxShadow: activeTab === tab ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
              }}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 4. Liste des Amendes (Cards) */}
        {activeTab === 'liste' && (
          <div className="fade-in">
            {amendes.map((amende) => (
              <div key={amende.id} style={{ 
                background: 'white', borderRadius: '25px', padding: '20px', marginBottom: '15px', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>{amende.id}</span>
                  <StatusBadge status={amende.statut} />
                </div>
                
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: '800' }}>{amende.type}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <InfoRow icon={<Calendar size={14}/>} text={amende.date} />
                  <InfoRow icon={<MapPin size={14}/>} text={amende.lieu} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #f8fafc' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Montant :</span>
                    <div style={{ fontWeight: '900', fontSize: '1.2rem', color: amende.statut === 'Payée' ? '#059669' : 'var(--ashal-red)' }}>{amende.montant} DT</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ActionButton icon={<Eye size={16}/>} color="#f1f5f9" textColor="#1e293b" />
                    {amende.statut !== 'Payée' && (
                      <>
                        <ActionButton icon={<Gavel size={16}/>} color="#fff1f2" textColor="var(--ashal-red)" />
                        <ActionButton icon={<CreditCard size={16}/>} color="#1e293b" textColor="white" primary />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'statistiques' && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
            <TrendingUp size={40} color="var(--ashal-red)" style={{ opacity: 0.2, marginBottom: '15px' }} />
            <p style={{ fontWeight: '700', color: '#64748b' }}>Analyse des données en cours...</p>
            <div style={{ height: '150px', background: '#f8fafc', borderRadius: '20px', marginTop: '20px', border: '2px dashed #e2e8f0' }}></div>
          </div>
        )}
      </div>

      {/* 5. Footer Sécurité */}
      <div style={{ padding: '20px', textAlign: 'center', background: '#f8fafc' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: '0.65rem', fontWeight: '700' }}>SYSTEME SECURISE MONETIQUE TUNISIE</span>
         </div>
      </div>
    </div>
  );
};

// --- Composants Internes ---
const StatMiniCard = ({ icon, label, value }) => (
  <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: '18px', minWidth: '110px', backdropFilter: 'blur(10px)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', opacity: 0.8 }}>
      {icon} <span style={{ fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase' }}>{label}</span>
    </div>
    <div style={{ fontSize: '1rem', fontWeight: '800' }}>{value}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    "Payée": { bg: "#ecfdf5", text: "#059669" },
    "Non payée": { bg: "#fff1f2", text: "#e11d48" },
    "Contestée": { bg: "#fefce8", text: "#a16207" }
  };
  const style = colors[status] || colors["Non payée"];
  return (
    <span style={{ padding: '5px 12px', borderRadius: '20px', background: style.bg, color: style.text, fontSize: '0.65rem', fontWeight: '800' }}>
      {status.toUpperCase()}
    </span>
  );
};

const InfoRow = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.8rem' }}>
    <span style={{ color: '#cbd5e1' }}>{icon}</span>
    <span style={{ fontWeight: '600' }}>{text}</span>
  </div>
);

const ActionButton = ({ icon, color, textColor, primary = false }) => (
  <button style={{ 
    width: '42px', height: '42px', borderRadius: '12px', border: 'none', background: color, color: textColor,
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    boxShadow: primary ? '0 10px 15px rgba(0,0,0,0.15)' : 'none'
  }}>
    {icon}
  </button>
);

export default EAmende;