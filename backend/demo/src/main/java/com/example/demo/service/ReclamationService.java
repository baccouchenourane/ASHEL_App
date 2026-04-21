package com.example.demo.service;

import com.example.demo.model.Reclamation;
import com.example.demo.repository.ReclamationRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // ── Create ────────────────────────────────────────────────────────────────

    public Reclamation creer(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Reclamation> getAll() {
        return reclamationRepository.findAllByOrderByDateDepotDesc();
    }

    public List<Reclamation> getByCitoyen(String citoyenCin) {
        return reclamationRepository.findByCitoyenCinOrderByDateDepotDesc(citoyenCin);
    }

    // ── Change status + auto-notification ────────────────────────────────────

    /**
     * Changes the status of a réclamation and automatically creates
     * a notification for the citizen.
     *
     * @param id     the réclamation ID
     * @param statut the new status string (DEPOSEE | EN_TRAITEMENT | CLOTUREE)
     */
    public Reclamation changerStatut(Long id, String statut) {
        Reclamation r = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable : " + id));

        r.setStatut(com.example.demo.model.StatutReclamation.valueOf(statut.toUpperCase()));
        Reclamation saved = reclamationRepository.save(r);

        // Resolve citizen numeric ID from CIN for the notification
        if (saved.getCitoyenCin() != null) {
            userRepository.findByCin(saved.getCitoyenCin()).ifPresent(user ->
                notificationService.creerPourReclamation(
                    user.getId(),
                    saved.getId(),
                    statut.toUpperCase()
                )
            );
        }

        return saved;
    }
}
