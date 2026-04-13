import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/api/signalements')
      .then(res => res.json())
      .then(data => {
        setSignalements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const changerStatut = async (id, statut) => {
    try {
      await fetch(`http://localhost:8081/api/signalements/${id}/statut?statut=${statut}`, {
        method: 'PATCH',
      });
      setSignalements(prev =>
        prev.map(s => s.id === id ? { ...s, statut } : s)
      );
      setMessage({ type: 'success', text: `Statut mis à jour : ${statut}` });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'NOUVEAU': return '#E70011';
      case 'EN_COURS': return '#F59E0B';
      case 'RESOLU': return '#10B981';
      case 'REJETE': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>

      <div style={{
        padding: '40px 25px', flex: 1,
        display: 'flex', flexDirection: 'column',
        zIndex: 2, position: 'relative'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer', marginRight: '12px' }}
            onClick={() => navigate('/home')} />
          <img src={logoAshel} alt="Logo" style={{ height: '35px' }} />
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>
          Dashboard Admin
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '20px' }}>
          {signalements.length} signalement(s) au total
        </p>

        {message && (
          <div style={{
            backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            borderRadius: '10px', padding: '12px',
            marginBottom: '16px', fontSize: '0.85rem',
            color: message.type === 'success' ? '#065F46' : '#B91C1C',
            fontWeight: '600'
          }}>
            {message.text}
          </div>
        )}

        {/* Stats rapides */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['NOUVEAU', 'EN_COURS', 'RESOLU'].map(statut => (
            <div key={statut} style={{
              flex: 1, backgroundColor: 'white', borderRadius: '10px',
              padding: '12px', textAlign: 'center',
              borderTop: `3px solid ${getStatutColor(statut)}`
            }}>
              <p style={{ fontSize: '1.4rem', fontWeight: '800', color: getStatutColor(statut) }}>
                {signalements.filter(s => s.statut === statut).length}
              </p>
              <p style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '700' }}>
                {statut}
              </p>
            </div>
          ))}
        </div>

        {/* Liste signalements */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748B' }}>Chargement...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {signalements.map(s => (
              <div key={s.id} style={{
                backgroundColor: 'white', borderRadius: '14px',
                padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${getStatutColor(s.statut)}`
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{s.titre}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{s.categorie}</p>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                    {s.description}
                  </p>
                </div>

                {/* Boutons actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => changerStatut(s.id, 'EN_COURS')}
                    disabled={s.statut === 'EN_COURS'}
                    style={{
                      padding: '6px 12px', borderRadius: '8px', border: 'none',
                      backgroundColor: '#FEF3C7', color: '#92400E',
                      fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                      opacity: s.statut === 'EN_COURS' ? 0.5 : 1
                    }}>
                    <Clock size={12} style={{ marginRight: '4px' }} />
                    En cours
                  </button>
                  <button
                    onClick={() => changerStatut(s.id, 'RESOLU')}
                    disabled={s.statut === 'RESOLU'}
                    style={{
                      padding: '6px 12px', borderRadius: '8px', border: 'none',
                      backgroundColor: '#D1FAE5', color: '#065F46',
                      fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                      opacity: s.statut === 'RESOLU' ? 0.5 : 1
                    }}>
                    <CheckCircle size={12} style={{ marginRight: '4px' }} />
                    Résolu
                  </button>
                  <button
                    onClick={() => changerStatut(s.id, 'REJETE')}
                    disabled={s.statut === 'REJETE'}
                    style={{
                      padding: '6px 12px', borderRadius: '8px', border: 'none',
                      backgroundColor: '#F1F5F9', color: '#475569',
                      fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                      opacity: s.statut === 'REJETE' ? 0.5 : 1
                    }}>
                    <XCircle size={12} style={{ marginRight: '4px' }} />
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;