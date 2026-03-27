package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    /**
     * Vérifie les credentials et génère un OTP si OK.
     * Retourne le code OTP (simulé - en prod l'envoyer par SMS seulement).
     */
    public String login(String cin, String password) {
        Optional<User> userOpt = userRepository.findByCin(cin);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("CIN introuvable.");
        }

        User user = userOpt.get();

        // En production : utiliser BCryptPasswordEncoder pour comparer
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Mot de passe incorrect.");
        }

        return otpService.generateOtp(cin);
    }

    /**
     * Vérifie l'OTP et retourne les infos utilisateur si valide.
     */
    public User verifyOtp(String cin, String code) {
        boolean valid = otpService.verifyOtp(cin, code);
        if (!valid) {
            throw new RuntimeException("Code OTP invalide ou expiré.");
        }
        return userRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));
    }

    /**
     * Inscription d'un nouvel utilisateur.
     */
    public User register(String cin, String nom, String password, String phone) {
        if (userRepository.existsByCin(cin)) {
            throw new RuntimeException("Ce CIN est déjà enregistré.");
        }
        // En production : encoder le mot de passe avec BCrypt
        User user = new User(cin, nom, password, phone);
        return userRepository.save(user);
    }
}
