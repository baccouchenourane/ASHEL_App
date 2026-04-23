package com.example.demo.repository;

import com.example.demo.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find all notifications for a citizen, ordered by date descending
    List<Notification> findByCinOrderByDateCreationDesc(String cin);

    // Find unread notifications for a citizen
    List<Notification> findByCinAndStatutOrderByDateCreationDesc(String cin, String statut);

    // Find notifications by type
    List<Notification> findByTypeOrderByDateCreationDesc(String type);

    // Find notifications by cin and type
    List<Notification> findByCinAndTypeOrderByDateCreationDesc(String cin, String type);

    // Count unread notifications for a citizen
    long countByCinAndStatut(String cin, String statut);

    // Find notifications by signalement ID
    List<Notification> findBySignalementId(Long signalementId);

    // Find notifications by reclamation ID
    List<Notification> findByReclamationId(Long reclamationId);
}
