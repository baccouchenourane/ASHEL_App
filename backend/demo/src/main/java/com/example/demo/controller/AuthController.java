package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * LOGIN : génère un OTP
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");
            String password = body.get("password");

            if (cin == null || password == null || cin.isEmpty() || password.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "CIN ou mot de passe manquant"));
            }

            String generatedOtp = authService.login(cin, password);

            return ResponseEntity.ok(Map.of(
                    "message", "OTP envoyé",
                    "otp", generatedOtp
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * VERIFY OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");
            String otp = body.get("otp");

            if (cin == null || otp == null || cin.isEmpty() || otp.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "CIN ou OTP manquant"));
            }

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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * RESEND OTP
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");

            if (cin == null || cin.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "CIN manquant"));
            }

            String newOtp = authService.resendOtp(cin);

            return ResponseEntity.ok(Map.of(
                    "message", "Nouveau code OTP envoyé",
                    "otp", newOtp
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Impossible de renvoyer le code : " + e.getMessage()));
        }
    }

    /**
     * REGISTER
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            String cin = body.get("cin");
            String nom = body.get("nom");
            String password = body.get("password");
            String phone = body.get("phone");

            if (cin == null || nom == null || password == null || phone == null ||
                cin.isEmpty() || nom.isEmpty() || password.isEmpty() || phone.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Tous les champs sont obligatoires"));
            }

            User user = authService.register(cin, nom, password, phone);

            return ResponseEntity.ok(Map.of(
                    "message", "Compte créé avec succès",
                    "cin", user.getCin()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}