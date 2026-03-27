import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';

const EAdministration = () => {
  const [activeTab, setActiveTab] = useState('demande');
  const [selectedService, setSelectedService] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedService || !file) {
      alert("Veuillez choisir un service et un fichier !");
      return;
    }
    alert(`Demande pour "${selectedService}" envoyée avec le fichier "${file.name}"`);
    setFile(null);
    setSelectedService('');
  };

  const dummyRequests = [
    { id: 1, service: "Extrait de naissance", date: "2026-03-20", status: "validée" },
    { id: 2, service: "CIN", date: "2026-03-22", status: "en-attente" }
  ];

  return (


    <div className="admin-module-container">
      <h2>E-Administration</h2>
      
      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'demande' ? 'active' : ''}`} 
          onClick={() => setActiveTab('demande')}
        >
          Soumettre une demande
        </button>
        <button 
          className={`tab-btn ${activeTab === 'historique' ? 'active' : ''}`} 
          onClick={() => setActiveTab('historique')}
        >
          Historique
        </button>
      </div>

      {/* Contenu demande */}
      {activeTab === 'demande' && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Choisir un service</label>
            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
              <option value="">-- Sélectionnez --</option>
              <option value="CIN">CIN</option>
              <option value="Passeport">Passeport</option>
              <option value="Extrait de naissance">Extrait de naissance</option>
              <option value="Permis">Permis de conduire</option>
            </select>
          </div>

          <div className="form-group">
            <label>Uploader le document</label>
            <div className="file-upload-zone">
              {file ? <p>Fichier sélectionné: {file.name}</p> : <p>Glissez-déposez ou cliquez pour choisir un fichier</p>}
              <input type="file" onChange={handleFileChange} />
            </div>
          </div>

          <div className="info-box">
            Assurez-vous que le fichier est au format PDF ou image et que sa taille est inférieure à 5MB.
          </div>

          <button type="submit" className="btn-primary-ashel">
            <FileText size={18} style={{marginRight: '8px'}} /> Envoyer la demande
          </button>
        </form>
      )}

      {/* Contenu historique */}
      {activeTab === 'historique' && (
        <div>
          {dummyRequests.map(req => (
            <div key={req.id} className="request-card">
              <div className="request-info">
                <div>
                  <p><strong>Service :</strong> {req.service}</p>
                  <p><strong>Date :</strong> {req.date}</p>
                </div>
                <div className={`status-badge ${req.status === "validée" ? "validée" : "en-attente"}`}>
                  {req.status}
                </div>
              </div>
              {req.status === "validée" && (
                <button className="btn-download">
                  <Download size={18} /> Télécharger
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

    
  );
};

export default EAdministration;