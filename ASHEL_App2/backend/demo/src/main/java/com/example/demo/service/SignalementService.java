package com.example.demo.service;

import com.example.demo.entity.Signalement;
import com.example.demo.entity.StatutSignalement;
import com.example.demo.repository.SignalementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class SignalementService {

    @Autowired
    private SignalementRepository signalementRepository;

    private static final String UPLOAD_DIR = "uploads/signalements/";

    // ── Create ────────────────────────────────────────────────────────────────

    public Signalement creer(String titre, String description,
                              String categorie, Long citoyenId,
                              List<MultipartFile> photos) throws IOException {

        Signalement s = new Signalement();
        s.setTitre(titre);
        s.setDescription(description);
        s.setCategorie(categorie);
        s.setCitoyenId(citoyenId);
        s.setStatut(StatutSignalement.NOUVEAU);

        if (photos != null && !photos.isEmpty()) {
            List<String> paths = new ArrayList<>();
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            for (MultipartFile photo : photos) {
                String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + filename);
                Files.copy(photo.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                paths.add(filename);
            }
            s.setPhotos(String.join(",", paths));
        }

        return signalementRepository.save(s);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    /** Returns all signalements ordered by creation date descending. */
    public List<Signalement> getAll() {
        return signalementRepository.findAllByOrderByDateCreationDesc();
    }

    /** Returns signalements for a specific citizen, newest first. */
    public List<Signalement> getByCitoyen(Long citoyenId) {
        return signalementRepository.findByCitoyenIdOrderByDateCreationDesc(citoyenId);
    }

    /** Returns all signalements with a given status. */
    public List<Signalement> getByStatut(StatutSignalement statut) {
        return signalementRepository.findByStatut(statut);
    }

    // ── Update status ─────────────────────────────────────────────────────────

    /**
     * Changes the status of a signalement.
     *
     * @param id     the signalement ID
     * @param statut the new status string (must match StatutSignalement enum name)
     * @throws IllegalArgumentException if the status value is invalid
     * @throws RuntimeException         if the signalement is not found
     */
    public Signalement changerStatut(Long id, String statut) {
        StatutSignalement newStatut;
        try {
            newStatut = StatutSignalement.valueOf(statut.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Statut invalide : '" + statut + "'. Valeurs acceptées : NOUVEAU, EN_COURS, RESOLU, REJETE"
            );
        }

        Signalement s = signalementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé avec l'id : " + id));

        s.setStatut(newStatut);
        return signalementRepository.save(s);
    }
}
