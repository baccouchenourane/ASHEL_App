import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Send, ChevronLeft, Camera, X,
  Signal, Wifi, Battery, CheckCircle, AlertCircle,
  LayoutGrid, FileText, CreditCard, Users, User
} from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png';

const CATEGORIES = [
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
  { value: 'TRANSPORT',      label: 'Transport' },
  { value: 'ADMINISTRATION', label: 'Administration' },
  { value: 'SANTE',          label: 'Santé' },
  { value: 'AUTRE',          label: 'Autre' },
];

const Signalement = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titre: '', description: '', categorie: '' });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 3) { setError('Maximum 3 photos autorisées.'); return; }
    const tooLarge = files.find(f => f.size > 5 * 1024 * 1024);
    if (tooLarge) { setError('Chaque photo doit faire moins de 5 MB.'); return; }
    setError('');
    setPhotos(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews(prev => [...prev, ev.target.result]);
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
      const formData = new FormData();
      formData.append('titre', form.titre);
      formData.append('description', form.description);
      formData.append('categorie', form.categorie);
      const user = JSON.parse(localStorage.getItem('user_ashel') || '{}');
      formData.append('citoyenId', user.cin || '1');
      photos.forEach(photo => formData.append('photos', photo));
      const response = await fetch('http://localhost:8081/api/signalements', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Erreur serveur');
      setSuccess(true);
      setForm({ titre: '', description: '', categorie: '' });
      setPhotos([]);
      setPreviews([]);
    } catch {
      setError('Erreur lors de la soumission. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.screenWrapper}>
      <div className="app-container">
        <div className="moucharabieh-overlay" />

        {/* ── Status Bar ── */}
        <div style={S.statusBar}>
          <span style={S.statusTime}>09:41</span>
          <div style={S.statusIcons}><Signal size={13} /><Wifi size={13} /><Battery size={15} /></div>
        </div>

        {/* ── Hero Header ── */}
        <div style={S.hero}>
          <div style={S.heroTop}>
            <button onClick={() => navigate('/participation')} style={S.backBtn}>
              <ChevronLeft size={20} color="white" />
            </button>
            <img src={logoAshel} alt="ASHEL" style={S.logo} />
            <div style={{ width: 38 }} />
          </div>
          <div style={S.heroBody}>
            <div style={S.iconBox}>
              <AlertTriangle size={22} color="white" />
            </div>
            <h2 style={S.heroTitle}>Signalement</h2>
            <p style={S.heroSub}>Signalez un dysfonctionnement à l'administration</p>
          </div>
        </div>

        {/* ── Scroll Area ── */}
        <div style={S.scrollArea}>

          {success && (
            <div style={S.successBanner} className="fade-in">
              <CheckCircle size={16} />
              <span>Signalement soumis avec succès ! Nous traitons votre demande.</span>
            </div>
          )}

          {error && (
            <div style={S.errorBanner} className="fade-in">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={S.card} className="fade-in">
            <form onSubmit={handleSubmit}>

              <p style={S.fieldLabel}>TITRE DU SIGNALEMENT</p>
              <div style={S.inputWrap}>
                <input
                  type="text"
                  name="titre"
                  placeholder="Ex : Nid-de-poule rue Habib Bourguiba"
                  value={form.titre}
                  onChange={handleChange}
                  required
                  style={S.input}
                />
              </div>

              <p style={S.fieldLabel}>CATÉGORIE</p>
              <div style={S.inputWrap}>
                <select
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  required
                  style={{ ...S.input, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Sélectionner une catégorie...</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <p style={S.fieldLabel}>DESCRIPTION</p>
              <div style={S.inputWrap}>
                <textarea
                  name="description"
                  placeholder="Décrivez le problème en détail..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{ ...S.input, resize: 'none', paddingTop: '14px' }}
                />
              </div>

              {/* Photo upload */}
              <p style={S.fieldLabel}>PHOTOS (optionnel — max 3)</p>
              {photos.length < 3 && (
                <label style={S.uploadLabel}>
                  <Camera size={18} color="#E70011" />
                  <span>Ajouter une photo</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: 'none' }} />
                </label>
              )}
              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img
                        src={src}
                        alt={`photo ${i + 1}`}
                        style={{ width: '86px', height: '86px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #E2E8F0' }}
                      />
                      <button
                        type="button"
                        onClick={() => supprimerPhoto(i)}
                        style={S.removePhotoBtn}
                      >
                        <X size={11} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" disabled={loading} style={loading ? { ...S.submitBtn, ...S.submitBtnDisabled } : S.submitBtn}>
                {loading ? (
                  <>
                    <div style={S.spinner} />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <div style={S.submitIconWrap}>
                      <Send size={15} color="#E70011" />
                    </div>
                    Soumettre le signalement
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Nav Bar ── */}
        <nav style={S.navBar}>
          <NavItem icon={<LayoutGrid size={22} />} label="Accueil"       onClick={() => navigate('/home')} />
          <NavItem icon={<FileText size={22} />}   label="E-Admin"       onClick={() => navigate('/e-admin')} />
          <NavItem icon={<CreditCard size={22} />} label="Paiements"     onClick={() => navigate('/paiement')} />
          <NavItem icon={<Users size={22} />}      label="Participation" active />
          <NavItem icon={<User size={22} />}       label="Profil"        onClick={() => navigate('/profil')} />
        </nav>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .app-container {
          width: 390px; height: 844px; background: #F8FAFC;
          position: relative; overflow: hidden; display: flex; flex-direction: column;
          box-shadow: 0 0 0 12px #1e293b, 0 30px 60px rgba(0,0,0,0.3);
          border-radius: 50px; border: 4px solid #334155;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .app-container *, .app-container input, .app-container textarea, .app-container select, .app-container button {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .moucharabieh-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("https://www.transparenttextures.com/patterns/arabesque.png");
          opacity: 0.03; pointer-events: none; z-index: 1;
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: white; color: #1e293b; font-family: 'Inter', sans-serif; }
        input::placeholder, textarea::placeholder { color: #94a3b8; font-family: 'Inter', sans-serif; }
        input:focus, textarea:focus, select:focus { border-color: #E70011 !important; outline: none; background: white !important; }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}>
    <div style={{ color: active ? '#0056D2' : '#94a3b8' }}>{icon}</div>
    <span style={{ fontSize: '0.58rem', fontWeight: '700', color: active ? '#0056D2' : '#94a3b8' }}>{label}</span>
  </div>
);

const S = {
  screenWrapper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#cbd5e1',
  },
  statusBar: {
    height: '44px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0 28px',
    background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
    color: 'white', flexShrink: 0, zIndex: 10,
  },
  statusTime: { fontWeight: '700', fontSize: '13px' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
  hero: {
    background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
    padding: '0 20px 28px', color: 'white', flexShrink: 0,
    borderBottomLeftRadius: '36px', borderBottomRightRadius: '36px',
    zIndex: 5,
  },
  heroTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', paddingBottom: '20px',
  },
  backBtn: {
    width: '38px', height: '38px', background: 'rgba(255,255,255,0.15)',
    border: 'none', borderRadius: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  logo: { height: '28px', filter: 'brightness(0) invert(1)' },
  heroBody: { textAlign: 'center', paddingTop: '4px' },
  iconBox: {
    width: '52px', height: '52px', borderRadius: '18px',
    background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px',
  },
  heroTitle: { fontSize: '1.5rem', fontWeight: '900', margin: '0 0 6px', color: 'white' },
  heroSub: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: 0 },
  scrollArea: {
    flex: 1, overflowY: 'auto', padding: '20px 20px 100px',
    scrollbarWidth: 'none',
  },
  successBanner: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#f0fdf4', color: '#16a34a',
    padding: '14px 16px', borderRadius: '16px',
    fontSize: '0.83rem', fontWeight: '700',
    border: '1px solid #bbf7d0', marginBottom: '16px',
  },
  errorBanner: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#fef2f2', color: '#dc2626',
    padding: '14px 16px', borderRadius: '16px',
    fontSize: '0.83rem', fontWeight: '700',
    border: '1px solid #fecaca', marginBottom: '16px',
  },
  card: {
    background: 'white', borderRadius: '24px', padding: '22px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  fieldLabel: {
    fontSize: '0.68rem', fontWeight: '900', color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px',
  },
  inputWrap: { marginBottom: '18px' },
  input: {
    width: '100%', padding: '14px 16px',
    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
    borderRadius: '14px', fontSize: '0.88rem', color: '#1e293b',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  uploadLabel: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '13px', borderRadius: '14px',
    border: '2px dashed #CBD5E1', cursor: 'pointer',
    color: '#64748B', fontSize: '0.85rem', fontWeight: '700',
    marginBottom: '14px', transition: 'all 0.2s', background: '#fafafa',
  },
  removePhotoBtn: {
    position: 'absolute', top: '-7px', right: '-7px',
    width: '22px', height: '22px',
    background: '#E70011', border: 'none', borderRadius: '50%',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 0,
    boxShadow: '0 2px 6px rgba(231,0,17,0.4)',
  },
  submitBtn: {
    width: '100%', padding: '16px 20px', borderRadius: '16px', border: 'none',
    background: '#1e293b', color: 'white', fontWeight: '900',
    fontSize: '0.92rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
    boxShadow: '0 8px 24px rgba(30,41,59,0.25)', transition: 'all 0.2s',
    marginTop: '4px', letterSpacing: '0.2px',
  },
  submitBtnDisabled: {
    background: '#94a3b8', boxShadow: 'none', cursor: 'not-allowed',
  },
  submitIconWrap: {
    width: '28px', height: '28px', borderRadius: '8px',
    background: '#FEF2F2', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  spinner: {
    width: '16px', height: '16px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    animation: 'spin 0.7s linear infinite', flexShrink: 0,
  },
  navBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
    background: 'white', display: 'flex', justifyContent: 'space-around',
    alignItems: 'center', padding: '0 10px 12px',
    borderTop: '1px solid #f1f5f9', zIndex: 100,
    boxShadow: '0 -8px 20px rgba(0,0,0,0.04)',
  },
};

export default Signalement;
