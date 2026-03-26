import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CreditCard, AlertTriangle, CheckCircle, Car, Hash, ShieldCheck } from 'lucide-react';

const EAmende = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('matricule'); // 'matricule' ou 'pv'
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [amendeTrouvee, setAmendeTrouvee] = useState(null);

  // Simulation d'une recherche d'amende
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulation d'un résultat trouvé
      setAmendeTrouvee({
        id: "PV-2026-9921",
        type: "Excès de vitesse (Radès)",
        date: "14/03/2026",
        montant: "60",
        statut: "Non payée"
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Header Dynamique */}
      <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)', padding: '30px 20px', color: 'white', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <ArrowLeft onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0 }}>Consultation d'Amendes</h2>
        </div>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Saisissez vos informations pour vérifier vos infractions.</p>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* Formulaire de Recherche */}
        <div style={{ background: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginTop: '-40px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={() => setSearchType('matricule')}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: searchType === 'matricule' ? '#fff1f2' : '#f8fafc', color: searchType === 'matricule' ? '#e11d48' : '#64748b', fontWeight: '700', fontSize: '0.75rem' }}>
              PAR MATRICULE
            </button>
            <button 
              onClick={() => setSearchType('pv')}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: searchType === 'pv' ? '#fff1f2' : '#f8fafc', color: searchType === 'pv' ? '#e11d48' : '#64748b', fontWeight: '700', fontSize: '0.75rem' }}>
              PAR NUMÉRO PV
            </button>
          </div>

          <div style={{ position: 'relative', marginBottom: '15px' }}>
            {searchType === 'matricule' ? <Car size={18} style={{ position: 'absolute', left: '15px', top: '12px', color: '#94a3b8' }} /> : <Hash size={18} style={{ position: 'absolute', left: '15px', top: '12px', color: '#94a3b8' }} />}
            <input 
              type="text" 
              placeholder={searchType === 'matricule' ? "Ex: 123 TUN 4567" : "Ex: 202600123"}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
            />
          </div>

          <button 
            onClick={handleSearch}
            disabled={loading}
            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#1e293b', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {loading ? "Recherche..." : <><Search size={18} /> Consulter</>}
          </button>
        </div>

        {/* Résultat de la Recherche */}
        {amendeTrouvee && (
          <div style={{ marginTop: '25px', animation: 'fadeIn 0.5s ease' }}>
            <h4 style={{ fontWeight: '800', marginBottom: '15px', color: '#1e293b' }}>Infraction trouvée</h4>
            <div style={{ background: 'white', borderRadius: '25px', padding: '20px', border: '2px solid #fff1f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Réf: {amendeTrouvee.id}</span>
                <span style={{ padding: '4px 10px', background: '#fee2e2', color: '#dc2626', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700' }}>{amendeTrouvee.statut.toUpperCase()}</span>
              </div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: '800' }}>{amendeTrouvee.type}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Date de l'infraction : {amendeTrouvee.date}</p>
              
              <div style={{ margin: '20px 0', padding: '15px', background: '#f8fafc', borderRadius: '15px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Montant à payer :</span>
                <h2 style={{ margin: 0, color: '#e11d48', fontSize: '1.8rem', fontWeight: '900' }}>{amendeTrouvee.montant} <small style={{ fontSize: '0.9rem' }}>DT</small></h2>
              </div>

              <button style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#10b981', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CreditCard size={20} /> PAYER MAINTENANT
              </button>
            </div>
          </div>
        )}

        {/* Pied de page sécurisé */}
        <div style={{ marginTop: '30px', textAlign: 'center', opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
            <ShieldCheck size={16} color="#059669" />
            <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>PAIEMENT SÉCURISÉ (SPS)</span>
          </div>
          <p style={{ fontSize: '0.65rem', color: '#64748b' }}>Plateforme officielle du Ministère des Finances</p>
        </div>

      </div>
    </div>
  );
};

export default EAmende;