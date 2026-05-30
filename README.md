
<div align="center">

# ASHEL
### Application de Services aux Habitants En Ligne

**Projet Freelance — Application Mobile**
Architecture JWT | Spring Boot 3.3 | React 19 | MySQL

---

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?style=flat-square)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?style=flat-square)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/Licence-MIT-lightgrey?style=flat-square)](LICENSE)

</div>

---

##  Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation & Lancement](#installation--lancement)
- [Endpoints API](#endpoints-api)
- [Base de données](#base-de-données)
- [Sécurité](#sécurité)
- [Équipe](#équipe)

---

## Présentation

**ASHEL** (Application de Services aux Habitants En Ligne) est une application mobile permettant aux citoyens d'accéder aux services administratifs tunisiens depuis leur smartphone.

L'application centralise la gestion des paiements (factures, amendes), les demandes de documents administratifs, les signalements, les réclamations et l'évaluation des services publics — le tout avec une authentification sécurisée par double facteur (mot de passe + OTP).

> Projet Freelance — Application Mobile

---

## Fonctionnalités

###  Authentification & Sécurité
- Inscription avec CIN, nom, mot de passe (BCrypt) et numéro de téléphone
- Connexion avec vérification OTP à usage unique (5 min d'expiration)
- Authentification JWT (JSON Web Algorithms) pour sécuriser les sessions
- Renvoi de code OTP

### 💳 Paiements en ligne
- Consultation et paiement de factures (électricité STEG, eau SONEDE, télécoms)
- Paiement d'amendes en ligne (e-Amende)
- Paiement de services administratifs
- Historique des transactions et génération de reçus (PDF)

### 📄 E-Administration — Documents
- Demande d'extrait de naissance
- Demande de bulletin B3 (casier judiciaire)
- Attestation de travail & certificat de résidence
- Fiche de paie CNRPS
- Registre national des entreprises (RNE)
- Coffre-fort numérique pour stocker les documents obtenus
- Suivi de statut des dossiers en temps réel

###  Services citoyens
- Signalement d'incidents (voirie, éclairage, propreté…)
- Réclamations administratives
- Évaluation des services publics
- Assistant chatbot intégré (Tunis-Bot)

### 👤 Profil & Interface
- Écran de profil citoyen
- Dashboard personnalisé avec notifications
- Interface optimisée mobile (PWA-ready)
- Animations fluides (Framer Motion)

---

## Architecture

ASHEL suit une **architecture 3-tiers** avec séparation claire des responsabilités :

```
┌─────────────────────────────────────────────┐
│            Frontend (React PWA)              │
│   React 19 · React Router v7 · Axios        │
│   Framer Motion · jsPDF · Lucide Icons      │
└────────────────────┬────────────────────────┘
                     │ HTTP/REST + JWT Bearer
┌────────────────────▼────────────────────────┐
│           Backend (Spring Boot)              │
│  ┌──────────────────────────────────────┐   │
│  │  Controller  (REST endpoints)         │   │
│  ├──────────────────────────────────────┤   │
│  │  Service     (Logique métier)         │   │
│  ├──────────────────────────────────────┤   │
│  │  Repository  (Spring Data JPA)        │   │
│  └──────────────────────────────────────┘   │
│  Spring Security · BCrypt · OTP Service     │
└────────────────────┬────────────────────────┘
                     │ JPA / Hibernate
┌────────────────────▼────────────────────────┐
│              Base de données                 │
│           MySQL 8.x — ashel_db              │
│   users · factures · paiements · documents  │
│   signalements · reclamations · evaluations │
└─────────────────────────────────────────────┘
```

### Flux d'authentification (JWT + OTP)

```
Client          Backend           DB
  │                │               │
  ├── POST /login ─►               │
  │    cin + mdp   │               │
  │                ├── BCrypt ─────►
  │                │◄── User ──────┤
  │                ├── Génère OTP  │
  │◄── OTP (SMS) ──┤               │
  │                │               │
  ├── POST /verify-otp ────────────►
  │    cin + code  │               │
  │                ├── Vérifie OTP │
  │◄── JWT Token ──┤               │
  │                │               │
  ├── GET /api/... (Authorization: Bearer <token>)
  │                ├── JwtAuthFilter valide
  │◄── Données ────┤
```

---

## Stack technique

| Couche | Technologie | Version |
|--------|------------|---------|
| **Frontend** | React | 19.0 |
| **Routing** | React Router DOM | 7.x |
| **Animations** | Framer Motion | 11.x |
| **HTTP Client** | Axios | 1.14 |
| **PDF** | jsPDF | 4.x |
| **Build tool** | Vite + PWA plugin | 6.x |
| **Backend** | Spring Boot | 3.3.5 |
| **Langage** | Java | 17 |
| **Sécurité** | Spring Security | 6.x |
| **ORM** | Spring Data JPA / Hibernate | 6.x |
| **Build** | Maven | 3.9.x |
| **Base de données** | MySQL | 8.x |
| **Hachage** | BCrypt | — |

---

## Structure du projet

```
ASHEL_App/
├── backend/
│   └── demo/
│       ├── pom.xml
│       └── src/main/java/com/example/demo/
│           ├── config/
│           │   ├── SecurityConfig.java       # Spring Security + CORS
│           │   ├── CorsConfig.java
│           │   └── DataInitializer.java
│           ├── controller/                   # Endpoints REST
│           │   ├── AuthController.java
│           │   ├── DocumentController.java
│           │   ├── EvaluationController.java
│           │   ├── PaiementController.java
│           │   ├── ReclamationController.java
│           │   └── SignalementController.java
│           ├── dto/                          # Objets de transfert
│           │   ├── DemandeRequest.java
│           │   └── DemandeResponse.java
│           ├── model/                        # Entités JPA
│           │   ├── User.java
│           │   ├── DemandeDocument.java
│           │   ├── Facture.java
│           │   ├── Paiement.java
│           │   ├── Evaluation.java
│           │   ├── Reclamation.java
│           │   └── Signalement.java
│           ├── repository/                   # Spring Data JPA
│           └── service/                      # Logique métier
│               ├── AuthService.java
│               ├── OtpService.java
│               ├── DocumentService.java
│               ├── PaiementService.java
│               └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/                       # 30+ composants React
│   │   │   ├── Login.jsx / Register.jsx
│   │   │   ├── Home.jsx / Profiltemp.jsx
│   │   │   ├── EAdministration.jsx
│   │   │   ├── Paymenthub.jsx
│   │   │   ├── Signalement.jsx
│   │   │   ├── Reclamation.jsx
│   │   │   ├── Evaluation.jsx
│   │   │   ├── DocumentVault.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js                        # Couche API centralisée
│   │   └── App.jsx                           # Router + GlobalChatbot
│   └── package.json
│
└── database/
    └── schema.sql                            # Schéma MySQL complet
```

---

## Prérequis

- **Java 17+**
- **Maven 3.9+** *(inclus dans `apache-maven-3.9.14/`)*
- **MySQL 8.x** en cours d'exécution sur le port `3308`
- **Node.js 18+** & **npm**

---

## Installation & Lancement

### 1. Base de données

```bash
# Créer la base et importer le schéma
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend/demo

# Copier et configurer les variables d'environnement
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Éditer application.properties avec vos credentials DB

# Lancer le serveur (port 8081)
./mvnw spring-boot:run
```

Le backend est accessible sur `http://localhost:8081`

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en développement (port 5173)
npm run dev

# Build de production
npm run build
```

L'application est accessible sur `http://localhost:5173`

### Variables d'environnement Frontend

Créer un fichier `.env` dans `frontend/` :

```env
VITE_API_URL=http://localhost:8081/api
```

---

## Endpoints API

### Authentification — `/api/auth`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/login` | Connexion + envoi OTP | ❌ |
| `POST` | `/verify-otp` | Vérifier OTP → retourne JWT | ❌ |
| `POST` | `/register` | Créer un compte | ❌ |
| `POST` | `/resend-otp` | Renvoyer un OTP | ❌ |

### Dashboard — `/api/home`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/dashboard` | Données tableau de bord | ✅ JWT |
| `POST` | `/logout` | Déconnexion | ✅ JWT |
| `PUT` | `/notifications/lu/:id` | Marquer notification lue | ✅ JWT |

### Paiements — `/api/paiement`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/factures` | Liste des factures du citoyen | ✅ JWT |
| `POST` | `/initier` | Initier un paiement | ✅ JWT |
| `POST` | `/confirmer` | Confirmer un paiement | ✅ JWT |
| `GET` | `/historique` | Historique des paiements | ✅ JWT |
| `GET` | `/recu` | Obtenir un reçu | ✅ JWT |

### Documents — `/api/documents`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/demande` | Créer une demande de document | ✅ JWT |
| `GET` | `/coffre-fort/:cin` | Documents du citoyen | ✅ JWT |
| `GET` | `/statut/:reference` | Statut d'un dossier | ✅ JWT |
| `GET` | `/types` | Types de documents & tarifs | ✅ JWT |

### Autres — `/api/signalement`, `/api/reclamation`, `/api/evaluation`

> Voir la documentation complète des contrôleurs pour le détail des paramètres.

---

## Base de données

Le schéma complet est disponible dans `database/schema.sql`.

**Tables principales :**

| Table | Description |
|-------|-------------|
| `users` | Citoyens (CIN unique, BCrypt) |
| `demandes_documents` | Demandes administratives avec statuts |
| `factures` | Factures STEG / SONEDE / etc. |
| `paiements` | Transactions avec numéro unique |
| `signalements` | Incidents signalés par les citoyens |
| `reclamations` | Réclamations administratives |
| `evaluations` | Notes et avis sur les services |

---

## Sécurité

- **Mots de passe** : hachés avec BCrypt (jamais stockés en clair)
- **Sessions** : Stateless (SessionCreationPolicy.STATELESS)
- **Authentification** : Double facteur — mot de passe + OTP 6 chiffres
- **OTP** : Usage unique, expiration 5 minutes, stockage en mémoire (ConcurrentHashMap)
- **Tokens** : JWT signé (HS256) — toutes les routes métier protégées par `JwtAuthFilter`
- **CORS** : Configuré pour les origines autorisées
- **CSRF** : Désactivé (API stateless)

---

## Équipe

Projet réalisé par :

- **Nourane Baccouche Rejichi**
- **Lina** 
- **Maram Mliki**

---

<div align="center">
  <sub>ASHEL — Application de Services aux Habitants En Ligne</sub>
</div>
