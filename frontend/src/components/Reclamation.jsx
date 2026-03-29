import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, ArrowLeft } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const Reclamation = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ objet: '', contenu: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.objet || !form.contenu) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/reclamations', {
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
        zIndex: 2, position: 'relative'
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
          <div style={{
            width: '48px', height: '48px', backgroundColor: '#E70011',
            borderRadius: '14px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '15px'
          }}>
            <FileText size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>
            Réclamation
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
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

        <form onSubmit={handleSubmit} className="fade-in">

          <div className="input-group">
            <input
              type="text"
              placeholder="Objet de la réclamation"
              className="ashal-input"
              value={form.objet}
              onChange={(e) => setForm({ ...form, objet: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <textarea
              placeholder="Décrivez votre réclamation en détail..."
              className="ashal-input"
              value={form.contenu}
              onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              required
              rows={5}
              style={{ resize: 'none', paddingTop: '14px' }}
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
  );
};

export default Reclamation;