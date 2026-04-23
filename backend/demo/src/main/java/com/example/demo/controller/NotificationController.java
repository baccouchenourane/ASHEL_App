package com.example.demo.controller;

import com.example.demo.model.Notification;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Get all notifications for a citizen
     */
    @GetMapping("/citoyen/{cin}")
    public ResponseEntity<List<Notification>> getNotificationsByCin(@PathVariable String cin) {
        List<Notification> notifications = notificationService.getNotificationsByCin(cin);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications for a citizen
     */
    @GetMapping("/citoyen/{cin}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByCin(@PathVariable String cin) {
        List<Notification> notifications = notificationService.getUnreadNotificationsByCin(cin);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get count of unread notifications for a citizen
     */
    @GetMapping("/citoyen/{cin}/unread-count")
    public ResponseEntity<Long> getUnreadCountByCin(@PathVariable String cin) {
        long count = notificationService.getUnreadCountByCin(cin);
        return ResponseEntity.ok(count);
    }

    /**
     * Mark a notification as read
     */
    @PatchMapping("/{id}/mark-read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    /**
     * Mark all notifications as read for a citizen
     */
    @PatchMapping("/citoyen/{cin}/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String cin) {
        notificationService.markAllAsRead(cin);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Create test notifications (for development/testing)
     */
    @PostMapping("/test/create")
    public ResponseEntity<String> createTestNotifications(@RequestParam(required = false) String cin) {
        try {
            // Use provided CIN or default test CIN
            String targetCin = (cin != null && !cin.isEmpty()) ? cin : "12345678";
            
            // Create test SIGNALEMENT notification
            notificationService.createSignalementNotification(
                targetCin,
                1L,
                "Nouveau signalement reçu"
            );
            
            // Create test RECLAMATION notification
            notificationService.createReclamationNotification(
                targetCin,
                1L,
                "Nouvelle réclamation reçue"
            );
            
            return ResponseEntity.ok("Test notifications created successfully for CIN: " + targetCin);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating test notifications: " + e.getMessage());
        }
    }
}
