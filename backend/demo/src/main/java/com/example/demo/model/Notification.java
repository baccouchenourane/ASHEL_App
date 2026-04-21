package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "citoyen_id", nullable = false)
    private Long citoyenId;

    /**
     * Generic reference to the source entity (signalement_id or reclamation_id).
     * Kept as signalement_id in DB for backward compatibility.
     */
    @Column(name = "signalement_id")
    private Long referenceId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    /** NON_LU | LU */
    @Column(nullable = false, length = 10)
    private String statut = "NON_LU";

    /**
     * SIGNALEMENT | RECLAMATION
     * Allows the frontend to show different icons per type.
     */
    @Column(nullable = false, length = 20)
    private String type = "SIGNALEMENT";

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
    }

}
