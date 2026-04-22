package com.example.demo.service;

import com.example.demo.model.Reclamation;
import com.example.demo.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    // Create a new reclamation
    public Reclamation creer(Reclamation reclamation) {
        if (reclamation.getReference() == null || reclamation.getReference().isEmpty()) {
            reclamation.setReference("REC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (reclamation.getStatut() == null) {
            reclamation.setStatut("OUVERTE");
        }
        if (reclamation.getDateCreation() == null) {
            reclamation.setDateCreation(LocalDateTime.now());
        }
        return reclamationRepository.save(reclamation);
    }

    // Get all reclamations
    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAllByOrderByDateCreationDesc();
    }

    // Get reclamations by citizen CIN
    public List<Reclamation> getByCitoyen(String cin) {
        return reclamationRepository.findByCinOrderByDateCreationDesc(cin);
    }

    // Change reclamation status
    public Reclamation changerStatut(Long id, String statut) {
        // Validate statut
        if (!statut.matches("OUVERTE|EN_COURS|RESOLUE|FERMEE")) {
            throw new IllegalArgumentException("Statut invalide. Valeurs acceptées: OUVERTE, EN_COURS, RESOLUE, FERMEE");
        }

        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id: " + id));

        reclamation.setStatut(statut);
        reclamation.setDateMaj(LocalDateTime.now());

        return reclamationRepository.save(reclamation);
    }

    // Get reclamation by ID
    public Reclamation getReclamationById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id: " + id));
    }

    // Delete reclamation
    public void deleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }

    // Update reclamation
    public Reclamation updateReclamation(Long id, Reclamation reclamationDetails) {
        Reclamation reclamation = getReclamationById(id);
        reclamation.setSujet(reclamationDetails.getSujet());
        reclamation.setDescription(reclamationDetails.getDescription());
        reclamation.setTypeReclamation(reclamationDetails.getTypeReclamation());
        reclamation.setDateMaj(LocalDateTime.now());
        return reclamationRepository.save(reclamation);
    }

    // Get reclamations by status
    public List<Reclamation> getReclamationsByStatut(String statut) {
        return reclamationRepository.findByStatut(statut);
    }

    // Count reclamations by citizen
    public long countByCin(String cin) {
        return reclamationRepository.countByCin(cin);
    }
}