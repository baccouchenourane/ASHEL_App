package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Stockage en mémoire : cin -> code OTP
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public String generateOtp(String cin) {
        String code = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(cin, code);
        // En production : envoyer par SMS via Twilio ou autre
        System.out.println(">>> [SIMULÉ] OTP pour " + cin + " : " + code);
        return code;
    }

    public boolean verifyOtp(String cin, String code) {
        String stored = otpStore.get(cin);
        if (stored != null && stored.equals(code)) {
            otpStore.remove(cin); // invalider après usage
            return true;
        }
        return false;
    }
}
