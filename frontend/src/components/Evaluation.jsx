import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send, ArrowLeft } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const Evaluation = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    note: 0,
    commentaire: '',
    servicePublic: '',
  });
  const [hovered, setHovered] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.servicePublic || form.note === 0) {
      setError('Veuillez choisir un service et une note.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, citoyenId: 1 }),
      });
      if (!response.ok) throw new Error('Erreur serveur');
      setSuccess(true);
      setForm({ note: 0, commentaire: '', servicePublic: '' });
    } catch {
      setError('Erreur lors de l\'envoi. Réessayez.');
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
            <Star size={24} color="white" />
          </div>
          <h2 className="page-title">
            Évaluation
          </h2>
          <p className="page-subtitle">
            Notez la qualité d'un service public
          </p>
        </div>

        {success && (
          <div style={{
            backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7',
            borderRadius: '12px', padding: '15px', marginBottom: '20px',
            color: '#065F46', fontSize: '0.85rem', fontWeight: '600'
          }}>
            Merci pour votre évaluation !
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
              className="ashal-input"
              value={form.servicePublic}
              onChange={(e) => setForm({ ...form, servicePublic: e.target.value })}
              required
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">-- Service public --</option>
              <option value="Mairie">Mairie</option>
              <option value="Hôpital">Hôpital</option>
              <option value="Transport en commun">Transport en commun</option>
              <option value="École publique">École publique</option>
              <option value="Poste">Poste</option>
            </select>
          </div>

          {/* Étoiles */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '0.8rem', color: '#64748B',
              fontWeight: '700', marginBottom: '10px'
            }}>
              VOTRE NOTE
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setForm({ ...form, note: star })}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    fontSize: '2.2rem',
                    cursor: 'pointer',
                    color: star <= (hovered || form.note)
                      ? '#E70011' : '#E2E8F0',
                    transition: 'color 0.15s',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="input-group">
            <textarea
              placeholder="Votre commentaire (optionnel)..."
              className="ashal-input"
              value={form.commentaire}
              onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
              rows={3}
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
            {loading ? 'ENVOI...' : 'ENVOYER MON AVIS'}
          </button>

        </form>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;