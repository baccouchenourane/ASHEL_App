import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const SignalementList = () => {
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/api/signalements/citoyen/1')
      .then(res => res.json())
      .then(data => {
        setSignalements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'NOUVEAU':
        return { color: '#E70011', icon: <AlertCircle size={16} /> };
      case 'EN_COURS':
        return { color: '#F59E0B', icon: <Clock size={16} /> };
      case 'RESOLU':
        return { color: '#10B981', icon: <CheckCircle size={16} /> };
      case 'REJETE':
        return { color: '#6B7280', icon: <XCircle size={16} /> };
      default:
        return { color: '#6B7280', icon: <Clock size={16} /> };
    }
  };

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>

      <div style={{
        padding: '40px 25px', flex: 1,
        display: 'flex', flexDirection: 'column',
        zIndex: 2, position: 'relative',
        backgroundColor: '#F8FAFC',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
          <ArrowLeft
            size={24}
            style={{ cursor: 'pointer', marginRight: '12px' }}
            onClick={() => navigate('/home')}
          />
          <img src={logoAshel} alt="Logo" style={{ height: '35px' }} />
        </div>

        <div style={{ marginBottom: '25px' }} className="fade-in">
          <div className="page-icon-box">
            <AlertCircle size={24} color="white" />
          </div>
          <h2 className="page-title">Mes signalements</h2>
          <p className="page-subtitle">Suivez l'état de vos signalements</p>
        </div>

        <div className="page-form-card">
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748B', marginTop: '40px' }}>
            Chargement...
          </div>
        ) : signalements.length === 0 ? (
          <div style={{
            textAlign: 'center', color: '#64748B',
            marginTop: '40px', padding: '30px',
            border: '2px dashed #E2E8F0', borderRadius: '12px'
          }}>
            <AlertCircle size={40} color="#CBD5E1" style={{ marginBottom: '10px' }} />
            <p>Aucun signalement pour le moment</p>
            <span
              onClick={() => navigate('/signalement')}
              style={{ color: '#E70011', fontWeight: '700', cursor: 'pointer' }}
            >
              Soumettre un signalement
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {signalements.map(s => {
              const statutStyle = getStatutStyle(s.statut);
              return (
                <div key={s.id} style={{
                  backgroundColor: 'white', borderRadius: '14px',
                  padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${statutStyle.color}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px' }}>
                        {s.titre}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '8px' }}>
                        {s.categorie}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        {new Date(s.dateCreation).toLocaleDateString('fr-TN')}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      color: statutStyle.color, fontSize: '0.75rem', fontWeight: '700'
                    }}>
                      {statutStyle.icon}
                      {s.statut}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>

        {/* Bouton nouveau signalement */}
        {signalements.length > 0 && (
          <button
            className="btn-ashal-primary"
            onClick={() => navigate('/signalement')}
            style={{ marginTop: '20px' }}
          >
            NOUVEAU SIGNALEMENT
          </button>
        )}

      </div>
    </div>
  );
};

export default SignalementList;