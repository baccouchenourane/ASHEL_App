package com.example.demo.service;

import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Notification createNotification(String cin, String type, String message) {
        Notification notification = new Notification(cin, type, message, "NON_LU");
        return notificationRepository.save(notification);
    }

    @Override
    public Notification createSignalementNotification(String cin, Long signalementId, String message) {
        Notification notification = new Notification(cin, "SIGNALEMENT", message, "NON_LU");
        notification.setSignalementId(signalementId);
        return notificationRepository.save(notification);
    }

    @Override
    public Notification createReclamationNotification(String cin, Long reclamationId, String message) {
        Notification notification = new Notification(cin, "RECLAMATION", message, "NON_LU");
        notification.setReclamationId(reclamationId);
        return notificationRepository.save(notification);
    }

    @Override
    public void createNotificationForSignalement(String cin, Long signalementId, String message) {
        createSignalementNotification(cin, signalementId, message);
    }

    @Override
    public void createNotificationForReclamation(String cin, Long reclamationId, String message) {
        createReclamationNotification(cin, reclamationId, message);
    }

    @Override
    public List<Notification> getNotificationsByCin(String cin) {
        return notificationRepository.findByCinOrderByDateCreationDesc(cin);
    }

    @Override
    public List<Notification> getUnreadNotificationsByCin(String cin) {
        return notificationRepository.findByCinAndStatutOrderByDateCreationDesc(cin, "NON_LU");
    }

    @Override
    public long getUnreadCountByCin(String cin) {
        return notificationRepository.countByCinAndStatut(cin, "NON_LU");
    }

    @Override
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        notification.setStatut("LU");
        return notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String cin) {
        List<Notification> unreadNotifications = getUnreadNotificationsByCin(cin);
        unreadNotifications.forEach(n -> n.setStatut("LU"));
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Override
    public void deleteOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        // This would require a custom query in the repository
        // For now, we'll skip this implementation
    }
}
