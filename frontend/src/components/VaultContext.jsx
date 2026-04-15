import React, { createContext, useContext, useState } from 'react';

const VaultContext = createContext();

export const useVault = () => useContext(VaultContext);

export const VaultProvider = ({ children }) => {
  const [docs, setDocs] = useState([]);

  const addDoc = (newDoc) => {
    setDocs((prev) => [
      {
        ...newDoc,
        id: newDoc.id || Date.now(),
        dateMAJ: new Date().toISOString(),
        statut: 'PAIEMENT_RECU',
      },
      ...prev,
    ]);
  };

  return (
    <VaultContext.Provider value={{ docs, addDoc }}>
      {children}
    </VaultContext.Provider>
  );
};