// src/services/api.js
// Couche d'accès à l'API backend ASHEL

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// ─── HELPERS ───────────────────────────────────────────────────────────────
export const getCin = () => {
  const user = JSON.parse(localStorage.getItem('user_ashel'));
  return user?.cin || '';
};

export const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user_ashel'));
  return user?.token || '';
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Erreur serveur');
  return data;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ─── AUTHENTIFICATION ──────────────────────────────────────────────────────
export const loginRequest = (cin, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, password }),
  }).then(async (res) => {
    const data = await res.json();
    if (res.ok && data.token) {
      const userData = { cin, token: data.token, ...data.user };
      localStorage.setItem('user_ashel', JSON.stringify(userData));
      // Persist role separately for quick access across components
      if (data.user?.role) {
        localStorage.setItem('user_role', data.user.role);
      }
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

// ─── HOME ──────────────────────────────────────────────────────────────────
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

// ─── PAIEMENT ──────────────────────────────────────────────────────────────
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
      headers: getHeaders(),
      body: JSON.stringify({
        cin: getCin(),
        referenceFacture,
        methodePaiement,
        montant,
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

// ─── DOCUMENTS ─────────────────────────────────────────────────────────────
export const documentsAPI = {
  creerDemandeDocument: ({
    cinDemandeur,
    nomTitulaire,
    typeDocument,
    modePaiement,
    dernierChiffres = "",
  }) => {
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

  creerDemande: (args) => documentsAPI.creerDemandeDocument(args),

  soumettreRegistreCommerce: (cinDemandeur, formData) => {
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

  getCoffreFort: (cin) => {
    const finalCin = cin || getCin();
    return fetch(`${BASE_URL}/documents/coffre-fort/${finalCin}`, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse);
  },

  getStatutDemande: (reference) =>
    fetch(`${BASE_URL}/documents/statut/${reference}`, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse),

  getStatut: (reference) =>
    documentsAPI.getStatutDemande(reference),

  getTypesTarifs: () =>
    fetch(`${BASE_URL}/documents/types`, {
      method: "GET",
      headers: getHeaders(),
    }).then(handleResponse),
};

// Alias
export const documentAPI = documentsAPI;