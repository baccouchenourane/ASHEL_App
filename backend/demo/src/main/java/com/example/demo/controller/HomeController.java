package com.example.demo.controller;

import com.example.demo.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "http://localhost:5173")
public class HomeController {

    @Autowired
    private HomeService homeService;

    // ─── DASHBOARD COMPLET ───────────────────────────────────────────────────
    // Le CIN est passé en paramètre (depuis localStorage du frontend)
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestParam String cin) {
        try {
            return ResponseEntity.ok(homeService.getDashboard(cin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PROFIL ──────────────────────────────────────────────────────────────
    @GetMapping("/profil")
    public ResponseEntity<?> getProfil(@RequestParam String cin) {
        try {
            Map<String, Object> dashboard = homeService.getDashboard(cin);
            return ResponseEntity.ok(dashboard.get("profil"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── IDENTITÉ DIGITALE ───────────────────────────────────────────────────
    @GetMapping("/identite-digitale")
    public ResponseEntity<?> getIdentiteDigitale(@RequestParam String cin) {
        try {
            Map<String, Object> dashboard = homeService.getDashboard(cin);
            return ResponseEntity.ok(dashboard.get("identiteDigitale"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── DOCUMENTS ───────────────────────────────────────────────────────────
    @GetMapping("/documents")
    public ResponseEntity<?> getDocuments(@RequestParam String cin) {
        try {
            Map<String, Object> dashboard = homeService.getDashboard(cin);
            return ResponseEntity.ok(dashboard.get("documents"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── NOTIFICATIONS ───────────────────────────────────────────────────────
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@RequestParam String cin) {
        try {
            Map<String, Object> dashboard = homeService.getDashboard(cin);
            return ResponseEntity.ok(dashboard.get("notificationsServices"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── LOGOUT ──────────────────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String cin = body.get("cin");
        homeService.logout(cin);
        return ResponseEntity.ok(Map.of("success", true, "message", "Déconnexion réussie"));
    }
}