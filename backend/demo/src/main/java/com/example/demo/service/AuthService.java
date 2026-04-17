package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // Import nécessaire
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private PasswordEncoder passwordEncoder; // Injecté depuis SecurityConfig

    /**
     * --- LOGIN ---
     * Utilise BCrypt pour comparer le mot de passe saisi avec celui haché en base.
     */
    public String login(String cin, String password) {
        User user = userRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // ✅ SÉCURITÉ : On compare avec BCrypt, jamais avec .equals()
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // On génère l'OTP (tu peux faire un System.out.println dans OtpService pour le voir)
        return otpService.generateOtp(cin);
    }

    /**
     * --- VERIFY OTP ---
     */
    public boolean verifyOtp(String cin, String code) {
        return otpService.verifyOtp(cin, code);
    }

    /**
     * --- REGISTER ---
     * Hache le mot de passe avant de l'enregistrer dans MySQL.
     */
    public User register(String cin, String nom, String password, String phone) {
        if (userRepository.findByCin(cin).isPresent()) {
            throw new RuntimeException("Cet utilisateur existe déjà (CIN déjà enregistré)");
        }

        User user = new User();
        user.setCin(cin);
        user.setNom(nom);
        
        // ✅ SÉCURITÉ : On hache le mot de passe avant de sauvegarder
        user.setPassword(passwordEncoder.encode(password));
        
        user.setPhone(phone);

        return userRepository.save(user);
    }

    /**
     * --- RESEND OTP ---
     */
    public String resendOtp(String cin) {
        // Vérifie si l'utilisateur existe avant de renvoyer un OTP
        if (!userRepository.existsByCin(cin)) {
            throw new RuntimeException("Utilisateur inconnu");
        }
        return otpService.generateOtp(cin);
    }
}