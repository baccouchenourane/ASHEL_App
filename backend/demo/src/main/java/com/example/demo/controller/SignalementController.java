package com.example.demo.controller;

import com.example.demo.model.Signalement;
import com.example.demo.service.SignalementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/signalements")
public class SignalementController {

    @Autowired
    private SignalementService signalementService;

@PostMapping(consumes = "multipart/form-data")
public ResponseEntity<Signalement> creer(
        @RequestParam String cin,
        @RequestParam String categorie,
        @RequestParam String description,
        @RequestParam(required = false) List<MultipartFile> photos
) throws Exception {
    return ResponseEntity.ok(signalementService.creer(cin, categorie, description, photos));
}

@GetMapping("/citoyen/{cin}")
public ResponseEntity<List<Signalement>> getByCin(@PathVariable String cin) {
    return ResponseEntity.ok(signalementService.getByCin(cin));
}
    @GetMapping
    public ResponseEntity<List<Signalement>> getAll() {
        return ResponseEntity.ok(signalementService.getAll());
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Signalement> changerStatut(
            @PathVariable Long id,
            @RequestParam String statut) {
        return ResponseEntity.ok(signalementService.changerStatut(id, statut));
    }
}