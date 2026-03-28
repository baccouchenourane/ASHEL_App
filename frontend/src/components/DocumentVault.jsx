import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Shield, Printer, CheckCircle, Clock, Search } from 'lucide-react';

const DocumentVault = ({ onBack }) => {
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const startDownload = (id) => {
    setDownloading(id);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloading(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const docs = [
    { id: 1, name: "Extrait de Naissance", date: "27/03/2026", status: "Prêt", color: "#48BB78", cat: "Famille" },
    { id: 2, name: "Bulletin N°3", date: "Traitement...", status: "En cours", color: "#F6AD55", cat: "Justice" },
    { id: 3, name: "Registre de Commerce", date: "28/03/2026", status: "Prêt", color: "#3182CE", cat: "RNE" },
    { id: 4, name: "Attestation de Travail", date: "28/03/2026", status: "Prêt", color: "#4A5568", cat: "Social" },
    { id: 6, name: "Fiche de Paie (CNRPS)", date: "25/03/2026", status: "Prêt", color: "#805AD5", cat: "Social" }
  ];

  // Logique de recherche
  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', maxWidth: '500px', margin: '0 auto' }} className="fade-in">
      {/* HEADER SÉCURISÉ */}
      <div style={vaultHeader} className="vault-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={iconBtnWhite}><ArrowLeft size={20} /></button>
          <div style={statusBadge}>
            <Shield size={10} style={{marginRight: '5px'}}/> CRYPTAGE AES-256
          </div>
        </div>
        
        <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={shieldIconContainer}>
            <Shield size={30} color="#818CF8" />
          </div>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Coffre-fort</h2>
            <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.8rem' }}>Documents officiels certifiés</p>
          </div>
        </div>

        {/* NOUVELLE BARRE DE RECHERCHE DANS LE HEADER */}
        <div style={searchContainer}>
          <Search size={16} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Rechercher un document..." 
            style={searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* LISTE DES DOCUMENTS */}
      <div style={{ padding: '0 20px', marginTop: '-20px', paddingBottom: '40px' }}>
        {filteredDocs.length > 0 ? (
          filteredDocs.map(doc => (
            <div key={doc.id} style={docCard} className="slide-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: `${doc.color}15`, padding: '12px', borderRadius: '16px' }}>
                  <FileText color={doc.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>{doc.name}</h4>
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px'}}>
                    {doc.status === "En cours" ? <Clock size={10} color="#A0AEC0"/> : <CheckCircle size={10} color="#48BB78"/>}
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#A0AEC0' }}>{doc.date} • {doc.cat}</p>
                  </div>
                </div>
                <div style={docStatus(doc.color)}>{doc.status}</div>
              </div>

              {doc.status === "Prêt" && (
                <div style={actionRow}>
                  <button onClick={() => startDownload(doc.id)} style={btnLight} disabled={downloading === doc.id}>
                    <Download size={16} /> Télécharger
                  </button>
                  <button onClick={() => window.print()} style={btnLight}>
                    <Printer size={16} /> Imprimer
                  </button>
                </div>
              )}

              {downloading === doc.id && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '5px', fontWeight: '700', color: '#0056D2' }}>
                    <span>Génération du certificat sécurisé...</span>
                    <span>{progress}%</span>
                  </div>
                  <div style={progressBarContainer}>
                    <div style={progressBar(progress)}></div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', marginTop: '50px', color: '#94A3B8'}}>
            <Search size={40} style={{marginBottom: '10px', opacity: 0.5}} />
            <p>Aucun document trouvé pour "{searchTerm}"</p>
          </div>
        )}
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-out; }
        .slide-up { animation: slideUp 0.5s ease-out both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media print { .vault-header, button, .status-badge { display: none !important; } }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const vaultHeader = { 
  background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)', 
  padding: '40px 20px 40px 20px', 
  borderBottomLeftRadius: '40px', 
  borderBottomRightRadius: '40px',
  marginBottom: '30px'
};

const searchContainer = {
  marginTop: '25px',
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '12px 18px',
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)'
};

const searchInput = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  outline: 'none',
  fontSize: '0.9rem',
  width: '100%',
  fontWeight: '500'
};

const shieldIconContainer = {
  background: 'rgba(129, 140, 248, 0.1)',
  padding: '12px',
  borderRadius: '20px',
  border: '1px solid rgba(129, 140, 248, 0.2)'
};

const iconBtnWhite = { background: 'rgba(255,255,255,0.1)', border: 'none', padding: '10px', borderRadius: '50%', color: 'white', cursor: 'pointer' };
const statusBadge = { display: 'flex', alignItems: 'center', background: '#065F46', color: '#6EE7B7', fontSize: '0.6rem', padding: '6px 14px', borderRadius: '20px', fontWeight: '900', letterSpacing: '0.5px' };
const docCard = { background: 'white', padding: '18px', borderRadius: '26px', marginBottom: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' };
const docStatus = (color) => ({ color: color, fontSize: '0.65rem', fontWeight: '900', background: `${color}10`, padding: '5px 12px', borderRadius: '12px', textTransform: 'uppercase' });
const actionRow = { marginTop: '15px', borderTop: '1px solid #F8FAFC', paddingTop: '15px', display: 'flex', gap: '10px' };
const btnLight = { flex: 1, background: '#F1F5F9', border: 'none', padding: '12px', borderRadius: '14px', color: '#475569', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' };
const progressBarContainer = { width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' };
const progressBar = (w) => ({ width: `${w}%`, height: '100%', background: '#0056D2', transition: '0.2s ease-out', borderRadius: '10px' });

export default DocumentVault;