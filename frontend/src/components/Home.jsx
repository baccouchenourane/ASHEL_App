import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CreditCard, Activity, Bell, Home as HomeIcon, User, Search, QrCode } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="moucharabieh-overlay"></div>
      
      <div style={{ padding: '40px 25px', flex: 1, zIndex: 2 }}>
        
        {/* Header avec Avatar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '18px', background: 'var(--ashal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
              M
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2px' }}>Aslema,</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Mohamed Ali</h3>
            </div>
          </div>
          <div style={{ position: 'relative', padding: '10px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
            <Bell size={22} color="#1e293b" />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: 'var(--ashal-red)', borderRadius: '50%', border: '2px solid white' }}></div>
          </div>
        </div>

        {/* Carte CIN Digitale (Look Futuriste) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '30px', borderRadius: '30px', color: 'white', marginBottom: '35px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 'bold', opacity: 0.6 }}>CARTE D'IDENTITÉ DIGITALE</span>
            <QrCode size={24} color="var(--ashal-gold)" />
          </div>
          <p style={{ fontSize: '1.3rem', fontWeight: '700', letterSpacing: '1px', marginBottom: '5px' }}>MOHAMED BEN ALI</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>ID: 098****43 | Nationalité: TN</p>
        </div>

        {/* Grid de Services Innovant */}
        <h4 style={{ fontWeight: '800', marginBottom: '20px', fontSize: '1rem' }}>Services ASHAL</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div onClick={() => navigate('/e-administration')} style={{ background: 'white', padding: '25px', borderRadius: '25px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 15px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#eff6ff', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <FileText color="var(--ashal-blue)" size={24} />
            </div>
            <p style={{ fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.5px' }}>ADMINISTRATION</p>
          </div>
          <div style={{ background: 'white', padding: '25px', borderRadius: '25px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 15px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#fff1f2', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <CreditCard color="var(--ashal-red)" size={24} />
            </div>
            <p style={{ fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.5px' }}>AMENDES</p>
          </div>
        </div>
      </div>

      {/* Navigation Basse "Dock Style" */}
      <nav style={{ 
        position: 'absolute', bottom: '25px', left: '25px', right: '25px',
        background: 'white', borderRadius: '25px', padding: '15px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 10
      }}>
        <HomeIcon size={24} color="var(--ashal-red)" />
        <Search size={24} color="#cbd5e1" />
        <User size={24} color="#cbd5e1" />
      </nav>
    </div>
  );
};

export default Home;