import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, FileText, CreditCard, Users, LayoutGrid, 
  User, CreditCard as PassportIcon, Car, 
  ChevronRight, Search, QrCode 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif' }}>
      
      {/* 1. Header avec Fond Technologique/Circuit */}
      <div style={{ 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Vert comme l'image
        height: '240px', padding: '40px 25px', color: 'white',
        borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Motif discret (Optionnel: simuler le moucharabieh ou circuit) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, pointerEvents: 'none' }}>
           <LayoutGrid size={300} style={{ position: 'absolute', right: -50, top: -50 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={28} />
             </div>
             <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Mohamed Ali</h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>ID No.: 098****43</p>
             </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Search size={22} />
            <Bell size={22} />
          </div>
        </div>

        {/* 2. Carte CIN Flottante (Style Image) */}
        <div style={{ 
          background: 'white', borderRadius: '25px', padding: '20px', marginTop: '30px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)', color: '#1e293b',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ color: '#10b981' }}><QrCode size={35} /></div>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, fontWeight: '700' }}>VOTRE IDENTITÉ DIGITALE</p>
              <p style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>ACTIF / VÉRIFIÉ</p>
            </div>
          </div>
          <ChevronRight color="#cbd5e1" />
        </div>
      </div>

      {/* 3. Section: Documents (Horizontal Scroll) */}
      <div style={{ padding: '30px 20px 0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b' }}>Mes Documents</h4>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>Voir tout</span>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <DocumentCard icon={<CreditCard size={22}/>} title="CIN" color="#ecfdf5" textColor="#059669" />
          <DocumentCard icon={<PassportIcon size={22}/>} title="Passeport" color="#eef2ff" textColor="#4f46e5" />
          <DocumentCard icon={<Car size={22}/>} title="Permis" color="#fff7ed" textColor="#d97706" />
        </div>
      </div>

      {/* 4. Section: Notifications (Service Alerts) */}
      <div style={{ padding: '20px' }}>
        <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b', marginBottom: '15px' }}>Notifications de services</h4>
        <div style={{ background: 'white', borderRadius: '25px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          {/* Alerte Amende qui redirige vers E-Amende */}
          <div 
            onClick={() => navigate('/e-amende')} 
            style={{ display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' }}
          >
            <div style={{ padding: '12px', background: '#fff1f2', borderRadius: '15px' }}>
              <CreditCard size={20} color="#e11d48" />
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800' }}>E-Amende</h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#ef4444' }}>Vous avez 1 amende en attente (60 DT)</p>
            </div>
            <ChevronRight size={18} color="#cbd5e1" />
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '15px 0' }} />
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '15px' }}>
              <FileText size={20} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800' }}>E-Administration</h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Extrait de naissance disponible.</p>
            </div>
            <ChevronRight size={18} color="#cbd5e1" />
          </div>
        </div>
      </div>

      {/* 5. Navigation Tab Bar (Fixe en bas) */}
      <nav style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '85px',
        background: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 10px 15px 10px', borderTop: '1px solid #f1f5f9', zIndex: 100,
        boxShadow: '0 -10px 25px rgba(0,0,0,0.03)'
      }}>
        <NavItem icon={<LayoutGrid size={24} />} label="Accueil" active />
        <NavItem icon={<FileText size={24} />} label="E-Admin" onClick={() => navigate('/e-administration')} />
        <NavItem icon={<CreditCard size={24} />} label="Amendes" onClick={() => navigate('/e-amende')} />
        <NavItem icon={<Users size={24} />} label="Participation" onClick={() => navigate('/e-participation')} />
        <NavItem icon={<User size={24} />} label="Profil" onClick={() => navigate('/profil')} />
      </nav>
    </div>
  );
};

// --- Sous-composants pour la lisibilité ---

const DocumentCard = ({ icon, title, color, textColor }) => (
  <div style={{ 
    minWidth: '130px', background: color, padding: '20px', borderRadius: '25px',
    display: 'flex', flexDirection: 'column', gap: '15px', border: `1px solid ${color}`
  }}>
    <div style={{ color: textColor }}>{icon}</div>
    <span style={{ fontWeight: '800', color: textColor, fontSize: '0.9rem' }}>{title}</span>
  </div>
);

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', flex: 1 }}
  >
    <div style={{ color: active ? '#059669' : '#94a3b8', transition: '0.3s' }}>{icon}</div>
    <span style={{ fontSize: '0.6rem', fontWeight: '700', color: active ? '#059669' : '#94a3b8' }}>
      {label}
    </span>
  </div>
);

export default Home;