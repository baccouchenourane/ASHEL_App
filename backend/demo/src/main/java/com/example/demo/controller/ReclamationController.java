package com.example.demo.controller;

import com.example.demo.model.Reclamation;
import com.example.demo.service.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;

    @PostMapping
    public ResponseEntity<Reclamation> creer(@RequestBody Reclamation reclamation) {
        return ResponseEntity.ok(reclamationService.creer(reclamation));
    }

    @GetMapping
    public ResponseEntity<List<Reclamation>> getAll() {
        return ResponseEntity.ok(reclamationService.getAll());
    }

    @GetMapping("/citoyen/{id}")
    public ResponseEntity<List<Reclamation>> getByCitoyen(@PathVariable String id) {
        return ResponseEntity.ok(reclamationService.getByCitoyen(id));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(
            @PathVariable Long id,
            @RequestParam String statut) {
        try {
            return ResponseEntity.ok(reclamationService.changerStatut(id, statut));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Statut invalide : " + statut));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}