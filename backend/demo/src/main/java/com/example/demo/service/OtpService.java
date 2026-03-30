package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Durée de validité d'un OTP : 5 minutes
    private static final long OTP_EXPIRY_SECONDS = 300;

    // Stockage en mémoire : cin -> OtpEntry (code + timestamp)
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    // --- Classe interne pour stocker le code + l'heure de génération ---
    private static class OtpEntry {
        final String code;
        final Instant generatedAt;

        OtpEntry(String code) {
            this.code = code;
            this.generatedAt = Instant.now();
        }

        boolean isExpired() {
            return Instant.now().isAfter(generatedAt.plusSeconds(OTP_EXPIRY_SECONDS));
        }
    }

    // --- Génère et stocke un nouvel OTP ---
    public String generateOtp(String cin) {
        String code = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(cin, new OtpEntry(code));
        System.out.println(">>> [SIMULÉ] OTP pour " + cin + " : " + code);
        return code;
    }

    // --- Renvoie un nouvel OTP (remplace l'ancien sans condition bloquante) ---
    public String resendOtp(String cin) {
        return generateOtp(cin);
    }

    // --- Vérifie le code soumis par l'utilisateur ---
    public boolean verifyOtp(String cin, String code) {
        OtpEntry entry = otpStore.get(cin);
        if (entry == null || entry.isExpired() || !entry.code.equals(code)) return false;
        otpStore.remove(cin); // Invalide après usage unique
        return true;
    }
}