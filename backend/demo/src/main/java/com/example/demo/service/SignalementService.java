package com.example.demo.service;

import com.example.demo.model.Signalement;
import com.example.demo.repository.SignalementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SignalementService {

    @Autowired
    private SignalementRepository signalementRepository;

    private final String UPLOAD_DIR = "uploads/signalements/";

    public Signalement creer(String cin, String categorieStr,
                              String description,
                              List<MultipartFile> photos) throws IOException {
        Signalement s = new Signalement();
        s.setReference(genererReference());
        s.setCin(cin);
        s.setCategorie(Signalement.Categorie.valueOf(categorieStr.toUpperCase()));
        s.setDescription(description);
        s.setDateCreation(LocalDateTime.now());

        if (photos != null && !photos.isEmpty()) {
            List<String> paths = new ArrayList<>();
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            for (MultipartFile photo : photos) {
                String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();
                Files.copy(photo.getInputStream(),
                           Paths.get(UPLOAD_DIR + filename),
                           StandardCopyOption.REPLACE_EXISTING);
                paths.add(filename);
            }
            // On stocke les chemins dans url_capture (séparés par virgule)
            s.setUrlCapture(String.join(",", paths));
        }

        return signalementRepository.save(s);
    }

    public List<Signalement> getAll() {
        return signalementRepository.findAll();
    }

    public List<Signalement> getByCin(String cin) {
        return signalementRepository.findByCinOrderByDateCreationDesc(cin);
    }

    public Signalement changerStatut(Long id, String statut) {
        Signalement s = signalementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement introuvable"));
        s.setStatut(Signalement.StatutSignalement.valueOf(statut.toUpperCase()));
        return signalementRepository.save(s);
    }

    private String genererReference() {
        return "SIG-" + System.currentTimeMillis() + "-" + (new Random().nextInt(900) + 100);
    }
}