import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, ArrowLeft } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const Signalement = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titre: '',
    description: '',
    categorie: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.titre || !form.description || !form.categorie) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/signalements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, citoyenId: 1 }),
      });
      if (!response.ok) throw new Error('Erreur serveur');
      setSuccess(true);
      setForm({ titre: '', description: '', categorie: '' });
    } catch (err) {
      setError('Erreur lors de la soumission. Réessayez.');
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
            <AlertTriangle size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>
            Signalement
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
            Signalez un dysfonctionnement à l'administration
          </p>
        </div>

        {/* Success */}
        {success && (
          <div style={{
            backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7',
            borderRadius: '12px', padding: '15px', marginBottom: '20px',
            color: '#065F46', fontSize: '0.85rem', fontWeight: '600'
          }}>
            Signalement soumis avec succès ! Nous traitons votre demande.
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div style={{
            color: '#B91C1C', fontSize: '0.8rem',
            marginBottom: '15px', fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="fade-in">

          <div className="input-group">
            <input
              type="text"
              name="titre"
              placeholder="Titre du signalement"
              className="ashal-input"
              value={form.titre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <select
              name="categorie"
              className="ashal-input"
              value={form.categorie}
              onChange={handleChange}
              required
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">-- Catégorie --</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="TRANSPORT">Transport</option>
              <option value="ADMINISTRATION">Administration</option>
              <option value="SANTE">Santé</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div className="input-group">
            <textarea
              name="description"
              placeholder="Décrivez le problème en détail..."
              className="ashal-input"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
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
            {loading ? 'ENVOI...' : 'SOUMETTRE'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Signalement;