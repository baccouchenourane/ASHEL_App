import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, History, Car, QrCode, ShieldCheck, 
  Calendar, MapPin, ChevronRight, X, AlertTriangle,
  FileText, Scale, Gavel, Clock, MessageCircle, Users
} from 'lucide-react';

const EAmende = () => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [selectedAmende, setSelectedAmende] = useState(null);

  const userData = JSON.parse(localStorage.getItem('user_ashel')) || { 
    nom: "MOHAMED ALI",
    cin: "12345678"
  };

  const userCars = [
    { modele: "Volkswagen Golf 8", matricule: "235 TUN 4567" }
  ];

  // Liste des amendes (simulée)
  const amendes = [
    {
      id: "PV-2026-88",
      type: "Excès de vitesse - Radès",
      date: "22 Mars 2026",
      montant: "60.000 DT",
      lieu: "RN1, Radès",
      vitesse: "96 km/h (limite 70)",
      contestable: true,
      delaiContestation: "15 jours"
    },
    {
      id: "PV-2026-45",
      type: "Stationnement gênant",
      date: "15 Mars 2026",
      montant: "30.000 DT",
      lieu: "Centre-ville, Tunis",
      contestable: true,
      delaiContestation: "30 jours"
    }
  ];

  const handleContester = (amende) => {
    setSelectedAmende(amende);
    setShowContestModal(true);
  };

  const handleAgentSaisie = () => {
    navigate('/agent-saisie', { 
      state: { 
        userCIN: userData.cin,
        userName: userData.nom,
        amendeId: selectedAmende?.id 
      } 
    });
  };

  const handleDirectContestation = (amende) => {
    navigate('/contestation-amende', { 
      state: { 
        amendeId: amende.id,
        amendeType: amende.type,
        amendeDate: amende.date,
        montant: amende.montant,
        userCIN: userData.cin,
        userName: userData.nom
      } 
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0', padding: '20px', fontFamily: 'sans-serif' }}>
      <div className="app-container">

        {/* Status Bar */}
        <div style={{ height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#0056D2', color: 'white', flexShrink: 0 }}>
          <span style={{ fontWeight: '700', fontSize: '13px' }}>09:41</span>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700' }}>5G</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f4f7fe' }}>
          <div style={{ padding: '20px' }}>

            {/* HEADER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ArrowLeft onClick={() => navigate('/home')} style={{ cursor: 'pointer', color: '#1e293b' }} />
                <h2 style={{ color: '#1e293b', margin: 0, fontSize: '1.3rem', fontWeight: '900' }}>E-Amende</h2>
              </div>
              <div onClick={() => setShowHistory(true)} style={iconButtonStyle}><History size={20} /></div>
            </div>

            {/* 1. PERMIS DIGITAL */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={sectionTitleStyle}>VOTRE PERMIS DIGITAL</h4>
              <div style={permisCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.6rem', opacity: 0.7, fontWeight: 'bold' }}>RÉPUBLIQUE TUNISIENNE</p>
                    <h3 style={{ margin: '5px 0 15px 0', fontSize: '1rem', fontWeight: '900' }}>PERMIS DE CONDUIRE</h3>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <p style={permisLabel}>TITULAIRE</p>
                        <p style={permisData}>{userData.nom.toUpperCase()}</p>
                      </div>
                      <div>
                        <p style={permisLabel}>CIN</p>
                        <p style={permisData}>{userData.cin}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'white', padding: '8px', borderRadius: '12px', height: 'fit-content' }}>
                    <QrCode size={55} color="#1e293b" />
                  </div>
                </div>
                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                  <ShieldCheck size={14} color="#10b981" />
                  <span style={{ fontSize: '0.6rem', fontWeight: 'bold', opacity: 0.8 }}>VÉRIFIÉ PAR L'AGENCE NATIONALE DE CERTIFICATION</span>
                </div>
              </div>
            </div>

            {/* 2. MES VÉHICULES */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={sectionTitleStyle}>MES VÉHICULES</h4>
              {userCars.map((car, idx) => (
                <div key={idx} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', color: '#0056D2' }}>
                      <Car size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>{car.modele}</h3>
                      <span style={plateStyle}>{car.matricule}</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 'bold' }}>ASSURÉ</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. MES AMENDES - Version améliorée avec contestation */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={sectionTitleStyle}>INFRACTIONS EN COURS</h4>
                <button 
                  onClick={() => navigate('/agent-saisie')}
                  style={agentButtonStyle}
                >
                  <Users size={14} /> Agent
                </button>
              </div>
              
              {amendes.map((amende, idx) => (
                <div key={idx} style={{ ...cardStyle, borderLeft: '5px solid #e11d48', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{amende.type}</span>
                    <span style={{ fontSize: '1rem', fontWeight: '900', color: '#e11d48' }}>{amende.montant}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#64748b', fontSize: '0.75rem' }}>
                    <Calendar size={14} /> {amende.date}
                    <MapPin size={14} /> {amende.lieu}
                  </div>
                  {amende.vitesse && (
                    <div style={{ fontSize: '0.7rem', color: '#ef4444', marginBottom: '12px' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '5px' }} />
                      Vitesse enregistrée: {amende.vitesse}
                    </div>
                  )}
                  
                  {/* Boutons d'action */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => navigate('/paiement-amende', { state: { amende } })}
                      style={{ ...payButtonStyle, flex: 2 }}
                    >
                      PAYER <ChevronRight size={16} />
                    </button>
                    
                    {amende.contestable && (
                      <button 
                        onClick={() => handleDirectContestation(amende)}
                        style={contestButtonStyle}
                      >
                        <Gavel size={16} /> CONTESTER
                      </button>
                    )}
                  </div>
                  
                  {amende.contestable && (
                    <div style={{ marginTop: '10px', fontSize: '0.65rem', color: '#f59e0b', textAlign: 'center' }}>
                      <AlertTriangle size={10} style={{ display: 'inline', marginRight: '4px' }} />
                      Contestable jusqu'à {amende.delaiContestation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 4. SECTION CONTESTATION RAPIDE */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Scale size={24} color="#92400e" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#78350f' }}>Vous contestez une amende ?</h3>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '15px' }}>
                  Déposez votre réclamation en ligne et suivez son traitement
                </p>
                <button 
                  onClick={() => navigate('/contestation-amende')}
                  style={quickContestStyle}
                >
                  <FileText size={16} /> DÉPOSER UNE CONTESTATION
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* MODAL HISTORIQUE */}
        {showHistory && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '320px', borderRadius: '25px', padding: '25px', textAlign: 'center' }}>
              <History size={40} color="#0056D2" style={{ marginBottom: '15px', opacity: 0.2 }} />
              <h3 style={{ margin: '0 0 10px 0' }}>Historique</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>Aucun historique de paiement pour le moment.</p>
              <button onClick={() => setShowHistory(false)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#1e293b', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Fermer</button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .app-container { 
          width: 390px; height: 844px; background: #ffffff; position: relative; 
          overflow: hidden; display: flex; flex-direction: column; 
          box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); 
          border-radius: 50px; border: 4px solid #334155; 
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// Styles
const sectionTitleStyle = { 
  fontSize: '0.7rem', fontWeight: '900', color: '#64748b', 
  letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' 
};

const cardStyle = { 
  background: 'white', padding: '18px', borderRadius: '22px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '12px' 
};

const plateStyle = { 
  background: '#1e293b', color: 'white', padding: '2px 8px', 
  borderRadius: '5px', fontSize: '0.65rem', fontWeight: 'bold', 
  letterSpacing: '1px', display: 'inline-block', marginTop: '5px' 
};

const payButtonStyle = { 
  padding: '12px', background: '#0056D2', color: 'white', border: 'none', 
  borderRadius: '14px', fontWeight: '800', fontSize: '0.8rem', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', 
  gap: '8px', cursor: 'pointer' 
};

const contestButtonStyle = { 
  padding: '12px', background: '#e11d48', color: 'white', border: 'none', 
  borderRadius: '14px', fontWeight: '700', fontSize: '0.75rem', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', 
  gap: '6px', cursor: 'pointer', flex: 1 
};

const agentButtonStyle = { 
  background: '#8b5cf6', color: 'white', border: 'none', 
  padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', 
  fontWeight: '700', display: 'flex', alignItems: 'center', 
  gap: '6px', cursor: 'pointer' 
};

const quickContestStyle = { 
  width: '100%', padding: '12px', background: '#78350f', 
  color: 'white', border: 'none', borderRadius: '14px', 
  fontWeight: '800', fontSize: '0.8rem', display: 'flex', 
  alignItems: 'center', justifyContent: 'center', gap: '8px', 
  cursor: 'pointer' 
};

const iconButtonStyle = { 
  background: 'white', padding: '10px', borderRadius: '14px', 
  color: '#1e293b', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', 
  cursor: 'pointer' 
};

const permisCardStyle = { 
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
  padding: '22px', borderRadius: '25px', color: 'white', 
  position: 'relative', overflow: 'hidden', 
  boxShadow: '0 15px 30px rgba(30, 41, 59, 0.2)' 
};

const permisLabel = { margin: 0, fontSize: '0.55rem', opacity: 0.6, fontWeight: 'bold' };
const permisData = { margin: '2px 0 0 0', fontSize: '0.8rem', fontWeight: '800' };

export default EAmende;