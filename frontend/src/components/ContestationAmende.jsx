import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShieldCheck, FileText, Upload,
  CheckCircle2, AlertTriangle, ChevronDown
} from 'lucide-react';

const MOTIFS = [
  "Je n'étais pas au volant",
  "Erreur de lecture du radar",
  "Véhicule vendu avant la date de l'infraction",
  "Panneau de signalisation absent ou illisible",
  "Urgence médicale documentée",
  "Autre motif",
];

const ContestationAmende = () => {
  const navigate = useNavigate();
  const [motif, setMotif] = useState('');
  const [description, setDescription] = useState('');
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showMotifs, setShowMotifs] = useState(false);

  const amendeInfo = {
    reference: "PV-2026-88",
    type: "Excès de vitesse - Radès",
    date: "22 Mars 2026",
    montant: "60.000 DT",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motif) { setError('Veuillez sélectionner un motif de contestation.'); return; }
    if (description.trim().length < 20) { setError('Veuillez décrire votre contestation (minimum 20 caractères).'); return; }

    setError('');
    setLoading(true);

    try {
      // Appel backend
      await fetch('/api/amende/contester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cin: JSON.parse(localStorage.getItem('user_ashel'))?.cin || '',
          referenceAmende: amendeInfo.reference,
          motif,
          description,
        }),
      });
      setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
    } catch {
      // Même sans backend, on simule le succès pour la démo
      setTimeout(() => { setLoading(false); setSuccess(true); }, 2000);
    }
  };

  if (success) {
    return (
      <div style={wrapper}>
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center', background: 'white' }}>
          <div style={{ width: '100px', height: '100px', background: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
            <CheckCircle2 size={50} color="#ea580c" />
          </div>
          <h2 style={{ fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>Contestation Envoyée !</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '10px' }}>
            Votre dossier a été transmis au Ministère de l'Intérieur.
          </p>
          <div style={{ background: '#fff7ed', borderRadius: '16px', padding: '16px', margin: '20px 0', width: '100%', textAlign: 'left' }}>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Référence :</strong> {amendeInfo.reference}</p>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Motif :</strong> {motif}</p>
            <p style={{ margin: '5px 0', fontSize: '0.75rem' }}><strong>Délai de réponse :</strong> 15 jours ouvrables</p>
            <p style={{ margin: '5px 0', fontSize: '0.75rem', color: '#ea580c', fontWeight: '700' }}>
              ⚠ Le paiement est suspendu pendant l'examen.
            </p>
          </div>
          <button onClick={() => navigate('/e-amende')} style={btnPrimary}>
            RETOUR À MES AMENDES
          </button>
        </div>
        <style>{appStyle}</style>
      </div>
    );
  }

  return (
    <div style={wrapper}>
      <div className="app-container">

        {/* Status Bar */}
        <div style={statusBar}>
          <span style={{ fontWeight: '700', fontSize: '13px' }}>09:41</span>
          <span style={{ fontSize: '11px', fontWeight: '700' }}>5G</span>
        </div>

        {/* Header */}
        <div style={header}>
          <ArrowLeft onClick={() => navigate('/e-amende')} style={{ cursor: 'pointer', color: '#1e293b' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#ea580c" />
            <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#1e293b' }}>CONTESTER L'AMENDE</span>
          </div>
          <div style={{ width: '24px' }} />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f4f7fe' }}>
          <div style={{ padding: '20px' }}>

            {/* Récapitulatif de l'amende */}
            <div style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)', borderRadius: '22px', padding: '20px', color: 'white', marginBottom: '25px' }}>
              <p style={{ margin: 0, fontSize: '0.6rem', opacity: 0.7, fontWeight: '800', letterSpacing: '1px' }}>AMENDE EN CONTESTATION</p>
              <h3 style={{ margin: '6px 0 5px 0', fontSize: '1rem', fontWeight: '900' }}>{amendeInfo.type}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{amendeInfo.date}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '900' }}>{amendeInfo.montant}</span>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={14} color="#fca5a5" />
                <span style={{ fontSize: '0.65rem', opacity: 0.9 }}>Réf. {amendeInfo.reference}</span>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Motif */}
              <div>
                <label style={labelStyle}>Motif de contestation *</label>
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowMotifs(!showMotifs)}
                    style={{ ...inputStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: motif ? '#1e293b' : '#94a3b8' }}
                  >
                    <span>{motif || 'Sélectionner un motif...'}</span>
                    <ChevronDown size={16} style={{ transform: showMotifs ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {showMotifs && (
                    <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'white', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 10, overflow: 'hidden' }}>
                      {MOTIFS.map(m => (
                        <div
                          key={m}
                          onClick={() => { setMotif(m); setShowMotifs(false); }}
                          style={{ padding: '13px 16px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}
                        >
                          {m}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description détaillée *</label>
                <textarea
                  rows={5}
                  placeholder="Expliquez les circonstances de l'infraction contestée, les faits, et tout élément pertinent pour votre dossier..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
                  required
                />
                <p style={{ margin: '5px 0 0 5px', fontSize: '0.65rem', color: description.length < 20 ? '#e11d48' : '#10b981', fontWeight: '700' }}>
                  {description.length}/20 caractères minimum
                </p>
              </div>

              {/* Justificatif */}
              <div>
                <label style={labelStyle}>Pièce justificative (optionnel)</label>
                <label style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#64748b' }}>
                  <Upload size={18} color="#0056D2" />
                  <span style={{ fontSize: '0.85rem' }}>
                    {fichier ? fichier.name : 'Ajouter un document (PDF, JPG, PNG)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFichier(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Info légale */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <FileText size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#92400e', fontWeight: '600', lineHeight: '1.5' }}>
                  Toute fausse déclaration est passible de poursuites. Le délai légal de contestation est de <strong>30 jours</strong> à compter de la date de l'infraction.
                </p>
              </div>

              {error && (
                <p style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', margin: 0 }}>{error}</p>
              )}

              <button type="submit" disabled={loading} style={submitBtn}>
                {loading
                  ? <div className="spinner" />
                  : <><ShieldCheck size={18} /> SOUMETTRE MA CONTESTATION</>
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
const statusBar = { height: '44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#7f1d1d', color: 'white', flexShrink: 0 };
const header = { padding: '18px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #e2e8f0', flexShrink: 0 };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white', boxSizing: 'border-box', fontFamily: 'sans-serif' };
const labelStyle = { fontSize: '0.72rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block', marginLeft: '3px' };
const submitBtn = { marginTop: '5px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '15px', padding: '18px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(185,28,28,0.3)', width: '100%' };
const btnPrimary = { width: '100%', maxWidth: '300px', padding: '16px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer' };
const appStyle = `.app-container { width: 390px; height: 844px; background: #ffffff; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25); border-radius: 50px; border: 4px solid #334155; }`;

export default ContestationAmende;
