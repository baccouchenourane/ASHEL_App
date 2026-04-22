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

    public List<Signalement> getAll;
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
        return null;
    }

    public List<Signalement> getByCitoyen(Long id) {
        return List.of();
    }

    public Signalement creer(String titre, String description, String categorie, Long citoyenId, List<MultipartFile> photos) {
        return null;
    }

    public List<Signalement> getAll() {
        return List.of();
    }

}