package com.example.demo.controller;

import com.example.demo.entity.Signalement;
import com.example.demo.entity.StatutSignalement;
import com.example.demo.service.SignalementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/signalements")
public class SignalementController {

    @Autowired
    private SignalementService signalementService;

    // ── POST /api/signalements ────────────────────────────────────────────────

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Signalement> creer(
            @RequestParam String titre,
            @RequestParam String description,
            @RequestParam String categorie,
            @RequestParam Long citoyenId,
            @RequestParam(required = false) List<MultipartFile> photos
    ) throws Exception {
        return ResponseEntity.ok(
            signalementService.creer(titre, description, categorie, citoyenId, photos)
        );
    }

    // ── GET /api/signalements ─────────────────────────────────────────────────

    /** Returns all signalements (admin use), newest first. */
    @GetMapping
    public ResponseEntity<List<Signalement>> getAll() {
        return ResponseEntity.ok(signalementService.getAll());
    }

    // ── GET /api/signalements/citoyen/{id} ────────────────────────────────────

    /** Returns signalements for a specific citizen, newest first. */
    @GetMapping("/citoyen/{id}")
    public ResponseEntity<List<Signalement>> getByCitoyen(@PathVariable Long id) {
        return ResponseEntity.ok(signalementService.getByCitoyen(id));
    }

    // ── GET /api/signalements/statut/{statut} ─────────────────────────────────

    /** Returns all signalements filtered by status. */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<?> getByStatut(@PathVariable String statut) {
        try {
            StatutSignalement s = StatutSignalement.valueOf(statut.toUpperCase());
            return ResponseEntity.ok(signalementService.getByStatut(s));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Statut invalide : " + statut)
            );
        }
    }

    // ── PATCH /api/signalements/{id}/statut ───────────────────────────────────

    /**
     * Updates the status of a signalement.
     * Accepts statut as a query param: EN_COURS | RESOLU | REJETE | NOUVEAU
     */
    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(
            @PathVariable Long id,
            @RequestParam String statut
    ) {
        try {
            return ResponseEntity.ok(signalementService.changerStatut(id, statut));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
