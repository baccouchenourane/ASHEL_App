import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, Download, Shield, Printer, 
  CheckCircle, Clock, Search, Signal, Wifi, Battery, AlertCircle, RefreshCw
} from 'lucide-react';
import { documentAPI } from '../services/api';

// Correspondance typeDocument → catégorie
const getCat = (typeDoc) => ({
  'Extrait de Naissance':     'Famille',
  'Bulletin N°3':             'Justice',
  'Registre de Commerce':     'RNE',
  'Attestation de Travail':   'Social',
  'Certificat de Résidence':  'Famille',
  'Fiche de Paie (CNRPS)':    'Social',
}[typeDoc] || 'Autre');

// Correspondance statut → couleur
const getColor = (statut) => ({
  'PRET':           '#48BB78',
  'EN_TRAITEMENT':  '#F6AD55',
  'PAIEMENT_RECU':  '#63B3ED',
  'EN_ATTENTE':     '#A0AEC0',
  'REJETE':         '#FC8181',
}[statut] || '#A0AEC0');

// Correspondance statut → libellé affiché
const getStatutLabel = (statut) => ({
  'PRET':           'Prêt',
  'EN_TRAITEMENT':  'En cours',
  'PAIEMENT_RECU':  'Paiement reçu',
  'EN_ATTENTE':     'En attente',
  'REJETE':         'Rejeté',
}[statut] || statut);

const DocumentVault = ({ onBack }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Chargement des documents depuis le backend ---
  const loadDocs = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await documentAPI.getCoffreFort();
      // Adapter le format backend → format attendu par le composant
      const formatted = data.map(d => ({
        id: d.id,
        name: d.typeDocument,
        date: (d.statut === 'PRET' || d.statut === 'PAIEMENT_RECU')
          ? new Date(d.dateMAJ).toLocaleDateString('fr-FR')
          : 'En traitement...',
        status: getStatutLabel(d.statut),
        statutRaw: d.statut,
        color: getColor(d.statut),
        cat: getCat(d.typeDocument),
        reference: d.reference,
        nomTitulaire: d.nomTitulaire,
      }));
      setDocs(formatted);
    } catch (err) {
      setFetchError(err.message || 'Impossible de charger vos documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

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

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.reference && doc.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="auth-container">
      <div className="app-container">
        {/* Barre d'état */}
        <div style={phoneStyles.statusBar}>
          <span style={phoneStyles.statusTime}>09:41</span>
          <div style={phoneStyles.statusIcons}>
            <Signal size={13} /> <Wifi size={13} /> <Battery size={15} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC' }} className="fade-in">
          {/* HEADER SÉCURISÉ */}
          <div style={vaultHeader} className="vault-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={onBack} style={iconBtnWhite}><ArrowLeft size={20} /></button>
              <div style={statusBadge}>
                <Shield size={10} style={{ marginRight: '5px' }} /> CRYPTAGE AES-256
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

          {/* CONTENU */}
          <div style={{ padding: '0 20px', marginTop: '-20px', paddingBottom: '40px' }}>

            {/* État de chargement */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                <p style={{ fontWeight: '700' }}>Chargement de vos documents...</p>
              </div>
            )}

            {/* Erreur de chargement */}
            {fetchError && !loading && (
              <div style={errorCard}>
                <AlertCircle size={20} color="#DC2626" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '800', color: '#DC2626', fontSize: '0.85rem' }}>Erreur de connexion</p>
                  <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#64748B' }}>{fetchError}</p>
                </div>
                <button onClick={loadDocs} style={retryBtn}>
                  <RefreshCw size={14} /> Réessayer
                </button>
              </div>
            )}

            {/* Liste vide */}
            {!loading && !fetchError && docs.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#94A3B8' }}>
                <Shield size={40} style={{ marginBottom: '10px', opacity: 0.3 }} />
                <p style={{ fontWeight: '700' }}>Aucun document pour le moment</p>
                <p style={{ fontSize: '0.75rem' }}>Vos documents apparaîtront ici après chaque demande.</p>
              </div>
            )}

            {/* Résultats de recherche vides */}
            {!loading && !fetchError && docs.length > 0 && filteredDocs.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#94A3B8' }}>
                <Search size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>Aucun document trouvé pour "{searchTerm}"</p>
              </div>
            )}

            {/* Liste des documents */}
            {!loading && filteredDocs.map(doc => (
              <div key={doc.id} style={docCard} className="slide-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: `${doc.color}15`, padding: '12px', borderRadius: '16px' }}>
                    <FileText color={doc.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>{doc.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                      {doc.statutRaw === 'PRET'
                        ? <CheckCircle size={10} color="#48BB78" />
                        : <Clock size={10} color="#A0AEC0" />
                      }
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#A0AEC0' }}>
                        {doc.date} • {doc.cat}
                      </p>
                    </div>
                    {doc.reference && (
                      <p style={{ margin: '2px 0 0', fontSize: '0.65rem', color: '#CBD5E0', fontFamily: 'monospace' }}>
                        Réf: {doc.reference}
                      </p>
                    )}
                  </div>
                  <div style={docStatus(doc.color)}>{doc.status}</div>
                </div>

                {doc.statutRaw === 'PRET' && (
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
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .auth-container { background: #f1f5f9; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
        .app-container { width: 390px; height: 844px; background: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); border-radius: 50px; border: 4px solid #334155; }
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
const vaultHeader = { background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)', padding: '40px 20px 40px 20px', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px', marginBottom: '30px' };
const searchContainer = { marginTop: '25px', background: 'rgba(255, 255, 255, 0.05)', padding: '12px 18px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' };
const searchInput = { background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem', width: '100%', fontWeight: '500' };
const shieldIconContainer = { background: 'rgba(129, 140, 248, 0.1)', padding: '12px', borderRadius: '20px', border: '1px solid rgba(129, 140, 248, 0.2)' };
const iconBtnWhite = { background: 'rgba(255,255,255,0.1)', border: 'none', padding: '10px', borderRadius: '50%', color: 'white', cursor: 'pointer' };
const statusBadge = { display: 'flex', alignItems: 'center', background: '#065F46', color: '#6EE7B7', fontSize: '0.6rem', padding: '6px 14px', borderRadius: '20px', fontWeight: '900', letterSpacing: '0.5px' };
const docCard = { background: 'white', padding: '18px', borderRadius: '26px', marginBottom: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' };
const docStatus = (color) => ({ color: color, fontSize: '0.65rem', fontWeight: '900', background: `${color}10`, padding: '5px 12px', borderRadius: '12px', textTransform: 'uppercase', whiteSpace: 'nowrap' });
const actionRow = { marginTop: '15px', borderTop: '1px solid #F8FAFC', paddingTop: '15px', display: 'flex', gap: '10px' };
const btnLight = { flex: 1, background: '#F1F5F9', border: 'none', padding: '12px', borderRadius: '14px', color: '#475569', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' };
const progressBarContainer = { width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' };
const progressBar = (w) => ({ width: `${w}%`, height: '100%', background: '#0056D2', transition: '0.2s ease-out', borderRadius: '10px' });
const errorCard = { background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' };
const retryBtn = { background: '#FEE2E2', border: 'none', color: '#DC2626', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' };
const phoneStyles = {
  statusBar: { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', color: '#64748b', background: '#0F172A' },
  statusTime: { fontWeight: '700', fontSize: '13px', color: 'white' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center', color: 'white' }
};

export default DocumentVault;
