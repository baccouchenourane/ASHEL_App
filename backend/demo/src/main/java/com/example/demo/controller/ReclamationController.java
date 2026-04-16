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
}