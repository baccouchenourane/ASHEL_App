package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// On ne met pas @CrossOrigin ici si on a déjà CorsConfig.java (pour éviter les conflits)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");
            String password = body.get("password");
            String otp = authService.login(cin, password);

            // Pour ton PFA : on retourne l'OTP pour simuler la réception SMS
            return ResponseEntity.ok(Map.of(
                "message", "OTP envoyé",
                "otp", otp 
            ));
        } catch (RuntimeException e) {
            // Utilise "message" au lieu de "error" pour être cohérent avec api.js
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");
            // ON UTILISE "code" pour matcher exactement le paramètre de AuthService
            String otp = body.get("otp"); 
            
            // Si dans ton AuthService c'est (cin, code), assure-toi que la variable passée ici est la bonne
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
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

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
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}