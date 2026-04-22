package com.example.demo.service;

import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(String cin, String message) {
        Notification notification = new Notification();
        notification.setCin(cin);  // Changed from setCitoyenId
        notification.setMessage(message);
        notification.setStatut("NON_LU");
        return notificationRepository.save(notification);
    }

    public Notification createNotificationForSignalement(String cin, Long signalementId, String message) {
        Notification notification = new Notification();
        notification.setCin(cin);  // Changed from setCitoyenId
        notification.setSignalementId(signalementId);  // Changed from setReferenceId
        notification.setMessage(message);
        notification.setStatut("NON_LU");
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByCin(String cin) {
        return notificationRepository.findByCinOrderByDateCreationDesc(cin);
    }

    public long getUnreadCount(String cin) {
        return notificationRepository.countByCinAndStatut(cin, "NON_LU");
    }

    public void markAllAsRead(String cin) {
        notificationRepository.markAllAsRead(cin);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setStatut("LU");
            notificationRepository.save(notification);
        }
    }
}