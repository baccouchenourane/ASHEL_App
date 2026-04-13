import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, ArrowLeft, Camera, X } from 'lucide-react';
import '../App.css';
import logoAshel from '../assets/logo_ashel.png';

const Signalement = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titre: '',
    description: '',
    categorie: '',
  });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);

    // Max 3 photos
    if (photos.length + files.length > 3) {
      setError('Maximum 3 photos autorisées.');
      return;
    }

    // Max 5MB par photo
    const tooLarge = files.find(f => f.size > 5 * 1024 * 1024);
    if (tooLarge) {
      setError('Chaque photo doit faire moins de 5MB.');
      return;
    }

    setError('');
    setPhotos(prev => [...prev, ...files]);

    // Générer les aperçus
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const supprimerPhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
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
      // FormData pour envoyer texte + photos ensemble
      const formData = new FormData();
      formData.append('titre', form.titre);
      formData.append('description', form.description);
      formData.append('categorie', form.categorie);
      formData.append('citoyenId', '1');
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await fetch('http://localhost:8081/api/signalements', {
        method: 'POST',
        body: formData,
        // PAS de Content-Type ici — le navigateur le met automatiquement
      });

      if (!response.ok) throw new Error('Erreur serveur');

      setSuccess(true);
      setForm({ titre: '', description: '', categorie: '' });
      setPhotos([]);
      setPreviews([]);

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

          {/* Zone upload photos */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '0.8rem', color: '#64748B',
              fontWeight: '700', marginBottom: '10px'
            }}>
              PHOTOS DU PROBLÈME (optionnel — max 3)
            </p>

            {/* Bouton upload */}
            {photos.length < 3 && (
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '14px', borderRadius: '12px',
                border: '2px dashed #CBD5E1', cursor: 'pointer',
                color: '#64748B', fontSize: '0.85rem', fontWeight: '600',
                marginBottom: '12px', transition: 'all 0.2s',
              }}>
                <Camera size={20} color="#E70011" />
                Ajouter une photo
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotos}
                  style={{ display: 'none' }}
                />
              </label>
            )}

            {/* Aperçus photos */}
            {previews.length > 0 && (
              <div style={{
                display: 'flex', gap: '10px', flexWrap: 'wrap'
              }}>
                {previews.map((src, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={src}
                      alt={`photo ${index + 1}`}
                      style={{
                        width: '90px', height: '90px',
                        objectFit: 'cover', borderRadius: '10px',
                        border: '2px solid #E2E8F0'
                      }}
                    />
                    {/* Bouton supprimer */}
                    <button
                      type="button"
                      onClick={() => supprimerPhoto(index)}
                      style={{
                        position: 'absolute', top: '-8px', right: '-8px',
                        width: '22px', height: '22px',
                        backgroundColor: '#E70011', border: 'none',
                        borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', padding: 0
                      }}
                    >
                      <X size={12} color="white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-ashal-primary"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px'
            }}
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