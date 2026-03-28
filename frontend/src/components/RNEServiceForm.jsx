import React from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';

const RNEServiceForm = ({ onBack }) => {
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={onBack} style={{ border: 'none' }}><ArrowLeft /></button>
      <h3>Registre de Commerce</h3>
      <input placeholder="Identifiant Unique (Matricule)" style={{ width: '100%', padding: '12px', marginTop: '20px', borderRadius: '10px', border: '1px solid #ddd' }} />
      <button style={{ width: '100%', padding: '15px', background: '#0056D2', color: 'white', borderRadius: '10px', marginTop: '20px', border: 'none' }}>RECHERCHER</button>
    </div>
  );
};

export default RNEServiceForm;