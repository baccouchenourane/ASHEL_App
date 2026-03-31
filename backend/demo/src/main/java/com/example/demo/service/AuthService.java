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

    // --- LOGIN ---
    public String login(String cin, String password) {
        User user = userRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return otpService.generateOtp(cin);
    }

    // --- VERIFY OTP ---
    // C'est cette méthode qui permet au Controller de fonctionner
    public boolean verifyOtp(String cin, String code) {
        return otpService.verifyOtp(cin, code);
    }

    // --- REGISTER ---
    public User register(String cin, String nom, String password, String phone) {
        if (userRepository.findByCin(cin).isPresent()) {
            throw new RuntimeException("Cet utilisateur existe déjà");
        }

        User user = new User();
        user.setCin(cin);
        user.setNom(nom);
        user.setPassword(password);
        user.setPhone(phone);

        return userRepository.save(user);
    }

    // --- RESEND OTP ---
    public String resendOtp(String cin) {
        return otpService.generateOtp(cin);
    }
}