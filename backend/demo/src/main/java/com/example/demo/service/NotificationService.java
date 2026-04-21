package com.example.demo.service;

import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // ── Message templates per type + statut ───────────────────────────────────

    private static final Map<String, String> MESSAGES_SIGNALEMENT = Map.of(
        "EN_COURS", "Votre signalement est en cours de traitement.",
        "RESOLU",   "Votre signalement a été résolu. Merci pour votre contribution !",
        "REJETE",   "Votre signalement a été rejeté après examen.",
        "NOUVEAU",  "Votre signalement a été réinitialisé."
    );

    private static final Map<String, String> MESSAGES_RECLAMATION = Map.of(
        "EN_TRAITEMENT", "Votre réclamation est en cours de traitement.",
        "CLOTUREE",      "Votre réclamation a été clôturée.",
        "DEPOSEE",       "Votre réclamation a bien été enregistrée."
    );

    // ── Create for signalement ────────────────────────────────────────────────

    public Notification creerPourChangementStatut(Long citoyenId, Long signalementId, String statut) {
        String message = MESSAGES_SIGNALEMENT.getOrDefault(
            statut,
            "Le statut de votre signalement a été mis à jour : " + statut
        );
        Notification n = new Notification();
        n.setCitoyenId(citoyenId);
        n.setReferenceId(signalementId);
        n.setMessage(message);
        n.setStatut("NON_LU");
        n.setType("SIGNALEMENT");
        return notificationRepository.save(n);
    }

    // ── Create for réclamation ────────────────────────────────────────────────

    public Notification creerPourReclamation(Long citoyenId, Long reclamationId, String statut) {
        String message = MESSAGES_RECLAMATION.getOrDefault(
            statut,
            "Le statut de votre réclamation a été mis à jour : " + statut
        );
        Notification n = new Notification();
        n.setCitoyenId(citoyenId);
        n.setReferenceId(reclamationId);
        n.setMessage(message);
        n.setStatut("NON_LU");
        n.setType("RECLAMATION");
        return notificationRepository.save(n);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<Notification> getByCitoyen(Long citoyenId) {
        return notificationRepository.findByCitoyenIdOrderByDateCreationDesc(citoyenId);
    }

    public long countUnread(Long citoyenId) {
        return notificationRepository.countByCitoyenIdAndStatut(citoyenId, "NON_LU");
    }

    // ── Mark as read ──────────────────────────────────────────────────────────

    public Notification marquerLue(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable : " + id));
        n.setStatut("LU");
        return notificationRepository.save(n);
    }

    public int marquerToutesLues(Long citoyenId) {
        return notificationRepository.markAllAsRead(String.valueOf(citoyenId));
    }
}
