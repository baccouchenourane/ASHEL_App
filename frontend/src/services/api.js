// src/services/api.js
const BASE_URL = 'http://localhost:8081/api';

/**
 * Étape 1 : Login (CIN + Password) -> Reçoit l'OTP
 */
export async function loginRequest(cin, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, password }),
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Identifiants incorrects');
  }
  return res.json();
}

/**
 * Étape 2 : Vérification OTP
 * Note : On utilise "code" pour correspondre à ton paramètre Java String code
 */
export async function verifyOtpRequest(cin, code) {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, code: code.trim() }), // ← ajoute .trim()
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Code OTP invalide');
  }
  return res.json();
}

/**
 * Inscription
 */
export async function registerRequest(cin, nom, password, phone) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, nom, password, phone }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erreur lors de l'inscription");
  }
  return res.json();
}