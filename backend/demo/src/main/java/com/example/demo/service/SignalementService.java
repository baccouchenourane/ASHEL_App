package com.example.demo.service;

import com.example.demo.model.Signalement;
import com.example.demo.repository.SignalementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class SignalementService {

    
    @Autowired
    private SignalementRepository signalementRepository;

    @Autowired
    private NotificationService notificationService;

    public Signalement createSignalement(Signalement signalement) {
        signalement.setReference(UUID.randomUUID().toString().substring(0, 8));
        if (signalement.getStatut() == null) {
            signalement.setStatut("NOUVEAU");
        }
        Signalement saved = signalementRepository.save(signalement);

        // Create notification
        notificationService.createNotificationForSignalement(
                saved.getCin(),  // Changed from getCitoyenId
                saved.getId(),
                "Votre signalement " + saved.getReference() + " a été créé avec succès"
        );

        return saved;
    }

    public Signalement updateSignalementStatus(Long id, String statut, String noteInterne) {
        Signalement signalement = signalementRepository.findById(id).orElse(null);
        if (signalement != null) {
            signalement.setStatut(statut);
            if (noteInterne != null) {
                signalement.setNoteInterne(noteInterne);
            }
            Signalement saved = signalementRepository.save(signalement);

            notificationService.createNotificationForSignalement(
                    saved.getCin(),  // Changed from getCitoyenId
                    saved.getId(),
                    "Votre signalement " + saved.getReference() + " est maintenant " + statut
            );

            return saved;
        }
        return null;
    }

    public List<Signalement> getSignalementsByCin(String cin) {
        return signalementRepository.findByCin(cin);
    }

    public List<Signalement> getAllSignalements() {
        return signalementRepository.findAll();
    }

    public Signalement changerStatut(Long id, String statut) {
        Signalement signalement = signalementRepository.findById(id).orElse(null);
        if (signalement != null) {
            signalement.setStatut(statut);
            Signalement saved = signalementRepository.save(signalement);

            // Create notification with appropriate message
            String message = getSignalementStatusMessage(statut, saved.getReference());
            notificationService.createNotificationForSignalement(
                    saved.getCin(),
                    saved.getId(),
                    message
            );

            return saved;
        }
        return null;
    }

    public List<Signalement> getByCitoyen(Long id) {
        // Convert Long id to String cin for database query
        return signalementRepository.findByCin(String.valueOf(id));
    }

    public Signalement creer(String titre, String description, String categorie, Long citoyenId, List<MultipartFile> photos) throws Exception {
        Signalement signalement = new Signalement();
        signalement.setTitre(titre);
        signalement.setDescription(description);
        signalement.setCategorie(categorie);
        signalement.setCin(String.valueOf(citoyenId));
        signalement.setReference("SIG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        signalement.setStatut("NOUVEAU");
        
        // TODO: Handle photo uploads if needed
        // For now, just save without photos
        
        Signalement saved = signalementRepository.save(signalement);

        notificationService.createNotificationForSignalement(
                saved.getCin(),
                saved.getId(),
                "Votre signalement " + saved.getReference() + " a été créé avec succès"
        );

        return saved;
    }

    public List<Signalement> getAll() {
        return signalementRepository.findAll();
    }

    // Helper method to generate status message
    private String getSignalementStatusMessage(String statut, String reference) {
        switch (statut) {
            case "EN_COURS":
                return "Votre signalement " + reference + " est en cours de traitement.";
            case "TRAITE":
                return "Votre signalement " + reference + " a été résolu.";
            case "REJETE":
                return "Votre signalement " + reference + " a été rejeté.";
            default:
                return "Votre signalement " + reference + " a été mis à jour.";
        }
    }
}