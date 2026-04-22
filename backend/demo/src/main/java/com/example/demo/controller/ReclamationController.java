package com.example.demo.controller;

import com.example.demo.model.Reclamation;
import com.example.demo.service.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "*")
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;

    @PostMapping
    public ResponseEntity<Reclamation> creer(@RequestBody Reclamation reclamation) {
        Reclamation created = reclamationService.creer(reclamation);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Reclamation>> getAll() {
        return ResponseEntity.ok(reclamationService.getAllReclamations());
    }

    @GetMapping("/citoyen/{cin}")
    public ResponseEntity<List<Reclamation>> getByCitoyen(@PathVariable String cin) {
        return ResponseEntity.ok(reclamationService.getByCitoyen(cin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.getReclamationById(id));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(
            @PathVariable Long id,
            @RequestParam String statut) {
        try {
            Reclamation updated = reclamationService.changerStatut(id, statut);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reclamation> updateReclamation(@PathVariable Long id, @RequestBody Reclamation reclamation) {
        Reclamation updated = reclamationService.updateReclamation(id, reclamation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReclamation(@PathVariable Long id) {
        reclamationService.deleteReclamation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Reclamation>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(reclamationService.getReclamationsByStatut(statut));
    }

    @GetMapping("/count/citoyen/{cin}")
    public ResponseEntity<Long> countByCitoyen(@PathVariable String cin) {
        return ResponseEntity.ok(reclamationService.countByCin(cin));
    }
}