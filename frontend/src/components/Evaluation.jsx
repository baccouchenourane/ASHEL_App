import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, Send, ChevronLeft, Signal, Wifi, Battery,
  CheckCircle, AlertCircle, LayoutGrid, FileText, CreditCard, Users, User
} from 'lucide-react';
import logoAshel from '../assets/logo_ashel.png';

const SERVICES = ['Mairie', 'Hôpital', 'Transport en commun', 'École publique', 'Poste'];

const STAR_LABELS = ['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'];

const Evaluation = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ note: 0, commentaire: '', servicePublic: '' });
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
      const user = JSON.parse(localStorage.getItem('user_ashel') || '{}');
      const citoyenId = user.cin || 1;
      const response = await fetch('http://localhost:8081/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, citoyenId }),
      });
      if (!response.ok) throw new Error('Erreur serveur');
      setSuccess(true);
      setForm({ note: 0, commentaire: '', servicePublic: '' });
    } catch {
      setError("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const activeRating = hovered || form.note;

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
              <Star size={22} color="white" />
            </div>
            <h2 style={S.heroTitle}>Évaluation</h2>
            <p style={S.heroSub}>Notez la qualité d'un service public</p>
          </div>
        </div>

        {/* ── Scroll Area ── */}
        <div style={S.scrollArea}>

          {success && (
            <div style={S.successBanner} className="fade-in">
              <CheckCircle size={16} />
              <span>Merci pour votre évaluation !</span>
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

              <p style={S.fieldLabel}>SERVICE PUBLIC</p>
              <div style={S.inputWrap}>
                <select
                  value={form.servicePublic}
                  onChange={(e) => setForm({ ...form, servicePublic: e.target.value })}
                  required
                  style={{ ...S.input, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Sélectionner un service...</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Star rating */}
              <p style={S.fieldLabel}>VOTRE NOTE</p>
              <div style={S.starsSection}>
                <div style={S.starsRow}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, note: star })}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      style={S.starBtn}
                      aria-label={`Note ${star}`}
                    >
                      <Star
                        size={32}
                        fill={star <= activeRating ? '#E70011' : 'none'}
                        color={star <= activeRating ? '#E70011' : '#CBD5E1'}
                        style={{ transition: 'all 0.15s' }}
                      />
                    </button>
                  ))}
                </div>
                {activeRating > 0 && (
                  <p style={S.starLabel}>{STAR_LABELS[activeRating]}</p>
                )}
              </div>

              <p style={S.fieldLabel}>COMMENTAIRE (optionnel)</p>
              <div style={S.inputWrap}>
                <textarea
                  placeholder="Partagez votre expérience..."
                  value={form.commentaire}
                  onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
                  rows={3}
                  style={{ ...S.input, resize: 'none', paddingTop: '14px' }}
                />
              </div>

              <button type="submit" disabled={loading} style={loading ? { ...S.submitBtn, ...S.submitBtnDisabled } : S.submitBtn}>
                {loading ? (
                  <>
                    <div style={S.spinner} />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <div style={S.submitIconWrap}>
                      <Send size={15} color="#F59E0B" />
                    </div>
                    Envoyer mon avis
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
        input:focus, textarea:focus, select:focus { border-color: #F59E0B !important; outline: none; background: white !important; }
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
  starsSection: { marginBottom: '20px' },
  starsRow: { display: 'flex', gap: '6px', marginBottom: '8px' },
  starBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px', borderRadius: '8px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  starLabel: {
    fontSize: '0.78rem', fontWeight: '800', color: '#E70011',
    margin: 0,
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
    background: '#FFFBEB', display: 'flex',
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

export default Evaluation;
