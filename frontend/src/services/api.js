const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// ─── HELPERS ──────────────────────────────────────────────────────────────
const getCin = () => {
  const user = JSON.parse(localStorage.getItem('user_ashel'));
  return user?.cin || '';
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Erreur serveur');
  return data;
};

// ─── EXPORTS POUR LOGIN.JSX ────────────────────────────────────────────────
// On exporte loginRequest directement pour corriger l'erreur d'import de Login.jsx
export const loginRequest = (cin, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, password }),
  }).then(handleResponse);

export const authAPI = {
  loginRequest, // Alias pour la compatibilité
  verifyOtp: (cin, code) =>
    fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin, code }),
    }).then(handleResponse),
};

// ─── EXPORTS POUR HOME.JSX ─────────────────────────────────────────────────
export const homeAPI = {
  // Appelle le dashboard géré par ton HomeController.java
  getDashboard: () =>
    fetch(`${BASE_URL}/home/dashboard?cin=${getCin()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse),

  logout: () => {
    const cin = getCin();
    return fetch(`${BASE_URL}/home/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cin }),
    }).then(handleResponse);
  },

  marquerNotifLue: (id) =>
    fetch(`${BASE_URL}/home/notifications/lu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse),
};