package com.example.demo.controller;

import com.example.demo.model.Contestation;
import com.example.demo.model.Facture;
import com.example.demo.repository.ContestationRepository;
import com.example.demo.repository.FactureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des amendes ASHEL.
 *
 * Endpoints disponibles :
 *
 * [AGENT]
 *   POST /api/amende/creer              → Saisie d'une nouvelle amende par l'agent
 *
 * [CITOYEN]
 *   POST /api/amende/contester          → Soumettre une contestation
 *   GET  /api/amende/contestations?cin= → Lister ses contestations
 *
 * [ADMIN]
 *   GET  /api/amende/contestations/all  → Toutes les contestations
 *   PATCH /api/amende/contestation/{id}/statut → Traiter une contestation
 */
@RestController
@RequestMapping("/api/amende")
@CrossOrigin(origins = "http://localhost:5173")
public class AmendeController {

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private ContestationRepository contestationRepository;

    // ═════════════════════════════════════════════════════════════════════════
    // AGENT — Saisie d'une nouvelle amende
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Crée une nouvelle amende à partir d'un PV saisi par l'agent de terrain.
     * L'amende est liée au matricule du véhicule ; le CIN du propriétaire
     * sera résolu ultérieurement via la base des immatriculations.
     *
     * POST /api/amende/creer
     * Body JSON :
     * {
     *   "matricule"  : "235 TUN 4567",
     *   "infraction" : "Excès de vitesse",
     *   "montant"    : 60,
     *   "lieu"       : "Route de Radès",
     *   "agentId"    : "AGENT-001",
     *   "notes"      : "Vitesse : 120 km/h — limite : 90 km/h"
     * }
     */
    @PostMapping("/creer")
    public ResponseEntity<?> creerAmende(@RequestBody Map<String, Object> body) {
        try {
            String matricule  = (String) body.get("matricule");
            String infraction = (String) body.get("infraction");
            Object montantRaw = body.get("montant");
            String lieu       = (String) body.getOrDefault("lieu", "Non précisé");
            String agentId    = (String) body.getOrDefault("agentId", "AGENT_INCONNU");
            String notes      = (String) body.getOrDefault("notes", "");

            // Validations minimales
            if (matricule == null || matricule.isBlank())
                return badRequest("Le matricule est obligatoire");
            if (infraction == null || infraction.isBlank())
                return badRequest("Le type d'infraction est obligatoire");
            if (montantRaw == null)
                return badRequest("Le montant est obligatoire");

            double montant = Double.parseDouble(montantRaw.toString());

            // Générer une référence PV unique
            String reference = "PV-" + LocalDate.now().getYear() + "-"
                    + (int)(Math.random() * 9000 + 1000);

            // Libellé enrichi
            String libelle = infraction + (notes.isBlank() ? "" : " — " + notes);

            // Créer la facture associée (cin = matricule en attendant la liaison)
            // En production : résoudre le CIN depuis le registre des immatriculations
            Facture facture = new Facture(
                    matricule,          // utilisé comme identifiant temporaire
                    "radar",
                    "MIN. INTÉRIEUR",
                    libelle,
                    montant,
                    reference,
                    LocalDate.now().plusDays(30)
            );
            factureRepository.save(facture);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", true);
            response.put("reference", reference);
            response.put("matricule", matricule);
            response.put("infraction", infraction);
            response.put("montant", montant);
            response.put("lieu", lieu);
            response.put("agentId", agentId);
            response.put("dateCreation", LocalDateTime.now().toString());
            response.put("message", "Procès-verbal enregistré et notifié au propriétaire du véhicule");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la création de l'amende : " + e.getMessage()));
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CITOYEN — Contestation d'amende
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Soumet une contestation pour une amende donnée.
     *
     * POST /api/amende/contester
     * Body JSON :
     * {
     *   "cin"            : "12345678",
     *   "referenceAmende": "PV-2026-88",
     *   "motif"          : "Je n'étais pas au volant",
     *   "description"    : "Mon véhicule avait été prêté à..."
     * }
     */
    @PostMapping("/contester")
    public ResponseEntity<?> contesterAmende(@RequestBody Map<String, String> body) {
        try {
            String cin             = body.get("cin");
            String referenceAmende = body.get("referenceAmende");
            String motif           = body.get("motif");
            String description     = body.get("description");

            if (cin == null || cin.isBlank())
                return badRequest("Le CIN est obligatoire");
            if (referenceAmende == null || referenceAmende.isBlank())
                return badRequest("La référence de l'amende est obligatoire");
            if (motif == null || motif.isBlank())
                return badRequest("Le motif est obligatoire");
            if (description == null || description.length() < 20)
                return badRequest("La description doit contenir au moins 20 caractères");

            // Vérifier qu'aucune contestation EN_ATTENTE n'existe déjà pour ce PV
            boolean dejaContestee = contestationRepository
                    .existsByCinAndReferenceAmendeAndStatut(cin, referenceAmende, "EN_ATTENTE");
            if (dejaContestee)
                return badRequest("Une contestation est déjà en cours pour cette amende");

            Contestation contestation = new Contestation(cin, referenceAmende, motif, description);
            contestationRepository.save(contestation);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "contestationId", contestation.getId(),
                    "referenceAmende", referenceAmende,
                    "statut", "EN_ATTENTE",
                    "delaiReponse", "15 jours ouvrables",
                    "message", "Votre contestation a été transmise au Ministère de l'Intérieur"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la soumission : " + e.getMessage()));
        }
    }

    /**
     * Retourne la liste des contestations d'un citoyen.
     *
     * GET /api/amende/contestations?cin=12345678
     */
    @GetMapping("/contestations")
    public ResponseEntity<?> getMesContestations(@RequestParam String cin) {
        try {
            List<Map<String, Object>> result = contestationRepository
                    .findByCinOrderByDateSoumissionDesc(cin)
                    .stream()
                    .map(this::contestationToMap)
                    .toList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // ADMIN — Gestion des contestations
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Retourne toutes les contestations (vue administrateur).
     *
     * GET /api/amende/contestations/all
     */
    @GetMapping("/contestations/all")
    public ResponseEntity<?> getAllContestations() {
        try {
            List<Map<String, Object>> result = contestationRepository
                    .findAllByOrderByDateSoumissionDesc()
                    .stream()
                    .map(this::contestationToMap)
                    .toList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Traite une contestation (admin : accepter ou rejeter).
     * Si ACCEPTEE → la facture associée passe à "ANNULEE".
     *
     * PATCH /api/amende/contestation/{id}/statut
     * Body JSON : { "statut": "ACCEPTEE", "commentaireAdmin": "Motif valide" }
     */
    @PatchMapping("/contestation/{id}/statut")
    public ResponseEntity<?> traiterContestation(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String nouveauStatut   = body.get("statut");
            String commentaire     = body.getOrDefault("commentaireAdmin", "");

            if (!"ACCEPTEE".equals(nouveauStatut) && !"REJETEE".equals(nouveauStatut))
                return badRequest("Statut invalide. Valeurs acceptées : ACCEPTEE, REJETEE");

            Contestation contestation = contestationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Contestation introuvable : " + id));

            contestation.setStatut(nouveauStatut);
            contestation.setCommentaireAdmin(commentaire);
            contestation.setDateTraitement(LocalDateTime.now());
            contestationRepository.save(contestation);

            // Si acceptée → annuler la facture correspondante
            if ("ACCEPTEE".equals(nouveauStatut)) {
                factureRepository.findByReference(contestation.getReferenceAmende())
                        .ifPresent(f -> {
                            f.setStatut("ANNULEE");
                            factureRepository.save(f);
                        });
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "contestationId", id,
                    "statut", nouveauStatut,
                    "message", "ACCEPTEE".equals(nouveauStatut)
                            ? "Contestation acceptée — amende annulée"
                            : "Contestation rejetée — amende maintenue"
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Utilitaires ─────────────────────────────────────────────────────────

    private ResponseEntity<Map<String, Object>> badRequest(String message) {
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }

    private Map<String, Object> contestationToMap(Contestation c) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", c.getId());
        map.put("cin", c.getCin());
        map.put("referenceAmende", c.getReferenceAmende());
        map.put("motif", c.getMotif());
        map.put("description", c.getDescription());
        map.put("statut", c.getStatut());
        map.put("commentaireAdmin", c.getCommentaireAdmin());
        map.put("dateSoumission", c.getDateSoumission() != null ? c.getDateSoumission().toString() : null);
        map.put("dateTraitement", c.getDateTraitement() != null ? c.getDateTraitement().toString() : null);
        return map;
    }
}
