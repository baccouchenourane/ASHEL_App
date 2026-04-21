package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cin", nullable = false)
    private String cin;

    @Column(name = "demande_id")
    private Long demandeId;

    @Column(name = "facture_id")
    private Long factureId;

    @Column(name = "service_public")
    private String servicePublic;

    @Column(name = "note", nullable = false)
    private Integer note;

    @Column(name = "commentaire")
    private String commentaire;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    // Constructors
    public Evaluation() {}

    public Evaluation(String cin, String servicePublic, Integer note, String commentaire) {
        this.cin = cin;
        this.servicePublic = servicePublic;
        this.note = note;
        this.commentaire = commentaire;
        this.dateCreation = LocalDateTime.now();
    }

    public Evaluation(String cin, Long demandeId, Integer note, String commentaire) {
        this.cin = cin;
        this.demandeId = demandeId;
        this.note = note;
        this.commentaire = commentaire;
        this.dateCreation = LocalDateTime.now();
    }

    public Evaluation(String cin, Long factureId, Integer note, String commentaire) {
        this.cin = cin;
        this.factureId = factureId;
        this.note = note;
        this.commentaire = commentaire;
        this.dateCreation = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public Long getDemandeId() {
        return demandeId;
    }

    public void setDemandeId(Long demandeId) {
        this.demandeId = demandeId;
    }

    public Long getFactureId() {
        return factureId;
    }

    public void setFactureId(Long factureId) {
        this.factureId = factureId;
    }

    public String getServicePublic() {
        return servicePublic;
    }

    public void setServicePublic(String servicePublic) {
        this.servicePublic = servicePublic;
    }

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
    }

    @Override
    public String toString() {
        return "Evaluation{" +
                "id=" + id +
                ", cin='" + cin + '\'' +
                ", demandeId=" + demandeId +
                ", factureId=" + factureId +
                ", servicePublic='" + servicePublic + '\'' +
                ", note=" + note +
                ", commentaire='" + commentaire + '\'' +
                ", dateCreation=" + dateCreation +
                '}';
    }
}