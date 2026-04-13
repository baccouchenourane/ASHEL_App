package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int note;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(nullable = false)
    private String servicePublic;

    private LocalDateTime dateEvaluation = LocalDateTime.now();
    private Long citoyenId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getNote() { return note; }
    public void setNote(int note) { this.note = note; }
    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }
    public String getServicePublic() { return servicePublic; }
    public void setServicePublic(String s) { this.servicePublic = s; }
    public LocalDateTime getDateEvaluation() { return dateEvaluation; }
    public void setDateEvaluation(LocalDateTime d) { this.dateEvaluation = d; }
    public Long getCitoyenId() { return citoyenId; }
    public void setCitoyenId(Long citoyenId) { this.citoyenId = citoyenId; }
}