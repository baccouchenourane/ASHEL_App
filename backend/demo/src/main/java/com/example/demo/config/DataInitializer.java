package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Utilisateur de test pour le développement
        if (!userRepository.existsByCin("12345678")) {
            userRepository.save(new User("12345678", "Mohamed Ali", "password123", "+21698000000"));
            System.out.println(">>> Utilisateur de test créé : CIN=12345678 / password=password123");
        }
    }
}
