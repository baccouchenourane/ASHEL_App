package com.example.demo.service;

import com.example.demo.model.Reclamation;
import com.example.demo.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    public Reclamation creer(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> getAll() {
        return reclamationRepository.findAll();
    }

    public List<Reclamation> getByCitoyen(String citoyenCin) {
        return reclamationRepository.findByCitoyenCin(citoyenCin);
    }
}