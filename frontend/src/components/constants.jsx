// src/constants.js
import React from 'react';
import { Zap, Droplets, ShieldAlert, GraduationCap } from 'lucide-react';

export const FACTURES_DATA = {
  electricite: {
    id: 'electricite',
    org: "STEG",
    title: "Facture Électricité",
    adresse: "38, Rue Kamel Ataturk, Tunis",
    ref: "STG-2026-04421",
    consommation: "320 kWh",
    details: [
      { label: "Consommation HP", val: "45.200 DT" },
      { label: "Consommation HC", val: "27.300 DT" },
      { label: "TVA (13%)", val: "13.000 DT" }
    ],
    total: "85.500",
    color: "#f59e0b",
    icon: <Zap size={22} />
  },
  eau: {
    id: 'eau',
    org: "SONEDE",
    title: "Facture Eau",
    adresse: "Avenue de l'Indépendance, Tunis",
    ref: "SND-2026-881",
    consommation: "45 m³",
    details: [
      { label: "Consommation Eau", val: "32.200 DT" },
      { label: "Redevance Fixe", val: "10.000 DT" }
    ],
    total: "42.200",
    color: "#0ea5e9",
    icon: <Droplets size={22} />
  },
  radar: {
    id: 'radar',
    org: "MIN. INTÉRIEUR",
    title: "Amende Radar",
    adresse: "Direction de la Circulation, Tunis",
    ref: "PV-2026-9910",
    details: [
      { label: "Excès de vitesse (>20km/h)", val: "60.000 DT" }
    ],
    total: "60.000",
    color: "#e11d48",
    icon: <ShieldAlert size={22} />
  },
  etude: { // <--- Assure-toi que cet ID correspond à la carte cliquée
    id: 'etude',
    org: "MIN. ÉDUCATION",
    title: "Frais d'Inscription",
    adresse: "Avenue Bab Bnet, Tunis",
    ref: "EDU-2026-992",
    details: [
      { label: "Frais de scolarité", val: "10.000 DT" },
      { label: "Assurance scolaire", val: "2.500 DT" }
    ],
    total: "12.500",
    color: "#8b5cf6",
  }
};