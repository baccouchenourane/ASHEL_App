import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Shield, MapPin, Car, AlertTriangle,
  CheckCircle2, Camera, ChevronDown, FileText
} from 'lucide-react';

const TYPES_INFRACTION = [
  { id: 'vitesse', label: 'Excès de vitesse', montant: 60 },
  { id: 'stationnement', label: 'Stationnement interdit', montant: 30 },
  { id: 'feu_rouge', label: 'Non-respect du feu rouge', montant: 80 },
  { id: 'telephone', label: 'Usage du téléphone au volant', montant: 50 },
  { id: 'ceinture', label: 'Non-port de la ceinture', montant: 40 },
  { id: 'autre', label: 'Autre infraction', montant: 30 },
];

const LIEUX = [
  'Autoroute A1 - Tunis/Sfax', 'Autoroute A3 - Tunis/Bizerte',
  'Boulevard principal - Tunis', 'Avenue Habib Bourguiba',
  'Route de Radès', 'Route de La Marsa', 'Route de Sousse', 'Autre lieu'
];

const AgentSaisie = () => {
  const navigate = useNavigate();
  const [matricule, setMatricule] = useState('');
  const [infraction, setInfraction] = useState(null);
  const [lieu, setLieu] = useState('');
  const [vitesse, setVitesse] = useState('');
  const [vitesseLimite, setVitesseLimite] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [pvGenere, setPvGenere] = useState(null);
  const [showInfractions, setShowInfractions] = useState(false);
  const [showLieux, setShowLieux] = useState(false);

  const agentInfo = JSON.parse(localStorage.getItem('user_ashel')) || { nom: 'AGENT KARIM' };

  const today = new Date().toLocaleDateString('fr-TN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matricule || matricule.length < 8) { setError('Matricule invalide.'); return; }
    if (!infraction) { setError('Veuillez sélectionner le type d\'infraction.'); return; }
    if (!lieu) { setError('Veuillez indiquer le lieu.'); return; }
    setError('');
    setLoading(true);

    const pv = {
      reference: `PV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
      matricule,
      infraction: infraction.label,
      montant: infraction.montant,
      lieu,
      date: today,
      agentId: agentInfo.nom,
      notes,
    };

    try {
      await fetch('http://localhost:8081/api/amende/creer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pv),
      });
      setTimeout(() => { setLoading(false); setSuccess(true); setPvGenere(pv); }, 2000);
    } catch {
      setTimeout(() => { setLoading(false); setSuccess(true); setPvGenere(pv); }, 2000);
    }
  };

  if (success && pvGenere) {
    return (
      <div style={wrapper}>
        <div className="app-container" style={{ background: '#f4f7fe' }}>
          {/* Status Bar */}
          <div style={{ ...statusBar, background: '#1e3a5f' }}>
            <span style={{ fontWeight: '700', fontSize: '13px' }}>09:41</span>
            <span style={{ fontSize: '11px', fontWeight: '700' }}>5G</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <CheckCircle2 size={45} color="#059669" />
            </div>
            <h2 style={{ fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>PV Enregistré !</h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '20px' }}>L'amende a été transmise au conducteur.</p>

            {/* Reçu PV */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', width: '100%', textAlign: 'left', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <Shield size={18} color="#0056D2" />
                <span style={{ fontWeight: '900', fontSize: '0.85rem', color: '#1e293b' }}>PROCÈS-VERBAL N° {pvGenere.reference}</span>
              </div>
              {[
                ['Matricule', pvGenere.matricule],
                ['Infraction', pvGenere.infraction],
                ['Montant', `${pvGenere.montant}.000 DT`],
                ['Lieu', pvGenere.lieu],
                ['Date', pvGenere.date],
                ['Agent', pvGenere.agentId],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>{label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: '800', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => { setSuccess(false); setMatricule(''); setInfraction(null); setLieu(''); setNotes(''); setVitesse(''); setVitesseLimite(''); }} style={{ ...btnPrimary, marginBottom: '12px' }}>
              SAISIR UNE NOUVELLE AMENDE
            </button>
            <button onClick={() => navigate('/home')} style={{ ...btnPrimary, background: 'transparent', color: '#64748b', boxShadow: 'none', border: '1.5px solid #e2e8f0' }}>
              RETOUR À L'ACCUEIL
            </button>
          </div>
        </div>
        <style>{appStyle}</style>
      </div>
    );
  }

  return (
    <div style={wrapper}>
      <div className="app-container">

        {/* Status Bar */}
        <div style={{ ...statusBar, background: '#1e3a5f' }}>
          <span style={{ fontWeight: '700', fontSize: '13px' }}>09:41</span>
          <span style={{ fontSize: '11px', fontWeight: '700' }}>5G</span>
        </div>

        {/* Header */}
        <div style={{ padding: '18px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e3a5f', flexShrink: 0 }}>
          <ArrowLeft onClick={() => navigate('/home')} style={{ cursor: 'pointer', color: 'white' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="#93c5fd" />
            <span style={{ fontSize: '0.85rem', fontWeight: '900', color: 'white' }}>SAISIE AMENDE</span>
          </div>
          <div style={{ width: '24px' }} />
        </div>

        {/* Agent Badge */}
        <div style={{ background: '#1e3a5f', padding: '0 25px 18px 25px', flexShrink: 0 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase' }}>Agent de police</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'white', fontWeight: '900' }}>{agentInfo.nom}</p>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
              <div style={{ color: '#93c5fd', fontWeight: '700' }}>{today}</div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f4f7fe' }}>
          <div style={{ padding: '20px' }}>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Matricule */}
              <div>
                <label style={labelStyle}>Matricule du véhicule *</label>
                <div style={{ position: 'relative' }}>
                  <Car size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Ex: 235 TUN 4567"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value.toUpperCase())}
                    style={{ ...inputStyle, paddingLeft: '44px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}
                    required
                  />
                </div>
              </div>

              {/* Type infraction */}
              <div>
                <label style={labelStyle}>Type d'infraction *</label>
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowInfractions(!showInfractions)}
                    style={{ ...inputStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: infraction ? '#1e293b' : '#94a3b8' }}
                  >
                    <span>{infraction ? infraction.label : 'Sélectionner...'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {infraction && <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.65rem', fontWeight: '900', padding: '3px 8px', borderRadius: '8px' }}>{infraction.montant} DT</span>}
                      <ChevronDown size={16} style={{ transform: showInfractions ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </div>
                  </div>
                  {showInfractions && (
                    <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'white', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 10, overflow: 'hidden' }}>
                      {TYPES_INFRACTION.map(inf => (
                        <div key={inf.id} onClick={() => { setInfraction(inf); setShowInfractions(false); }}
                          style={{ padding: '13px 16px', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700', color: '#1e293b' }}>{inf.label}</span>
                          <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.65rem', fontWeight: '900', padding: '3px 8px', borderRadius: '8px' }}>{inf.montant} DT</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Champs vitesse si excès de vitesse */}
              {infraction?.id === 'vitesse' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Vitesse mesurée (km/h)</label>
                    <input type="number" placeholder="Ex: 120" value={vitesse} onChange={(e) => setVitesse(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Limite autorisée (km/h)</label>
                    <input type="number" placeholder="Ex: 90" value={vitesseLimite} onChange={(e) => setVitesseLimite(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              )}

              {/* Lieu */}
              <div>
                <label style={labelStyle}>Lieu de l'infraction *</label>
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowLieux(!showLieux)}
                    style={{ ...inputStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: lieu ? '#1e293b' : '#94a3b8' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color={lieu ? '#0056D2' : '#94a3b8'} />
                      <span>{lieu || 'Sélectionner le lieu...'}</span>
                    </div>
                    <ChevronDown size={16} style={{ transform: showLieux ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {showLieux && (
                    <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'white', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 10, overflow: 'hidden' }}>
                      {LIEUX.map(l => (
                        <div key={l} onClick={() => { setLieu(l); setShowLieux(false); }}
                          style={{ padding: '13px 16px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                          {l}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Observations (optionnel)</label>
                <textarea rows={3} placeholder="Circonstances particulières, témoins, dommages..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, resize: 'none' }} />
              </div>

              {/* Photo */}
              <div>
                <label style={labelStyle}>Photo / Preuve (optionnel)</label>
                <label style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#64748b' }}>
                  <Camera size={18} color="#1e3a5f" />
                  <span style={{ fontSize: '0.85rem' }}>Ajouter une photo de l'infraction</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} />
                </label>
              </div>

              {/* Info légale */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <FileText size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#1e40af', fontWeight: '600', lineHeight: '1.5' }}>
                  Ce PV sera automatiquement notifié au propriétaire du véhicule via l'application ASHEL. Il disposera de <strong>30 jours</strong> pour payer ou contester.
                </p>
              </div>

              {error && (
                <p style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', margin: 0 }}>{error}</p>
              )}

              <button type="submit" disabled={loading} style={submitBtn}>
                {loading
                  ? <div className="spinner" />
                  : <><AlertTriangle size={18} /> ÉMETTRE LE PROCÈS-VERBAL</>
                }
              </button>
            </form>

          </div>
        </div>
      </div>

      <style>{`
        ${appStyle}
        .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const wrapper = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e2e8f0', padding: '20px', fontFamily: 'sans-serif' };
const statusBar = { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', color: 'white', flexShrink: 0 };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white', boxSizing: 'border-box', fontFamily: 'sans-serif' };
const labelStyle = { fontSize: '0.72rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block', marginLeft: '3px' };
const submitBtn = { marginTop: '5px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '15px', padding: '18px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(30,58,95,0.3)', width: '100%' };
const btnPrimary = { width: '100%', padding: '16px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '10px' };
const appStyle = `.app-container { width: 390px; height: 844px; background: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); border-radius: 50px; border: 4px solid #334155; }`;

export default AgentSaisie;
