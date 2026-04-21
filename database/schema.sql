-- ============================================================
-- ASHEL E-Participation — Schéma MySQL Fusionné
-- Fusion de : ashel_db (schema.sql) + eparticipation_db (schema(1).sql)
-- Compatible : MySQL 8.x / MariaDB 10.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS ashel_eparticipation_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ashel_eparticipation_db;

-- ============================================================
--  TABLE : users
--  Fusion des deux entités User :
--    - ashel_db       : cin, nom, password, phone
--    - eparticipation : email, role, otp_code, otp_expiry, verified, date_inscription
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    cin               VARCHAR(8)    NOT NULL,
    nom               VARCHAR(200)  NOT NULL,
    email             VARCHAR(200)  NULL,
    phone             VARCHAR(20)   NULL,
    password          VARCHAR(255)  NOT NULL,   -- Hashé avec BCrypt en production
    role              VARCHAR(20)   NOT NULL DEFAULT 'CITOYEN',   -- CITOYEN | ADMIN | AGENT
    otp_code          VARCHAR(10)   NULL,
    otp_expiry        DATETIME      NULL,
    verified          BOOLEAN       NOT NULL DEFAULT FALSE,
    date_inscription  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_cin   (cin),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE : demandes_documents
--  Entité : DemandeDocument.java (ashel_db)
--  Types   : EXTRAIT_NAISSANCE | BULLETIN_B3 | REGISTRE_COMMERCE
--            ATTESTATION_TRAVAIL | CERTIFICAT_RESIDENCE | FICHE_PAIE_CNRPS
--  Statuts : EN_ATTENTE | PAIEMENT_RECU | EN_TRAITEMENT | PRET | REJETE
-- ============================================================
CREATE TABLE IF NOT EXISTS demandes_documents (
    id                       BIGINT        NOT NULL AUTO_INCREMENT,
    reference                VARCHAR(30)   NOT NULL,
    type_document            ENUM(
                                 'EXTRAIT_NAISSANCE',
                                 'BULLETIN_B3',
                                 'REGISTRE_COMMERCE',
                                 'ATTESTATION_TRAVAIL',
                                 'CERTIFICAT_RESIDENCE',
                                 'FICHE_PAIE_CNRPS'
                             ) NOT NULL,
    cin_demandeur            VARCHAR(8)    NOT NULL,
    nom_titulaire            VARCHAR(100)  NOT NULL,
    statut                   ENUM(
                                 'EN_ATTENTE',
                                 'PAIEMENT_RECU',
                                 'EN_TRAITEMENT',
                                 'PRET',
                                 'REJETE'
                             ) NOT NULL DEFAULT 'EN_ATTENTE',
    mode_paiement            VARCHAR(30)   NULL,         -- CARTE_BANCAIRE | EDINAR | VIREMENT_RNE
    montant_paye             DECIMAL(10,3) NULL,         -- En dinars tunisiens (3 décimales)
    date_creation            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_maj                 DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    donnees_supplementaires  TEXT          NULL,         -- JSON pour Registre de Commerce

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


-- ============================================================
--  TABLE : factures
--  Entité : Facture.java (ashel_db)
--  Types   : electricite | eau | radar | etude
--  Statuts : IMPAYEE | PAYEE | EN_ATTENTE
-- ============================================================
CREATE TABLE IF NOT EXISTS factures (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    cin            VARCHAR(8)    NOT NULL,
    type_facture   VARCHAR(50)   NOT NULL,              -- electricite | eau | radar | etude
    organisme      VARCHAR(100)  NOT NULL,              -- STEG | SONEDE | MIN. INTÉRIEUR | UNIVERSITÉ
    libelle        VARCHAR(255)  NOT NULL,
    montant        DECIMAL(10,3) NOT NULL,
    reference      VARCHAR(50)   NOT NULL,
    statut         VARCHAR(20)   NOT NULL DEFAULT 'IMPAYEE',
    date_echeance  DATE          NULL,
    date_paiement  DATE          NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_factures_reference (reference),
    INDEX idx_factures_cin       (cin),
    INDEX idx_factures_cin_type  (cin, type_facture),
    INDEX idx_factures_statut    (statut),

    CONSTRAINT fk_factures_user
        FOREIGN KEY (cin) REFERENCES users (cin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE : paiements
--  Entité : Paiement.java (ashel_db)
--  Méthodes : CARTE | EDINAR | VIREMENT | POSTE
--  Statuts  : EN_COURS | SUCCES | ECHEC
-- ============================================================
CREATE TABLE IF NOT EXISTS paiements (
    id                  BIGINT        NOT NULL AUTO_INCREMENT,
    cin                 VARCHAR(8)    NOT NULL,
    reference_facture   VARCHAR(50)   NOT NULL,
    methode_paiement    VARCHAR(20)   NOT NULL,
    montant             DECIMAL(10,3) NOT NULL,
    numero_transaction  VARCHAR(30)   NOT NULL,
    statut              VARCHAR(20)   NOT NULL DEFAULT 'EN_COURS',
    date_paiement       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_paiements_transaction (numero_transaction),
    INDEX idx_paiements_cin     (cin),
    INDEX idx_paiements_facture (reference_facture),
    INDEX idx_paiements_date    (date_paiement),

    CONSTRAINT fk_paiements_user
        FOREIGN KEY (cin) REFERENCES users (cin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_paiements_facture
        FOREIGN KEY (reference_facture) REFERENCES factures (reference)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE : reclamations
--  Entité : Reclamation.java (ashel_db)
--  Types   : DOCUMENT | PAIEMENT | FACTURE | SERVICE | AUTRE
--  Statuts : OUVERTE | EN_COURS | RESOLUE | FERMEE
-- ============================================================
CREATE TABLE IF NOT EXISTS reclamations (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    reference        VARCHAR(30)   NOT NULL,
    cin              VARCHAR(8)    NOT NULL,
    type_reclamation ENUM(
                         'DOCUMENT',
                         'PAIEMENT',
                         'FACTURE',
                         'SERVICE',
                         'AUTRE'
                     ) NOT NULL,
    sujet            VARCHAR(255)  NOT NULL,
    description      TEXT          NOT NULL,
    statut           ENUM(
                         'OUVERTE',
                         'EN_COURS',
                         'RESOLUE',
                         'FERMEE'
                     ) NOT NULL DEFAULT 'OUVERTE',
    reference_liee   VARCHAR(50)   NULL,        -- Référence optionnelle (demande / facture / paiement)
    reponse_admin    TEXT          NULL,
    date_creation    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_maj         DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_reclamations_reference (reference),
    INDEX idx_reclamations_cin    (cin),
    INDEX idx_reclamations_statut (statut),

    CONSTRAINT fk_reclamations_user
        FOREIGN KEY (cin) REFERENCES users (cin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE : signalements
--  Fusion des deux entités Signalement :
--    - ashel_db       : reference, categorie (ENUM BUG/FRAUDE/…), url_capture, note_interne
--    - eparticipation : titre, photos, citoyen_id (via cin)
--  Statuts : NOUVEAU | EN_EXAMEN | TRAITE | REJETE
-- ============================================================
CREATE TABLE IF NOT EXISTS signalements (
    id            BIGINT        NOT NULL AUTO_INCREMENT,
    reference     VARCHAR(30)   NOT NULL,
    cin           VARCHAR(8)    NOT NULL,
    titre         VARCHAR(200)  NOT NULL,
    categorie     ENUM(
                      'BUG',
                      'FRAUDE',
                      'CONTENU_INAPPROPRIE',
                      'SECURITE',
                      'INFRASTRUCTURE',   -- Ajouté pour couvrir les signalements terrain (eparticipation)
                      'AUTRE'
                  ) NOT NULL,
    description   TEXT          NOT NULL,
    statut        ENUM(
                      'NOUVEAU',
                      'EN_EXAMEN',
                      'TRAITE',
                      'REJETE'
                  ) NOT NULL DEFAULT 'NOUVEAU',
    photos        TEXT          NULL,           -- Chemins ou URLs des photos jointes
    url_capture   VARCHAR(500)  NULL,           -- Lien vers une capture d'écran
    note_interne  TEXT          NULL,           -- Commentaire interne (admin uniquement)
    date_creation DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_maj      DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_signalements_reference (reference),
    INDEX idx_signalements_cin       (cin),
    INDEX idx_signalements_categorie (categorie),
    INDEX idx_signalements_statut    (statut),

    CONSTRAINT fk_signalements_user
        FOREIGN KEY (cin) REFERENCES users (cin)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  TABLE : evaluations
--  Fusion des deux entités Evaluation :
--    - ashel_db       : note étoiles sur demande_id ou facture_id (XOR)
--    - eparticipation : note étoiles sur service_public (texte libre)
--  Les trois cibles sont maintenant optionnelles et mutuellement exclusives.
--  Contrainte XOR gérée par TRIGGER (contournement MySQL #3823).
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluations (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    cin             VARCHAR(8)    NOT NULL,
    demande_id      BIGINT        NULL,           -- Cible : demande de document
    facture_id      BIGINT        NULL,           -- Cible : facture
    service_public  VARCHAR(200)  NULL,           -- Cible : service public (texte libre)
    note            TINYINT       NOT NULL,
    commentaire     TEXT          NULL,
    date_creation   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_evaluations_cin     (cin),
    INDEX idx_evaluations_demande (demande_id),
    INDEX idx_evaluations_facture (facture_id),

    UNIQUE KEY uq_eval_cin_demande (cin, demande_id),
    UNIQUE KEY uq_eval_cin_facture (cin, facture_id),

    CONSTRAINT chk_eval_note
        CHECK (note BETWEEN 1 AND 5),

    CONSTRAINT fk_evaluations_user
        FOREIGN KEY (cin)        REFERENCES users (cin)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_evaluations_demande
        FOREIGN KEY (demande_id) REFERENCES demandes_documents (id)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_evaluations_facture
        FOREIGN KEY (facture_id) REFERENCES factures (id)
        ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
--  TRIGGER : enforce XOR(demande_id, facture_id, service_public)
--  Une évaluation doit cibler exactement une des trois cibles.
-- ------------------------------------------------------------
DELIMITER $$

CREATE TRIGGER trg_eval_xor_before_insert
BEFORE INSERT ON evaluations
FOR EACH ROW
BEGIN
    DECLARE nb_cibles INT;
    SET nb_cibles = (NEW.demande_id IS NOT NULL) + (NEW.facture_id IS NOT NULL) + (NEW.service_public IS NOT NULL);
    IF nb_cibles <> 1 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Une évaluation doit cibler exactement une cible : demande, facture ou service_public.';
    END IF;
END$$

CREATE TRIGGER trg_eval_xor_before_update
BEFORE UPDATE ON evaluations
FOR EACH ROW
BEGIN
    DECLARE nb_cibles INT;
    SET nb_cibles = (NEW.demande_id IS NOT NULL) + (NEW.facture_id IS NOT NULL) + (NEW.service_public IS NOT NULL);
    IF nb_cibles <> 1 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Une évaluation doit cibler exactement une cible : demande, facture ou service_public.';
    END IF;
END$$

DELIMITER ;


-- ============================================================
--  TABLE : notifications
--  Entité issue de eparticipation_db uniquement
--  Statuts : NON_LU | LU
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    cin             VARCHAR(8)    NOT NULL,
    signalement_id  BIGINT        NULL,
    message         TEXT          NOT NULL,
    statut          VARCHAR(10)   NOT NULL DEFAULT 'NON_LU',   -- NON_LU | LU
    date_creation   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_notifications_cin          (cin),
    INDEX idx_notifications_signalement  (signalement_id),
    INDEX idx_notifications_statut       (statut),

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (cin) REFERENCES users (cin)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_notifications_signalement
        FOREIGN KEY (signalement_id) REFERENCES signalements (id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  DONNÉES DE TEST
--  Utilisateur de dev : CIN=12345678 / password=password123
-- ============================================================
INSERT IGNORE INTO users (cin, nom, email, phone, password, role, verified)
VALUES ('12345678', 'Mohamed Ali', 'mohamed.ali@example.com', '+21698000000', 'password123', 'CITOYEN', TRUE);


-- ============================================================
--  VÉRIFICATION RAPIDE
-- ============================================================
SELECT 'users'                AS table_name, COUNT(*) AS lignes FROM users
UNION ALL
SELECT 'demandes_documents',               COUNT(*)            FROM demandes_documents
UNION ALL
SELECT 'factures',                         COUNT(*)            FROM factures
UNION ALL
SELECT 'paiements',                        COUNT(*)            FROM paiements
UNION ALL
SELECT 'reclamations',                     COUNT(*)            FROM reclamations
UNION ALL
SELECT 'signalements',                     COUNT(*)            FROM signalements
UNION ALL
SELECT 'evaluations',                      COUNT(*)            FROM evaluations
UNION ALL
SELECT 'notifications',                    COUNT(*)            FROM notifications;
