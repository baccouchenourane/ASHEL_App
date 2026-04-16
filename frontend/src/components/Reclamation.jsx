import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, ArrowLeft } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const Reclamation = () => {
  const navigate = useNavigate();
  const SERVICES = [
    'Mairie',
    'Hôpital',
    'Transport en commun',
    'École publique',
    'Poste',
    'Autre',
  ];

  const [form, setForm] = useState({ objet: '', contenu: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.objet || !form.contenu) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/reclamations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, citoyenId: 1 }),
      });
      if (!response.ok) throw new Error('Erreur serveur');
      setSuccess(true);
      setForm({ objet: '', contenu: '' });
    } catch {
      setError('Erreur lors du dépôt. Réessayez.');
    } finally {
      setLoading(false);
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

        {/* Titre */}
        <div style={{ marginBottom: '25px' }} className="fade-in">
          <div className="page-icon-box">
            <FileText size={24} color="white" />
          </div>
          <h2 className="page-title">
            Réclamation
          </h2>
          <p className="page-subtitle">
            Déposez une réclamation officielle
          </p>
        </div>

        {success && (
          <div style={{
            backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7',
            borderRadius: '12px', padding: '15px', marginBottom: '20px',
            color: '#065F46', fontSize: '0.85rem', fontWeight: '600'
          }}>
            Réclamation déposée. Vous serez contacté sous 48h.
          </div>
        )}

        {error && (
          <div style={{
            color: '#B91C1C', fontSize: '0.8rem',
            marginBottom: '15px', fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        <div className="page-form-card">
        <form onSubmit={handleSubmit} className="fade-in">
          <div className="input-group">
            <select
              name="objet"
              className="ashal-input"
              value={form.objet}
              onChange={handleChange}
              required
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">-- Service public --</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <textarea
              placeholder="Décrivez votre réclamation en détail..."
              className="ashal-input"
              value={form.contenu}
              onChange={handleChange}
              required
              rows={5}
              style={{ resize: 'none', paddingTop: '14px' }}
              name="contenu"
            />
          </div>

          <button
            type="submit"
            className="btn-ashal-primary"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Send size={18} />
            {loading ? 'ENVOI...' : 'DÉPOSER LA RÉCLAMATION'}
          </button>

        </form>
        </div>
      </div>
    </div>
  );
};

export default Reclamation;