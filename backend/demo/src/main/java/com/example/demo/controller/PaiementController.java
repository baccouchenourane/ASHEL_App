package com.example.demo.controller;

import com.example.demo.service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur REST pour la gestion des paiements ASHEL.
 *
 * Endpoints disponibles :
 *   GET  /api/paiement/factures?cin=...                     → Liste des factures de l'utilisateur
 *   GET  /api/paiement/facture?cin=...&type=...             → Détail d'une facture par type
 *   POST /api/paiement/initier                              → Initier un paiement (crée TXN EN_COURS)
 *   POST /api/paiement/confirmer                            → Confirmer un paiement (marque SUCCES)
 *   GET  /api/paiement/historique?cin=...                   → Historique des paiements
 *   GET  /api/paiement/recu?numeroTransaction=...           → Reçu d'un paiement
 */
@RestController
@RequestMapping("/api/paiement")
@CrossOrigin(origins = "http://localhost:5173")
public class PaiementController {

    @Autowired
    private PaiementService paiementService;

    // ─── FACTURES ─────────────────────────────────────────────────────────────

    /**
     * Récupère toutes les factures d'un utilisateur.
     * Génère les factures par défaut si l'utilisateur n'en a aucune.
     *
     * GET /api/paiement/factures?cin=12345678
     */
    @GetMapping("/factures")
    public ResponseEntity<?> getFactures(@RequestParam String cin) {
        try {
            return ResponseEntity.ok(paiementService.getFacturesByCin(cin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Récupère le détail d'une facture par son type (electricite, eau, radar, etude).
     *
     * GET /api/paiement/facture?cin=12345678&type=electricite
     */
    @GetMapping("/facture")
    public ResponseEntity<?> getFactureByType(
            @RequestParam String cin,
            @RequestParam String type) {
        try {
            return ResponseEntity.ok(paiementService.getFactureByType(cin, type));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PAIEMENT ─────────────────────────────────────────────────────────────

    /**
     * Initie un paiement : vérifie la facture et crée une transaction EN_COURS.
     *
     * POST /api/paiement/initier
     * Body JSON : { "cin": "...", "referenceFacture": "...", "methodePaiement": "CARTE" }
     */
    @PostMapping("/initier")
    public ResponseEntity<?> initierPaiement(@RequestBody Map<String, String> body) {
        try {
            String cin              = body.get("cin");
            String referenceFacture = body.get("referenceFacture");
            String methodePaiement  = body.get("methodePaiement");

            if (cin == null || referenceFacture == null || methodePaiement == null
                    || cin.isBlank() || referenceFacture.isBlank() || methodePaiement.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Champs obligatoires manquants : cin, referenceFacture, methodePaiement"));
            }

            return ResponseEntity.ok(
                    paiementService.initierPaiement(cin, referenceFacture, methodePaiement)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Confirme un paiement (simule la réponse de la plateforme bancaire).
     * En production, cet endpoint serait appelé par le webhook Monétique Tunisie.
     *
     * POST /api/paiement/confirmer
     * Body JSON : { "numeroTransaction": "TXN-..." }
     */
    @PostMapping("/confirmer")
    public ResponseEntity<?> confirmerPaiement(@RequestBody Map<String, String> body) {
        try {
            String numeroTransaction = body.get("numeroTransaction");

            if (numeroTransaction == null || numeroTransaction.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "numeroTransaction est obligatoire"));
            }

            return ResponseEntity.ok(
                    paiementService.confirmerPaiement(numeroTransaction)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── HISTORIQUE & REÇU ────────────────────────────────────────────────────

    /**
     * Retourne l'historique de tous les paiements d'un utilisateur.
     *
     * GET /api/paiement/historique?cin=12345678
     */
    @GetMapping("/historique")
    public ResponseEntity<?> getHistorique(@RequestParam String cin) {
        try {
            return ResponseEntity.ok(paiementService.getHistoriquePaiements(cin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retourne le reçu détaillé d'un paiement.
     *
     * GET /api/paiement/recu?numeroTransaction=TXN-...
     */
    @GetMapping("/recu")
    public ResponseEntity<?> getRecu(@RequestParam String numeroTransaction) {
        try {
            return ResponseEntity.ok(paiementService.getRecu(numeroTransaction));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
