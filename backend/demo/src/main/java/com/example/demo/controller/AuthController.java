package com.example.demo.controller;
import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Port Vite par défaut
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/login
     * Body: { "cin": "12345678", "password": "motdepasse" }
     * Retourne l'OTP généré (à envoyer par SMS en production)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");
            String password = body.get("password");
            String otp = authService.login(cin, password);

            // En production : ne PAS retourner l'OTP dans la réponse !
            // Ici on le retourne pour la simulation frontend.
            return ResponseEntity.ok(Map.of(
                "message", "OTP envoyé",
                "otp", otp  // À RETIRER en production
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/verify-otp
     * Body: { "cin": "12345678", "otp": "123456" }
     * Retourne les infos de l'utilisateur si valide
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");
            String otp = body.get("otp");
            User user = authService.verifyOtp(cin, otp);

            return ResponseEntity.ok(Map.of(
                "message", "Authentification réussie",
                "user", Map.of(
                    "id", user.getId(),
                    "nom", user.getNom(),
                    "cin", user.getCin()
                )
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/register
     * Body: { "cin": "12345678", "nom": "Mohamed Ali", "password": "...", "phone": "..." }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            User user = authService.register(
                body.get("cin"),
                body.get("nom"),
                body.get("password"),
                body.get("phone")
            );
            return ResponseEntity.ok(Map.of(
                "message", "Compte créé avec succès",
                "cin", user.getCin()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
