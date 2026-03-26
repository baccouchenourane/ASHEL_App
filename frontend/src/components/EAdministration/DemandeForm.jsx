import React, { useState } from "react";
import { Send } from "lucide-react";

const DemandeForm = ({ addDemande }) => {
  const [type, setType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type) {
      addDemande(type);
      setType("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ashal-card" style={{ padding: '20px' }}>
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)}
        className="ashal-input"
        style={{ marginBottom: '15px', paddingLeft: '20px' }} // On simplifie le padding pour le select
        required
      >
        <option value="">Choisir un document...</option>
        <option>Extrait de naissance</option>
        <option>Certificat de résidence</option>
        <option>Bulletin n°3</option>
        <option>Copie certifiée conforme</option>
      </select>
      
      <button type="submit" className="btn-ashal-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <Send size={18} /> Confirmer la demande
      </button>
    </form>
  );
};

export default DemandeForm;