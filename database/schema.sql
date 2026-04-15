-- =============================================================
--  ASHEL - Schéma MySQL
--  Généré depuis les entités Spring Boot
--  Compatible : MySQL 8.x / MariaDB 10.x
-- =============================================================

CREATE DATABASE IF NOT EXISTS ashel_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ashel_db;

-- =============================================================
--  TABLE : users
--  Entité : User.java
--  Clé naturelle : CIN (8 chiffres, unique)
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    cin      VARCHAR(8)   NOT NULL,
    nom      VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,   -- ⚠️  À hasher avec BCrypt en production
    phone    VARCHAR(20)  NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_cin (cin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================
--  TABLE : demandes_documents
--  Entité : DemandeDocument.java
--  Types   : EXTRAIT_NAISSANCE | BULLETIN_B3 | REGISTRE_COMMERCE
--            ATTESTATION_TRAVAIL | CERTIFICAT_RESIDENCE | FICHE_PAIE_CNRPS
--  Statuts : EN_ATTENTE | PAIEMENT_RECU | EN_TRAITEMENT | PRET | REJETE
-- =============================================================
CREATE TABLE IF NOT EXISTS demandes_documents (
    id                       BIGINT       NOT NULL AUTO_INCREMENT,
    reference                VARCHAR(30)  NOT NULL,
    type_document            ENUM(
                                 'EXTRAIT_NAISSANCE',
                                 'BULLETIN_B3',
                                 'REGISTRE_COMMERCE',
                                 'ATTESTATION_TRAVAIL',
                                 'CERTIFICAT_RESIDENCE',
                                 'FICHE_PAIE_CNRPS'
                             ) NOT NULL,
    cin_demandeur            VARCHAR(8)   NOT NULL,
    nom_titulaire            VARCHAR(100) NOT NULL,
    statut                   ENUM(
                                 'EN_ATTENTE',
                                 'PAIEMENT_RECU',
                                 'EN_TRAITEMENT',
                                 'PRET',
                                 'REJETE'
                             ) NOT NULL DEFAULT 'EN_ATTENTE',
    mode_paiement            VARCHAR(30)  NULL,         -- CARTE_BANCAIRE | EDINAR | VIREMENT_RNE
    montant_paye             DECIMAL(10,3) NULL,        -- En dinars tunisiens (3 décimales)
    date_creation            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_maj                 DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    donnees_supplementaires  TEXT         NULL,         -- JSON pour Registre de Commerce

    PRIMARY KEY (id),
    UNIQUE KEY uq_demandes_reference (reference),
    INDEX idx_demandes_cin      (cin_demandeur),
    INDEX idx_demandes_statut   (statut),
    INDEX idx_demandes_cin_type (cin_demandeur, type_document),

    CONSTRAINT fk_demandes_user
        FOREIGN KEY (cin_demandeur) REFERENCES users (cin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================
--  TABLE : factures
--  Entité : Facture.java
--  Types   : electricite | eau | radar | etude
--  Statuts : IMPAYEE | PAYEE | EN_ATTENTE
-- =============================================================
CREATE TABLE IF NOT EXISTS factures (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    cin            VARCHAR(8)    NOT NULL,
    type_facture   VARCHAR(50)   NOT NULL,              -- electricite | eau | radar | etude
    organisme      VARCHAR(100)  NOT NULL,              -- STEG | SONEDE | MIN. INTÉRIEUR | UNIVERSITÉ
    libelle        VARCHAR(255)  NOT NULL,
    montant        DECIMAL(10,3) NOT NULL,              -- En dinars tunisiens
    reference      VARCHAR(50)   NOT NULL,
    statut         VARCHAR(20)   NOT NULL DEFAULT 'IMPAYEE',
    date_echeance  DATE          NULL,
    date_paiement  DATE          NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_factures_reference (reference),
    INDEX idx_factures_cin        (cin),
    INDEX idx_factures_cin_type   (cin, type_facture),
    INDEX idx_factures_statut     (statut),

    CONSTRAINT fk_factures_user
        FOREIGN KEY (cin) REFERENCES users (cin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================
--  TABLE : paiements
--  Entité : Paiement.java
--  Méthodes : CARTE | EDINAR | VIREMENT | POSTE
--  Statuts  : EN_COURS | SUCCES | ECHEC
-- =============================================================
CREATE TABLE IF NOT EXISTS paiements (
    id                  BIGINT        NOT NULL AUTO_INCREMENT,
    cin                 VARCHAR(8)    NOT NULL,
    reference_facture   VARCHAR(50)   NOT NULL,
    methode_paiement    VARCHAR(20)   NOT NULL,          -- CARTE | EDINAR | VIREMENT | POSTE
    montant             DECIMAL(10,3) NOT NULL,
    numero_transaction  VARCHAR(30)   NOT NULL,
    statut              VARCHAR(20)   NOT NULL DEFAULT 'EN_COURS',
    date_paiement       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_paiements_transaction (numero_transaction),
    INDEX idx_paiements_cin         (cin),
    INDEX idx_paiements_facture     (reference_facture),
    INDEX idx_paiements_date        (date_paiement),

    CONSTRAINT fk_paiements_user
        FOREIGN KEY (cin) REFERENCES users (cin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_paiements_facture
        FOREIGN KEY (reference_facture) REFERENCES factures (reference)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================
--  DONNÉES DE TEST (DataInitializer.java)
--  Utilisateur de dev : CIN=12345678 / password=password123
-- =============================================================
INSERT IGNORE INTO users (cin, nom, password, phone)
VALUES ('12345678', 'Mohamed Ali', 'password123', '+21698000000');


-- =============================================================
--  VÉRIFICATION RAPIDE
-- =============================================================
SELECT 'users'               AS table_name, COUNT(*) AS lignes FROM users
UNION ALL
SELECT 'demandes_documents',               COUNT(*)            FROM demandes_documents
UNION ALL
SELECT 'factures',                         COUNT(*)            FROM factures
UNION ALL
SELECT 'paiements',                        COUNT(*)            FROM paiements;
