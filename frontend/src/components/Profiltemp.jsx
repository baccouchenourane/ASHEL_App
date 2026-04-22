import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, ShieldCheck, LogOut, ChevronRight,
  QrCode, MapPin, Signal, Wifi, Battery, CreditCard,
  Calendar, Edit3, ChevronLeft, Copy, Check, Globe,
  Briefcase, Hash, Lock, Save, X, LayoutGrid,
  FileText, CreditCard as CardIcon, Users
} from 'lucide-react';
import axios from 'axios';

// ── Default profile shape ─────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  nom: 'Utilisateur',
  prenom: '',
  email: '',
  telephone: '',
  cin: '00000000',
  dateNaissance: '',
  adresse: '',
  ville: '',
  codePostal: '',
  profession: '',
  dateInscription: 'récemment',
  genre: '',
};

// ── Completion score (optional fields only) ───────────────────────────────────
const OPTIONAL_FIELDS = ['ville', 'codePostal', 'profession', 'adresse', 'dateNaissance', 'genre'];
function getCompletion(data) {
  const filled = OPTIONAL_FIELDS.filter(f => data[f] && data[f].trim() !== '').length;
  return Math.round((filled / OPTIONAL_FIELDS.length) * 100);
}

// ── Main component ────────────────────────────────────────────────────────────
const Profil = () => {
  const navigate = useNavigate();

  const [userData, setUserData]     = useState(DEFAULT_PROFILE);
  const [editedData, setEditedData] = useState(DEFAULT_PROFILE);
  const [editMode, setEditMode]     = useState(false);
  const [activeTab, setActiveTab]   = useState('info');
  const [saving, setSaving]         = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [copied, setCopied]         = useState(false);

  // ── Load: try API first, fall back to localStorage ─────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('ashel_token');

    if (token) {
      // Fetch live profile from backend
      fetch('http://localhost:8081/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('unauthorized');
          return res.json();
        })
        .then(data => {
          // Map backend UserDTO fields to our profile shape
          const merged = {
            ...DEFAULT_PROFILE,
            nom:             data.nom     || DEFAULT_PROFILE.nom,
            prenom:          data.prenom  || DEFAULT_PROFILE.prenom,
            email:           data.email   || DEFAULT_PROFILE.email,
            telephone:       data.phone   || DEFAULT_PROFILE.telephone,
            cin:             data.cin     || DEFAULT_PROFILE.cin,
            dateInscription: data.dateInscription
              ? new Date(data.dateInscription).toLocaleDateString('fr-TN')
              : DEFAULT_PROFILE.dateInscription,
            role: data.role || 'CITOYEN',
          };
          // Merge with any locally-stored optional fields (ville, codePostal, etc.)
          try {
            const local = JSON.parse(localStorage.getItem('user_ashel') || '{}');
            const final_ = { ...merged, ...local, ...merged }; // backend wins for core fields
            // But optional fields come from local if not in backend response
            ['ville', 'codePostal', 'profession', 'adresse', 'dateNaissance', 'genre'].forEach(f => {
              if (!data[f] && local[f]) final_[f] = local[f];
            });
            setUserData(final_);
            setEditedData(final_);
          } catch {
            setUserData(merged);
            setEditedData(merged);
          }
        })
        .catch(() => {
          // Backend unavailable — fall back to localStorage
          loadFromLocalStorage();
        });
    } else {
      loadFromLocalStorage();
    }
  }, []);

  function loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem('user_ashel');
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...DEFAULT_PROFILE, ...parsed };
        setUserData(merged);
        setEditedData(merged);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
  }

  // ── Derived values ──────────────────────────────────────────────────────────
  const fullName = [editedData.prenom, editedData.nom].filter(Boolean).join(' ') || 'Utilisateur';
  const initials = fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
  const completion = getCompletion(editedData);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCopyId = () => {
    navigator.clipboard.writeText(userData.cin).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditToggle = () => {
    if (editMode) setEditedData(userData); // cancel → revert
    setEditMode(prev => !prev);
    setSaveError('');
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const toSave = { ...editedData };
      localStorage.setItem('user_ashel', JSON.stringify(toSave));

      // Optional backend sync — silently ignored if unavailable
      try {
        await axios.put(`http://localhost:8081/api/users/${toSave.cin}`, {
          nom: `${toSave.prenom} ${toSave.nom}`.trim(),
          email: toSave.email,
          phone: toSave.telephone,
          adresse: toSave.adresse,
          ville: toSave.ville,
          codePostal: toSave.codePostal,
          profession: toSave.profession,
          dateNaissance: toSave.dateNaissance,
          genre: toSave.genre,
        });
      } catch (_) { /* backend optional */ }

      setUserData(toSave);
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_ashel');
    localStorage.removeItem('ashel_token');
    navigate('/');
  };


  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={S.screenWrapper}>
      <div className="app-container">

        {/* ── Status Bar ── */}
        <div style={S.statusBar}>
          <span style={S.statusTime}>09:41</span>
          <div style={S.statusIcons}><Signal size={13} /><Wifi size={13} /><Battery size={15} /></div>
        </div>

        {/* ── Toast banners ── */}
        {saveSuccess && (
          <div style={{ ...S.toast, ...S.toastSuccess }} className="fade-in">
            <Check size={15} /><span>Profil mis à jour avec succès !</span>
          </div>
        )}
        {saveError && (
          <div style={{ ...S.toast, ...S.toastError }} className="fade-in">
            <X size={15} /><span>{saveError}</span>
          </div>
        )}

        {/* ── Scroll area ── */}
        <div style={S.scrollArea}>

          {/* ── Hero header ── */}
          <div style={S.hero}>
            {/* Top row */}
            <div style={S.heroTop}>
              <button onClick={() => navigate('/home')} style={S.iconBtn}>
                <ChevronLeft size={20} color="white" />
              </button>
              <span style={S.heroLabel}>Mon Profil</span>
              {editMode ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleEditToggle} style={S.iconBtn}>
                    <X size={17} color="white" />
                  </button>
                  <button
                    onClick={handleSave}
                    style={{ ...S.iconBtn, background: saving ? 'rgba(255,255,255,0.1)' : 'rgba(74,222,128,0.25)' }}
                    disabled={saving}
                  >
                    {saving ? <div style={S.miniSpinner} /> : <Save size={17} color="white" />}
                  </button>
                </div>
              ) : (
                <button onClick={handleEditToggle} style={S.iconBtn}>
                  <Edit3 size={17} color="white" />
                </button>
              )}
            </div>

            {/* Avatar + name */}
            <div style={{ textAlign: 'center' }}>
              <div style={S.avatar}>
                <span style={S.avatarText}>{initials}</span>
              </div>
              <h3 style={S.heroName}>{fullName}</h3>
              <div style={S.cinRow}>
                <Hash size={11} style={{ opacity: 0.65 }} />
                <span style={{ opacity: 0.7, fontSize: '0.78rem', letterSpacing: '1.5px', fontWeight: '700' }}>
                  {userData.cin}
                </span>
                <button onClick={handleCopyId} style={S.copyBtn}>
                  {copied
                    ? <Check size={11} color="#4ade80" />
                    : <Copy size={11} color="rgba(255,255,255,0.6)" />}
                </button>
              </div>
              <div style={S.verifiedBadge}>
                <ShieldCheck size={13} color="#4ade80" />
                <span>Profil Vérifié</span>
              </div>
            </div>

            {/* Profile completion bar */}
            <div style={S.completionWrap}>
              <div style={S.completionHeader}>
                <span style={S.completionLabel}>Complétude du profil</span>
                <span style={{ ...S.completionLabel, color: completion === 100 ? '#4ade80' : 'rgba(255,255,255,0.9)', fontWeight: '800' }}>
                  {completion}%
                </span>
              </div>
              <div style={S.completionTrack}>
                <div style={{ ...S.completionFill, width: `${completion}%` }} />
              </div>
            </div>

            {/* Stats strip */}
            <div style={S.statsStrip}>
              {[
                { value: '3',    label: 'Documents' },
                { value: '0',    label: 'Amendes' },
                { value: 'Actif', label: 'Statut' },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div style={S.statItem}>
                    <span style={S.statValue}>{s.value}</span>
                    <span style={S.statLabel}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <div style={S.statDivider} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={S.tabRow}>
            {[
              { key: 'info',     label: 'Informations' },
              { key: 'docs',     label: 'Documents' },
              { key: 'securite', label: 'Sécurité' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{ ...S.tabBtn, ...(activeTab === tab.key ? S.tabBtnActive : {}) }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Informations ── */}
          {activeTab === 'info' && (
            <div style={S.tabContent}>

              <Section title="Identité">
                <Row icon={<User size={16} color="#0056D2" />}     label="Prénom"           field="prenom"        data={editedData} editMode={editMode} onChange={handleChange} />
                <Row icon={<User size={16} color="#0056D2" />}     label="Nom"              field="nom"           data={editedData} editMode={editMode} onChange={handleChange} />
                <Row icon={<User size={16} color="#0056D2" />}     label="Genre"            field="genre"         data={editedData} editMode={editMode} onChange={handleChange} type="select" options={['', 'Homme', 'Femme', 'Autre']} />
                <Row icon={<Calendar size={16} color="#0056D2" />} label="Date de naissance" field="dateNaissance" data={editedData} editMode={editMode} onChange={handleChange} type="date" />
                <StaticRow icon={<CreditCard size={16} color="#0056D2" />} label="Numéro CIN" value={userData.cin} last />
              </Section>

              <Section title="Coordonnées">
                <Row icon={<Mail size={16} color="#7C3AED" />}  label="Email"       field="email"     data={editedData} editMode={editMode} onChange={handleChange} type="email" />
                <Row icon={<Phone size={16} color="#7C3AED" />} label="Téléphone"   field="telephone" data={editedData} editMode={editMode} onChange={handleChange} type="tel" />
                <Row icon={<MapPin size={16} color="#7C3AED" />} label="Adresse"    field="adresse"   data={editedData} editMode={editMode} onChange={handleChange} />
                <Row icon={<MapPin size={16} color="#7C3AED" />} label="Ville"      field="ville"     data={editedData} editMode={editMode} onChange={handleChange} optional />
                <Row icon={<Hash size={16} color="#7C3AED" />}  label="Code postal" field="codePostal" data={editedData} editMode={editMode} onChange={handleChange} optional last />
              </Section>

              <Section title="Professionnel">
                <Row icon={<Briefcase size={16} color="#10B981" />} label="Profession" field="profession" data={editedData} editMode={editMode} onChange={handleChange} optional last />
              </Section>

              <Section title="Compte">
                <StaticRow icon={<Calendar size={16} color="#F59E0B" />} label="Membre depuis" value={userData.dateInscription} last />
              </Section>

            </div>
          )}

          {/* ── Tab: Documents ── */}
          {activeTab === 'docs' && (
            <div style={S.tabContent}>
              <Section title="Documents administratifs">
                <DocRow icon={<CreditCard size={16} color="#0056D2" />} label="Carte d'identité nationale" status="Vérifiée"   statusColor="#10B981" bg="#f0fdf4" />
                <DocRow icon={<Globe size={16} color="#7C3AED" />}      label="Passeport"                  status="Non fourni" statusColor="#94a3b8" bg="#f8fafc" />
                <DocRow icon={<Briefcase size={16} color="#F59E0B" />}  label="Permis de conduire"         status="Non fourni" statusColor="#94a3b8" bg="#f8fafc" last />
              </Section>
              <Section title="Historique des demandes">
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.83rem', fontWeight: '600' }}>Aucune demande enregistrée</p>
                </div>
              </Section>
            </div>
          )}

          {/* ── Tab: Sécurité ── */}
          {activeTab === 'securite' && (
            <div style={S.tabContent}>
              <Section title="Carte d'identité numérique">
                <div style={S.idCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: '1px' }}>RÉPUBLIQUE TUNISIENNE</p>
                      <h3 style={{ margin: '4px 0 0', color: 'white', fontSize: '1rem', fontWeight: '900' }}>{fullName}</h3>
                    </div>
                    <QrCode size={46} color="white" style={{ opacity: 0.85 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)' }}>N° CIN</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.92rem', color: 'white', fontWeight: '800', letterSpacing: '1px' }}>{userData.cin}</p>
                    </div>
                    {editedData.dateNaissance && (
                      <div>
                        <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)' }}>Né(e) le</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.92rem', color: 'white', fontWeight: '800' }}>{editedData.dateNaissance}</p>
                      </div>
                    )}
                    {editedData.ville && (
                      <div>
                        <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)' }}>Ville</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.92rem', color: 'white', fontWeight: '800' }}>{editedData.ville}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Section>

              <Section title="Sécurité et confidentialité">
                <div style={S.securityRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '34px', height: '34px', background: '#fef2f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={16} color="#EF4444" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Changer mot de passe</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>Modifié il y a 3 mois</p>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#cbd5e1" />
                </div>
              </Section>

              <Section title="Sessions">
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '0.82rem', color: '#1e293b' }}>Session actuelle</p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8' }}>Aujourd'hui • Tunis, TN</p>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* ── Logout ── */}
          <div style={{ padding: '4px 20px 24px' }}>
            <button onClick={handleLogout} style={S.logoutBtn}>
              <LogOut size={17} />
              <span>Déconnexion</span>
            </button>
          </div>

        </div>{/* end scrollArea */}

        {/* ── Bottom nav ── */}
        <nav style={S.navBar}>
          <NavItem icon={<LayoutGrid size={22} />} label="Accueil"       onClick={() => navigate('/home')} />
          <NavItem icon={<FileText size={22} />}   label="E-Admin"       onClick={() => navigate('/e-admin')} />
          <NavItem icon={<CardIcon size={22} />}   label="Paiements"     onClick={() => navigate('/paiement')} />
          <NavItem icon={<Users size={22} />}      label="Participation" onClick={() => navigate('/participation')} />
          <NavItem icon={<User size={22} />}       label="Profil"        active />
        </nav>

      </div>{/* end app-container */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .app-container {
          width: 390px; height: 844px; background: #f8fafc;
          position: relative; overflow: hidden; border-radius: 50px;
          border: 4px solid #334155;
          box-shadow: 0 0 0 12px #1e293b, 0 30px 70px rgba(0,0,0,0.25);
          display: flex; flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .app-container *, .app-container input, .app-container select, .app-container button {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          box-sizing: border-box;
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #0056D2 !important; background: white !important; }
        input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
};


// ── Sub-components ────────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
      {title}
    </p>
    <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      {children}
    </div>
  </div>
);

// Read-only row
const StaticRow = ({ icon, label, value, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderBottom: last ? 'none' : '1px solid #f1f5f9' }}>
    <div style={{ width: '32px', height: '32px', background: '#f8fafc', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#1e293b', fontWeight: '700' }}>{value || '—'}</p>
    </div>
  </div>
);

// Editable row
const Row = ({ icon, label, field, data, editMode, onChange, last, type = 'text', options = [], optional = false }) => {
  const value = data[field] || '';
  const isEmpty = !value;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderBottom: last ? 'none' : '1px solid #f1f5f9' }}>
      <div style={{ width: '32px', height: '32px', background: '#f8fafc', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
          {optional && (
            <span style={{ fontSize: '0.55rem', fontWeight: '800', color: '#cbd5e1', background: '#f8fafc', padding: '1px 5px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              OPTIONNEL
            </span>
          )}
        </div>
        {editMode ? (
          type === 'select' ? (
            <select
              value={value}
              onChange={e => onChange(field, e.target.value)}
              style={inputStyle}
            >
              {options.map(opt => (
                <option key={opt} value={opt}>{opt || 'Non spécifié'}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={e => onChange(field, e.target.value)}
              placeholder={optional ? `Ajouter ${label.toLowerCase()}...` : ''}
              style={inputStyle}
            />
          )
        ) : (
          <p style={{ margin: 0, fontSize: '0.875rem', color: isEmpty ? '#cbd5e1' : '#1e293b', fontWeight: isEmpty ? '500' : '700', fontStyle: isEmpty ? 'italic' : 'normal' }}>
            {value || (optional ? 'Non renseigné' : '—')}
          </p>
        )}
      </div>
    </div>
  );
};

const DocRow = ({ icon, label, status, statusColor, bg, last }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderBottom: last ? 'none' : '1px solid #f1f5f9', cursor: 'pointer' }}>
    <div style={{ width: '32px', height: '32px', background: bg, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', fontWeight: '700' }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: statusColor, fontWeight: '800' }}>{status}</p>
    </div>
    <ChevronRight size={15} color="#cbd5e1" />
  </div>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}>
    <div style={{ color: active ? '#0056D2' : '#94a3b8' }}>{icon}</div>
    <span style={{ fontSize: '0.58rem', fontWeight: '700', color: active ? '#0056D2' : '#94a3b8' }}>{label}</span>
  </div>
);

// ── Shared input style ────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '8px 12px',
  background: '#f8fafc', border: '1.5px solid #e2e8f0',
  borderRadius: '10px', fontSize: '0.875rem',
  color: '#1e293b', fontWeight: '600',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s, background 0.2s',
};

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  screenWrapper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#e2e8f0',
  },
  statusBar: {
    height: '44px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0 28px',
    background: 'linear-gradient(135deg, #0056D2 0%, #003FA3 100%)',
    color: 'white', flexShrink: 0, zIndex: 10,
  },
  statusTime: { fontWeight: '700', fontSize: '13px' },
  statusIcons: { display: 'flex', gap: '5px', alignItems: 'center' },
  toast: {
    position: 'absolute', top: '52px', left: '16px', right: '16px',
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '12px 16px', borderRadius: '14px',
    fontSize: '0.82rem', fontWeight: '700', zIndex: 200,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  toastSuccess: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  toastError:   { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  scrollArea: {
    flex: 1, overflowY: 'auto', paddingBottom: '90px', scrollbarWidth: 'none',
  },
  hero: {
    background: 'linear-gradient(160deg, #1e293b 0%, #0056D2 100%)',
    padding: '16px 20px 0', color: 'white',
    borderBottomLeftRadius: '36px', borderBottomRightRadius: '36px',
    marginBottom: '4px',
  },
  heroTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '18px',
  },
  heroLabel: { color: 'white', fontWeight: '800', fontSize: '0.95rem' },
  iconBtn: {
    width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)',
    border: 'none', borderRadius: '11px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  miniSpinner: {
    width: '15px', height: '15px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
    animation: 'spin 0.6s linear infinite',
  },
  avatar: {
    width: '78px', height: '78px', borderRadius: '24px',
    background: 'white', margin: '0 auto 12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  },
  avatarText: { fontSize: '1.7rem', fontWeight: '900', color: '#0056D2' },
  heroName: { margin: '0 0 6px', fontSize: '1.25rem', fontWeight: '900', textAlign: 'center', color: 'white' },
  cinRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px' },
  copyBtn: {
    background: 'rgba(255,255,255,0.12)', border: 'none',
    borderRadius: '6px', padding: '3px 6px', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
  },
  verifiedBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: 'rgba(255,255,255,0.1)', padding: '5px 12px',
    borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700',
    margin: '0 auto 16px', width: 'fit-content',
  },
  completionWrap: {
    background: 'rgba(255,255,255,0.1)', borderRadius: '14px',
    padding: '12px 14px', margin: '0 0 14px',
  },
  completionHeader: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '8px',
  },
  completionLabel: {
    fontSize: '0.68rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)',
  },
  completionTrack: {
    height: '5px', background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px', overflow: 'hidden',
  },
  completionFill: {
    height: '100%', borderRadius: '10px',
    background: 'linear-gradient(90deg, #4ade80, #22c55e)',
    transition: 'width 0.5s ease',
  },
  statsStrip: {
    display: 'flex', justifyContent: 'space-around',
    background: 'rgba(255,255,255,0.08)', borderRadius: '16px',
    padding: '12px 10px', margin: '0 0 20px',
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  statValue: { fontSize: '0.95rem', fontWeight: '900', color: 'white' },
  statLabel: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', fontWeight: '700' },
  statDivider: { width: '1px', background: 'rgba(255,255,255,0.15)' },
  tabRow: { display: 'flex', padding: '14px 20px 8px', gap: '8px' },
  tabBtn: {
    flex: 1, padding: '9px 0', borderRadius: '11px',
    border: '1.5px solid #e2e8f0', background: 'white',
    fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  tabBtnActive: { background: '#0056D2', color: 'white', border: '1.5px solid #0056D2' },
  tabContent: { padding: '0 20px' },
  idCard: {
    background: 'linear-gradient(135deg, #0056D2, #003FA3)',
    borderRadius: '20px', padding: '20px', margin: '4px 4px 16px',
    boxShadow: '0 8px 24px rgba(0,86,210,0.3)',
  },
  securityRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', cursor: 'pointer',
  },
  logoutBtn: {
    width: '100%', padding: '15px', borderRadius: '16px', border: 'none',
    background: '#fef2f2', color: '#EF4444', fontWeight: '800',
    fontSize: '0.88rem', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '10px', cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  navBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '82px',
    background: 'white', display: 'flex', justifyContent: 'space-around',
    alignItems: 'center', padding: '0 10px 14px',
    borderTop: '1px solid #f1f5f9', zIndex: 100,
    boxShadow: '0 -8px 20px rgba(0,0,0,0.04)',
  },
};

export default Profil;
