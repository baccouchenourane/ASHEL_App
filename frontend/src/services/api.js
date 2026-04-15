// src/services/api.js
// Couche d'accès à l'API backend ASHEL

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, password }),
  }).then(async (res) => {
    const data = await res.json();
    if (res.ok && data.token) {
      // Stocker l'utilisateur avec le token sous la clé 'user_ashel'
      const userData = { cin, token: data.token, ...data.user };
      localStorage.setItem('user_ashel', JSON.stringify(userData));
    }
    if (!res.ok) throw new Error(data.error || data.message || 'Erreur serveur');
    return data;
  });

export const authAPI = {
  loginRequest,
  
  verifyOtp: (cin, code) =>
    fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin, code }),
    }).then(handleResponse),

  register: (cin, nom, password, phone) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin, nom, password, phone }),
    }).then(handleResponse),

  resendOtp: (cin) =>
    fetch(`${BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin }),
    }).then(handleResponse),
};

// ─── EXPORTS POUR HOME.JSX ─────────────────────────────────────────────────
export const homeAPI = {
  getDashboard: () =>
    fetch(`${BASE_URL}/home/dashboard?cin=${getCin()}`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  logout: () => {
    const cin = getCin();
    return fetch(`${BASE_URL}/home/logout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ cin }),
    }).then(handleResponse);
  },

  marquerNotifLue: (id) =>
    fetch(`${BASE_URL}/home/notifications/lu/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then(handleResponse),
};

// ─── EXPORTS POUR PAIEMENT ────────────────────────────────────────────────
export const paiementAPI = {
  getFactures: () =>
    fetch(`${BASE_URL}/paiement/factures?cin=${getCin()}`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  getFactureByType: (type) =>
    fetch(`${BASE_URL}/paiement/facture?cin=${getCin()}&type=${type}`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

initierPaiement: (referenceFacture, methodePaiement, montant) =>
  fetch(`${BASE_URL}/paiement/initier`, {
    method: 'POST',
    headers: getHeaders(), // <--- TRÈS IMPORTANT
    body: JSON.stringify({ 
      cin: getCin(), 
      referenceFacture, 
      methodePaiement,
      montant 
    }),
  }).then(handleResponse),

  confirmerPaiement: (numeroTransaction) =>
    fetch(`${BASE_URL}/paiement/confirmer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ numeroTransaction }),
    }).then(handleResponse),

  getHistorique: () =>
    fetch(`${BASE_URL}/paiement/historique?cin=${getCin()}`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  getRecu: (numeroTransaction) =>
    fetch(`${BASE_URL}/paiement/recu?numeroTransaction=${numeroTransaction}`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),
};

// ─── E-ADMINISTRATION — DOCUMENTS ──────────────────────────────────────────
export const documentsAPI = {
  /**
   * Créer une demande de document après paiement.
   */
  creerDemandeDocument: ({
    cinDemandeur,
    nomTitulaire,
    typeDocument,
    modePaiement,
    dernierChiffres = "",
  }) => {
    // Utilise le cin passé en paramètre ou celui du localStorage par défaut
    const finalCin = cinDemandeur || getCin();
    return fetch(`${BASE_URL}/documents/demande`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        cinDemandeur: finalCin,
        nomTitulaire,
        typeDocument,
        modePaiement,
        dernierChiffresCartee: dernierChiffres,
      }),
    }).then(handleResponse);
  },

  // Alias pour la compatibilité avec le premier code
  creerDemande: (args) => documentsAPI.creerDemandeDocument(args),

  /**
   * Soumettre une demande Registre de Commerce (RegisterForm).
   */
  soumettreRegistreCommerce: (cinDemandeur, formData) => {
    // Gestion flexible si cinDemandeur est omis (cas du premier code)
    let finalCin = cinDemandeur;
    let data = formData;

    if (typeof cinDemandeur === 'object') {
       finalCin = getCin();
       data = cinDemandeur;
    }

    const nomTitulaire = `${data.gerantPrenom} ${data.gerantNom}`;
    return fetch(`${BASE_URL}/documents/registre-commerce`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        cinDemandeur: finalCin,
        nomTitulaire,
        typeDocument: "REGISTRE_COMMERCE",
        donneesSupplementaires: JSON.stringify(data),
      }),
    }).then(handleResponse);
  },

  /**
   * Récupérer tous les documents du coffre-fort d'un citoyen.
   */
  getCoffreFort: (cin) => {
    const finalCin = cin || getCin();
    return fetch(`${BASE_URL}/documents/coffre-fort/${finalCin}`, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse);
  },

  /**
   * Consulter le statut d'un dossier par sa référence.
   */
  getStatutDemande: (reference) =>
    fetch(`${BASE_URL}/documents/statut/${reference}`, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse),

  // Alias pour la compatibilité avec le premier code
  getStatut: (reference) => documentsAPI.getStatutDemande(reference),

  /**
   * Récupérer les types de documents disponibles et leurs tarifs.
   */
  getTypesTarifs: () =>
    fetch(`${BASE_URL}/documents/types`, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse),
};

// Export supplémentaire pour matcher exactement le premier code si nécessaire
export const documentAPI = documentsAPI;
