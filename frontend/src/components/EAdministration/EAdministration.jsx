import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Clock, CheckCircle, ArrowLeft, Upload, Send, Search } from 'lucide-react';
import '../../App.css'; 

const EAdministration = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('menu'); 
  const [selectedService, setSelectedService] = useState(null);
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mes_demandes')) || [];
    setDemandes(saved);
  }, []);

  const services = [
    { id: 1, title: "Extrait de Naissance", icon: <FileText size={24} />, desc: "Document d'état civil officiel" },
    { id: 2, title: "Certificat de Résidence", icon: <CheckCircle size={24} />, desc: "Justificatif de domicile" },
    { id: 3, title: "Fiche Anthropométrique", icon: <Search size={24} />, desc: "Extrait de casier judiciaire (B3)" }
  ];

  const handleCreateDemande = (e) => {
    e.preventDefault();
    const nouvelleDemande = {
      id: Math.floor(Math.random() * 10000),
      service: selectedService.title,
      date: new Date().toLocaleDateString('fr-FR'),
      statut: 'En attente',
      ref: 'ASHAL-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    const updated = [nouvelleDemande, ...demandes];
    setDemandes(updated);
    localStorage.setItem('mes_demandes', JSON.stringify(updated));
    setView('history');
    alert("Demande transmise avec succès au registre national.");
  };

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>
      
      {/* HEADER */}
      <div style={{ padding: '40px 20px 20px', background: 'white', zIndex: 10, display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #E2E8F0' }}>
        <button onClick={() => view === 'menu' ? navigate('/home') : setView('menu')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={24} color="#1A1D23" />
        </button>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>ASHEL <span style={{color: '#E70011'}}>Services</span></h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', zIndex: 2 }}>
        
        {view === 'menu' && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '20px', fontSize: '1rem', fontWeight: '700' }}>E-Administration</h3>
            {services.map(s => (
              <div key={s.id} className="service-row" onClick={() => { setSelectedService(s); setView('form'); }}>
                <div className="icon-box">{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{s.title}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.desc}</p>
                </div>
                <Plus size={18} color="#E70011" />
              </div>
            ))}
            <button onClick={() => setView('history')} className="btn-outline" style={{ marginTop: '30px' }}>
              <Clock size={18} /> Historique des demandes
            </button>
          </div>
        )}

        {view === 'form' && (
          <div className="fade-in">
            <div style={{ background: '#F1F5F9', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>Service choisi :</p>
              <p style={{ fontSize: '1.1rem', color: '#0056D2', fontWeight: 'bold' }}>{selectedService?.title}</p>
            </div>

            <form onSubmit={handleCreateDemande}>
              <div className="input-group">
                <input type="text" placeholder="Prénom du père" className="ashal-input" required />
              </div>
              <div className="input-group">
                <input type="text" placeholder="Commune de naissance" className="ashal-input" required />
              </div>

              <div style={{ border: '2px dashed #CBD5E1', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px' }}>
                <Upload size={24} color="#64748B" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Joindre une copie de la CIN</p>
                <label style={{ color: '#0056D2', fontWeight: 'bold', cursor: 'pointer' }}>Parcourir</label>
              </div>

              <button type="submit" className="btn-ashal-primary">VALIDER LA DEMANDE</button>
            </form>
          </div>
        )}

        {view === 'history' && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '20px', fontSize: '1rem', fontWeight: '700' }}>Suivi des dossiers</h3>
            {demandes.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748B', marginTop: '40px' }}>Aucun dossier en cours.</p>
            ) : (
              demandes.map(d => (
                <div key={d.id} className="history-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#E70011' }}>{d.ref}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#F59E0B' }}>{d.statut}</span>
                  </div>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{d.service}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Soumis le {d.date}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EAdministration;