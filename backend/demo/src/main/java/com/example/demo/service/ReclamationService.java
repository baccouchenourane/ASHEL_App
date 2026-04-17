package com.example.demo.service;

import com.example.demo.model.Reclamation;
import com.example.demo.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    public Reclamation creer(Reclamation reclamation) {
        reclamation.setReference(genererReference());
        reclamation.setDateCreation(LocalDateTime.now());
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> getAll() {
        return reclamationRepository.findAll();
    }

    // Recherche par CIN (et non plus par citoyenId Long)
    public List<Reclamation> getByCin(String cin) {
        return reclamationRepository.findByCinOrderByDateCreationDesc(cin);
    }

    private String genererReference() {
        return "REC-" + System.currentTimeMillis() + "-" + (new Random().nextInt(900) + 100);
    }
}