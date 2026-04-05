package com.example.demo.service;

import com.example.demo.entity.Signalement;
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

    private final String UPLOAD_DIR = "uploads/signalements/";

    public Signalement creer(String titre, String description,
                              String categorie, Long citoyenId,
                              List<MultipartFile> photos) throws IOException {
        Signalement s = new Signalement();
        s.setTitre(titre);
        s.setDescription(description);
        s.setCategorie(categorie);
        s.setCitoyenId(citoyenId);

        if (photos != null && !photos.isEmpty()) {
            List<String> paths = new ArrayList<>();
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            for (MultipartFile photo : photos) {
                String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + filename);
                Files.copy(photo.getInputStream(), path,
                        StandardCopyOption.REPLACE_EXISTING);
                paths.add(filename);
            }
            s.setPhotos(String.join(",", paths));
        }

        return signalementRepository.save(s);
    }

    public List<Signalement> getAll() {
        return signalementRepository.findAll();
    }

    public List<Signalement> getByCitoyen(Long citoyenId) {
        return signalementRepository.findByCitoyenId(citoyenId);
    }

    public Signalement changerStatut(Long id, String statut) {
        Signalement s = signalementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement non trouvé"));
        s.setStatut(statut);
        return signalementRepository.save(s);
    }
}