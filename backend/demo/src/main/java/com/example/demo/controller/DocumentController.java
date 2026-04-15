package com.example.demo.controller;

import com.example.demo.dto.DemandeRequest;
import com.example.demo.dto.DemandeResponse;
import com.example.demo.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST pour tous les services de la tâche e_Administration.
 * Base URL: /api/documents
 *
 * Endpoints consommés par le frontend React (EAdministration.jsx et ses sous-formulaires):
 *
 *  POST   /api/documents/demande           → Créer une demande (BirthCert, B3, WorkCert, etc.)
 *  POST   /api/documents/registre-commerce → Soumettre demande RNE multi-étapes
 *  GET    /api/documents/coffre-fort/{cin} → Charger les docs du coffre-fort (DocumentVault)
 *  GET    /api/documents/statut/{ref}      → Consulter statut d'un dossier
 *  PATCH  /api/documents/statut/{ref}      → Mise à jour statut (admin)
 */
@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    /**
     * POST /api/documents/demande
     *
     * Utilisé par : BirthCertificationForm, BulletinB3Form,
     *               WorkCertificateForm, ResidenceCertificateForm, SalarySlipForm
     *
     * Body attendu:
     * {
     *   "cinDemandeur": "12345678",
     *   "nomTitulaire": "Mohamed Ben Ali",
     *   "typeDocument": "EXTRAIT_NAISSANCE",
     *   "modePaiement": "CARTE_BANCAIRE",
     *   "dernierChiffresCartee": "4242"
     * }
     */
    @PostMapping("/demande")
    public ResponseEntity<?> creerDemande(@RequestBody DemandeRequest request) {
        try {
            DemandeResponse response = documentService.creerDemande(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/documents/registre-commerce
     *
     * Utilisé par : RegisterForm.jsx (étape 3 - soumission finale)
     *
     * Body attendu:
     * {
     *   "cinDemandeur": "12345678",
     *   "nomTitulaire": "Mohamed Ben Ali",
     *   "typeDocument": "REGISTRE_COMMERCE",
     *   "donneesSupplementaires": "{\"raisonSociale\":\"TECH SARL\",\"formeJuridique\":\"SARL\",
     *                               \"activite\":\"Informatique\",\"capital\":\"10000\",
     *                               \"gerantNom\":\"Ben Ali\",\"gerantPrenom\":\"Mohamed\",
     *                               \"cin\":\"12345678\",\"telephone\":\"+216 99 000 000\",
     *                               \"email\":\"contact@tech.tn\",\"adresse\":\"Rue X, Tunis\",
     *                               \"gouvernorat\":\"Tunis\"}"
     * }
     */
    @PostMapping("/registre-commerce")
    public ResponseEntity<?> soumettreRegistreCommerce(@RequestBody DemandeRequest request) {
        try {
            // Force le type au cas où le frontend l'oublie
            request.setTypeDocument("REGISTRE_COMMERCE");
            DemandeResponse response = documentService.soumettreRegistreCommerce(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/documents/coffre-fort/{cin}
     *
     * Utilisé par : DocumentVault.jsx pour charger les documents du citoyen.
     *
     * Retourne la liste des demandes avec statut (PRET, EN_TRAITEMENT, etc.)
     * pour alimenter dynamiquement le coffre-fort plutôt que les données statiques.
     */
    @GetMapping("/coffre-fort/{cin}")
    public ResponseEntity<?> getCoffreFort(@PathVariable String cin) {
        try {
            List<DemandeResponse> docs = documentService.getCoffreFort(cin);
            return ResponseEntity.ok(docs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/documents/statut/{reference}
     *
     * Permet au citoyen de vérifier l'état de son dossier par sa référence.
     * Ex: GET /api/documents/statut/B3-2026-4521
     */
    @GetMapping("/statut/{reference}")
    public ResponseEntity<?> getStatutDemande(@PathVariable String reference) {
        try {
            DemandeResponse response = documentService.getStatutDemande(reference);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PATCH /api/documents/statut/{reference}
     *
     * Réservé à l'administration pour mettre à jour un statut.
     * Ex: passage de EN_TRAITEMENT à PRET pour le Bulletin B3.
     *
     * Body: { "statut": "PRET" }
     */
    @PatchMapping("/statut/{reference}")
    public ResponseEntity<?> mettreAJourStatut(
            @PathVariable String reference,
            @RequestBody Map<String, String> body) {
        try {
            String nouveauStatut = body.get("statut");
            if (nouveauStatut == null || nouveauStatut.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Le champ 'statut' est obligatoire"));
            }
            DemandeResponse response = documentService.mettreAJourStatut(reference, nouveauStatut);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/documents/types
     * Retourne les types de documents disponibles avec leurs tarifs (utile pour le frontend).
     */
    @GetMapping("/types")
    public ResponseEntity<?> getTypesTarifs() {
        return ResponseEntity.ok(Map.of(
            "EXTRAIT_NAISSANCE",    Map.of("libelle", "Extrait de Naissance",    "tarif", 0.600),
            "BULLETIN_B3",          Map.of("libelle", "Bulletin N°3",             "tarif", 2.000),
            "REGISTRE_COMMERCE",    Map.of("libelle", "Registre de Commerce",     "tarif", 50.000),
            "ATTESTATION_TRAVAIL",  Map.of("libelle", "Attestation de Travail",   "tarif", 1.500),
            "CERTIFICAT_RESIDENCE", Map.of("libelle", "Certificat de Résidence",  "tarif", 2.000),
            "FICHE_PAIE_CNRPS",     Map.of("libelle", "Fiche de Paie (CNRPS)",    "tarif", 0.500)
        ));
    }
}
