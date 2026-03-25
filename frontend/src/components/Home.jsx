import React from 'react';
import { 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Bell, 
  Settings, 
  ChevronRight,
  UserCheck,
  QrCode
} from 'lucide-react';

const Home = () => {
  // Données fictives pour l'utilisateur
  const user = {
    name: "Mohamed Ben Ali",
    id: "09876543",
    photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop"
  };

  return (
    <div className="profile-page-container">
      {/* --- HEADER --- */}
      <header className="profile-header">
        <div className="header-top">
          <Settings className="icon-btn" />
          <div className="notification-badge">
            <Bell className="icon-btn" />
            <span className="dot"></span>
          </div>
        </div>
        
        <div className="user-info-section">
          <div className="avatar-wrapper">
            <img src={user.photo} alt="Profile" className="profile-avatar" />
            <div className="verified-badge"><UserCheck size={14} /></div>
          </div>
          <h1 className="user-name">{user.name}</h1>
          <p className="user-id">CIN: {user.id}</p>
        </div>
      </header>

      {/* --- SECTION 1 : MES DOCUMENTS (Inspiré de l'image) --- */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Mes Documents Digitaux</h2>
          <span className="see-all">Voir tout</span>
        </div>
        <div className="horizontal-scroll">
          <div className="doc-card cin-card">
            <div className="card-logo">ASHEL</div>
            <p className="card-label">Citizen ID</p>
            <QrCode className="card-qr" size={32} />
          </div>
          <div className="doc-card passport-card">
            <div className="card-logo">ASHEL</div>
            <p className="card-label">Passeport</p>
          </div>
          <div className="doc-card driving-card">
            <div className="card-logo">ASHEL</div>
            <p className="card-label">Permis</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 2 : MES SERVICES (e-Amende, e-Service, e-Participation) --- */}
      <section className="services-grid-section">
        <h2>Services ASHEL</h2>
        <div className="services-list">
          
          {/* e-Amende */}
          <div className="service-item">
            <div className="service-icon amende-bg"><CreditCard color="white" /></div>
            <div className="service-content">
              <h3>e-Amende</h3>
              <p>Paiement et notifications d'amendes</p>
            </div>
            <ChevronRight className="arrow" />
          </div>

          {/* e-Service */}
          <div className="service-item">
            <div className="service-icon service-bg"><FileText color="white" /></div>
            <div className="service-content">
              <h3>e-Service</h3>
              <p>CIN, Passeport, Extrait de naissance...</p>
            </div>
            <ChevronRight className="arrow" />
          </div>

          {/* e-Participation */}
          <div className="service-item">
            <div className="service-icon participation-bg"><MessageSquare color="white" /></div>
            <div className="service-content">
              <h3>e-Participation</h3>
              <p>Réclamations et contact gouvernement</p>
            </div>
            <ChevronRight className="arrow" />
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;