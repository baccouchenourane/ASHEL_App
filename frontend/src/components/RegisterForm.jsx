import React, { useState } from 'react';
import { ArrowLeft, Briefcase, Building2, User, Phone, Mail, MapPin, FileText, CheckCircle, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { documentAPI } from '../services/api';

const RegisterForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dossierRef, setDossierRef] = useState('');
  const [form, setForm] = useState({
    raisonSociale: '',
    formeJuridique: '',
    activite: '',
    capital: '',
    gerantNom: '',
    gerantPrenom: '',
    cin: '',
    telephone: '',
    email: '',
    adresse: '',
    gouvernorat: '',
  });

  const FORMES = ['SARL', 'SA', 'SUARL', 'SNC', 'Personne Physique'];
  const GOUVERNORATS = ['Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Bizerte', 'Nabeul', 'Sousse', 'Sfax', 'Monastir', 'Mahdia', 'Kairouan', 'Gafsa', 'Gabès', 'Médenine'];

  const handleChange = (field) => (e) => {
    setError('');
    setForm({ ...form, [field]: e.target.value });
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.raisonSociale || !form.formeJuridique || !form.activite) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (!form.gerantNom || !form.gerantPrenom || !form.cin) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (form.cin.length !== 8 || !/^\d+$/.test(form.cin)) {
      setError('Le CIN doit comporter exactement 8 chiffres.');
      return;
    }
    setError('');
    setStep(3);
  };

  // --- SOUMISSION FINALE AVEC APPEL BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.adresse || !form.gouvernorat) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const demande = await documentAPI.soumettreRegistreCommerce(form);
      setDossierRef(demande.reference);
      setStep(4);
    } catch (err) {
      setError('Erreur lors de la soumission : ' + (err.message || 'Veuillez réessayer.'));
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;
  const progressWidth = `${(Math.min(step, totalSteps) / totalSteps) * 100}%`;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={step <= 1 ? onBack : () => { setStep(step - 1); setError(''); }}
          style={styles.backBtn}
          aria-label="Retour"
        >
          <ArrowLeft size={20} color="#1e293b" />
        </button>
        <div style={styles.headerTitle}>
          <Briefcase size={18} color="#0056D2" />
          <span style={styles.titleText}>Registre de Commerce</span>
        </div>
        <div style={styles.stepBadge}>{step <= totalSteps ? `${step}/${totalSteps}` : '✓'}</div>
      </div>

      {/* Progress */}
      {step <= totalSteps && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: progressWidth }} />
        </div>
      )}

      <div style={styles.scrollArea}>
        {/* Error Banner */}
        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* ÉTAPE 1 : INFORMATIONS SOCIÉTÉ */}
        {step === 1 && (
          <div style={styles.card}>
            <div style={styles.stepIconBox}>
              <Building2 size={24} color="#0056D2" />
            </div>
            <h2 style={styles.cardTitle}>Informations Société</h2>
            <p style={styles.cardSub}>Données d'identification de l'entreprise.</p>

            <form onSubmit={handleStep1} style={{ marginTop: '20px' }}>
              <label style={styles.label}>Raison Sociale *</label>
              <div style={styles.inputBox}>
                <Building2 size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="text" placeholder="Ex : TECH SOLUTIONS SARL"
                  value={form.raisonSociale} onChange={handleChange('raisonSociale')} required />
              </div>

              <label style={styles.label}>Forme Juridique *</label>
              <div style={styles.inputBox}>
                <FileText size={16} color="#94a3b8" style={styles.inputIcon} />
                <select style={{ ...styles.input, paddingLeft: '40px' }} value={form.formeJuridique} onChange={handleChange('formeJuridique')} required>
                  <option value="">Sélectionner...</option>
                  {FORMES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <label style={styles.label}>Activité Principale *</label>
              <div style={styles.inputBox}>
                <Briefcase size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="text" placeholder="Ex : Commerce de détail informatique"
                  value={form.activite} onChange={handleChange('activite')} required />
              </div>

              <label style={styles.label}>Capital Social (TND)</label>
              <div style={styles.inputBox}>
                <span style={{ ...styles.inputIcon, fontSize: '13px', fontWeight: '800', color: '#94a3b8' }}>TND</span>
                <input style={{ ...styles.input, paddingLeft: '52px' }} type="number" placeholder="Ex : 1000"
                  value={form.capital} onChange={handleChange('capital')} min="0" />
              </div>

              <button type="submit" style={styles.btnPrimary}>
                Continuer <ChevronRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* ÉTAPE 2 : GÉRANT */}
        {step === 2 && (
          <div style={styles.card}>
            <div style={styles.stepIconBox}>
              <User size={24} color="#0056D2" />
            </div>
            <h2 style={styles.cardTitle}>Gérant / Représentant</h2>
            <p style={styles.cardSub}>Identité du responsable légal.</p>

            <form onSubmit={handleStep2} style={{ marginTop: '20px' }}>
              <label style={styles.label}>Prénom *</label>
              <div style={styles.inputBox}>
                <User size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="text" placeholder="Prénom" value={form.gerantPrenom} onChange={handleChange('gerantPrenom')} required />
              </div>

              <label style={styles.label}>Nom *</label>
              <div style={styles.inputBox}>
                <User size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="text" placeholder="Nom de famille" value={form.gerantNom} onChange={handleChange('gerantNom')} required />
              </div>

              <label style={styles.label}>Numéro CIN *</label>
              <div style={styles.inputBox}>
                <FileText size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="text" placeholder="8 chiffres" maxLength={8} value={form.cin} onChange={handleChange('cin')} required />
              </div>

              <label style={styles.label}>Téléphone</label>
              <div style={styles.inputBox}>
                <Phone size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="tel" placeholder="+216 XX XXX XXX" value={form.telephone} onChange={handleChange('telephone')} />
              </div>

              <label style={styles.label}>Email</label>
              <div style={styles.inputBox}>
                <Mail size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="email" placeholder="exemple@email.com" value={form.email} onChange={handleChange('email')} />
              </div>

              <button type="submit" style={styles.btnPrimary}>
                Continuer <ChevronRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* ÉTAPE 3 : SIÈGE SOCIAL */}
        {step === 3 && (
          <div style={styles.card}>
            <div style={styles.stepIconBox}>
              <MapPin size={24} color="#0056D2" />
            </div>
            <h2 style={styles.cardTitle}>Siège Social</h2>
            <p style={styles.cardSub}>Adresse officielle de l'entreprise.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <label style={styles.label}>Adresse *</label>
              <div style={styles.inputBox}>
                <MapPin size={16} color="#94a3b8" style={styles.inputIcon} />
                <input style={styles.input} type="text" placeholder="Rue, Numéro, Cité..."
                  value={form.adresse} onChange={handleChange('adresse')} required />
              </div>

              <label style={styles.label}>Gouvernorat *</label>
              <div style={styles.inputBox}>
                <MapPin size={16} color="#94a3b8" style={styles.inputIcon} />
                <select style={{ ...styles.input, paddingLeft: '40px' }} value={form.gouvernorat} onChange={handleChange('gouvernorat')} required>
                  <option value="">Sélectionner...</option>
                  {GOUVERNORATS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Récapitulatif */}
              <div style={styles.recapBox}>
                <p style={styles.recapTitle}>Récapitulatif</p>
                <div style={styles.recapRow}><span style={styles.recapKey}>Société</span><span style={styles.recapVal}>{form.raisonSociale}</span></div>
                <div style={styles.recapRow}><span style={styles.recapKey}>Forme</span><span style={styles.recapVal}>{form.formeJuridique}</span></div>
                <div style={styles.recapRow}><span style={styles.recapKey}>Gérant</span><span style={styles.recapVal}>{form.gerantPrenom} {form.gerantNom}</span></div>
                <div style={styles.recapRow}><span style={styles.recapKey}>CIN</span><span style={styles.recapVal}>{form.cin}</span></div>
              </div>

              <button type="submit" style={styles.btnPrimary} disabled={loading}>
                {loading
                  ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  : <>Soumettre la demande <ChevronRight size={16} /></>
                }
              </button>
            </form>
          </div>
        )}

        {/* ÉTAPE 4 : SUCCÈS */}
        {step === 4 && (
          <div style={{ ...styles.card, textAlign: 'center', paddingTop: '40px' }}>
            <div style={styles.successCircle}>
              <CheckCircle size={48} color="#10B981" />
            </div>
            <h2 style={{ ...styles.cardTitle, marginTop: '20px' }}>Demande Soumise !</h2>
            <p style={styles.cardSub}>
              Votre demande d'immatriculation au Registre de Commerce a été transmise au RNE.
              Vous recevrez une confirmation par SMS et email sous 48h ouvrables.
            </p>
            <div style={styles.refBox}>
              <span style={styles.refLabel}>Numéro de dossier</span>
              <span style={styles.refNum}>{dossierRef}</span>
            </div>
            <button onClick={onBack} style={{ ...styles.btnPrimary, marginTop: '24px', background: '#F1F5F9', color: '#1e293b' }}>
              Retour aux services
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select { appearance: none; background-color: #f8fafc; }
      `}</style>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: '"Inter", sans-serif', maxWidth: '450px', margin: '0 auto', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', borderBottom: '1px solid #F1F5F9' },
  backBtn: { width: '38px', height: '38px', borderRadius: '12px', background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  headerTitle: { display: 'flex', alignItems: 'center', gap: '8px' },
  titleText: { fontSize: '0.95rem', fontWeight: '800', color: '#1e293b' },
  stepBadge: { fontSize: '11px', fontWeight: '800', color: '#0056D2', background: '#EFF6FF', padding: '4px 10px', borderRadius: '8px' },
  progressBar: { height: '3px', background: '#E2E8F0' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #0056D2, #38BDF8)', transition: 'width 0.4s ease', borderRadius: '2px' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '20px' },
  errorBanner: { display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', color: '#DC2626', padding: '12px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600', marginBottom: '16px' },
  card: { background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' },
  stepIconBox: { width: '52px', height: '52px', borderRadius: '16px', background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  cardTitle: { margin: '0 0 4px', fontSize: '1.2rem', fontWeight: '900', color: '#111827' },
  cardSub: { margin: '0 0 4px', fontSize: '0.82rem', color: '#64748B', lineHeight: '1.5' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#374151', marginBottom: '6px', marginTop: '14px', letterSpacing: '0.3px' },
  inputBox: { position: 'relative', marginBottom: '4px' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' },
  input: { width: '100%', padding: '13px 14px 13px 40px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', fontSize: '0.88rem', color: '#1e293b', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  btnPrimary: { width: '100%', marginTop: '20px', padding: '15px', background: '#0056D2', color: 'white', border: 'none', borderRadius: '16px', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' },
  recapBox: { background: '#F8FAFC', borderRadius: '16px', padding: '16px', marginTop: '20px', border: '1px solid #E2E8F0' },
  recapTitle: { margin: '0 0 12px', fontSize: '0.72rem', fontWeight: '900', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase' },
  recapRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  recapKey: { fontSize: '0.78rem', color: '#64748B', fontWeight: '600' },
  recapVal: { fontSize: '0.78rem', color: '#111827', fontWeight: '800', maxWidth: '60%', textAlign: 'right' },
  successCircle: { width: '90px', height: '90px', borderRadius: '50%', background: '#ECFDF5', border: '2px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' },
  refBox: { background: '#EFF6FF', borderRadius: '16px', padding: '16px', marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  refLabel: { fontSize: '0.7rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' },
  refNum: { fontSize: '1rem', fontWeight: '900', color: '#0056D2', letterSpacing: '1px' },
};

export default RegisterForm;