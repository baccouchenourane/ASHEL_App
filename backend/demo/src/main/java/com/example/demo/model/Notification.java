package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cin", nullable = false)
    private String cin;  // Changed from citoyenId

    @Column(name = "signalement_id")
    private Long signalementId;  // Changed from referenceId

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "statut", nullable = false)
    private String statut;  // NON_LU or LU

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    // Constructors
    public Notification() {}

    public Notification(String cin, String message, String statut) {
        this.cin = cin;
        this.message = message;
        this.statut = statut;
        this.dateCreation = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public Long getSignalementId() { return signalementId; }
    public void setSignalementId(Long signalementId) { this.signalementId = signalementId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (statut == null) {
            statut = "NON_LU";
        }
    }
}
