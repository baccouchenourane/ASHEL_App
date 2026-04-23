package com.example.demo.service;

import com.example.demo.model.Notification;
import java.util.List;

public interface NotificationService {

    /**
     * Create a generic notification
     */
    Notification createNotification(String cin, String type, String message);

    /**
     * Create a signalement notification
     */
    Notification createSignalementNotification(String cin, Long signalementId, String message);

    /**
     * Create a reclamation notification
     */
    Notification createReclamationNotification(String cin, Long reclamationId, String message);

    /**
     * Create notification for signalement (legacy method)
     */
    void createNotificationForSignalement(String cin, Long signalementId, String message);

    /**
     * Create notification for reclamation (legacy method)
     */
    void createNotificationForReclamation(String cin, Long reclamationId, String message);

    /**
     * Get all notifications for a citizen
     */
    List<Notification> getNotificationsByCin(String cin);

    /**
     * Get unread notifications for a citizen
     */
    List<Notification> getUnreadNotificationsByCin(String cin);

    /**
     * Get count of unread notifications for a citizen
     */
    long getUnreadCountByCin(String cin);

    /**
     * Mark a notification as read
     */
    Notification markAsRead(Long notificationId);

    /**
     * Mark all notifications as read for a citizen
     */
    void markAllAsRead(String cin);

    /**
     * Delete a notification
     */
    void deleteNotification(Long notificationId);

    /**
     * Delete old notifications
     */
    void deleteOldNotifications(int daysOld);
}
