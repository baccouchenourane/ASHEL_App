// src/services/api.js
// Couche d'accès à l'API backend ASHEL
 
const BASE_URL = 'http://localhost:8081/api';
 
/**
 * Étape 1 du login : vérifier CIN + mot de passe, recevoir l'OTP
 * @returns { otp: "123456" }
 */
export async function loginRequest(cin, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
  return data;
}
 
/**
 * Étape 2 du login : vérifier l'OTP, recevoir les infos utilisateur
 * @returns { user: { nom, cin, id } }
 */
export async function verifyOtpRequest(cin, otp) {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'OTP invalide');
  return data;
}
 
/**
 * Inscription d'un nouvel utilisateur
 */
export async function registerRequest(cin, nom, password, phone) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, nom, password, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'inscription');
  return data;
}
 
