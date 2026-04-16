import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, Star, ChevronRight, Users } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const ParticipationHub = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: 'reclamation',
      title: 'Réclamation',
      subtitle: 'Déposez une demande officielle',
      icon: <FileText size={22} color="white" />,
      route: '/reclamation',
      accent: '#E70011',
    },
    {
      key: 'signalement',
      title: 'Signalement',
      subtitle: 'Signalez un dysfonctionnement',
      icon: <AlertTriangle size={22} color="white" />,
      route: '/signalement',
      accent: '#E70011',
    },
    {
      key: 'evaluation',
      title: 'Évaluation',
      subtitle: 'Notez la qualité d’un service public',
      icon: <Star size={22} color="white" />,
      route: '/evaluation',
      accent: '#E70011',
    },
  ];

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay" />

      <div
        style={{
          padding: '40px 25px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
          position: 'relative',
          backgroundColor: '#F8FAFC',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
          <ArrowLeft
            size={24}
            style={{ cursor: 'pointer', marginRight: '12px', color: '#1e293b' }}
            onClick={() => navigate('/home')}
          />
          <img src={logoAshel} alt="Logo" style={{ height: '35px' }} />
        </div>

        {/* Title */}
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #E70011 0%, #c5000e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              color: 'white',
            }}
          >
            <Users size={22} color="white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px', color: '#111827' }}>
            Participation
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
            Choisissez ce que vous souhaitez faire
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
          {items.map((it) => (
            <div
              key={it.key}
              onClick={() => navigate(it.route)}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${it.accent} 0%, #c5000e 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {it.icon}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '900', fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>{it.title}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{it.subtitle}</p>
              </div>

              <ChevronRight size={18} color="#94A3B8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipationHub;

