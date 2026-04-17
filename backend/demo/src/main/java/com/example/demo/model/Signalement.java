package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "signalements")
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String reference;

    @Column(nullable = false, length = 8)
    private String cin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categorie categorie;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutSignalement statut = StatutSignalement.NOUVEAU;

    @Column(name = "url_capture", length = 500)
    private String urlCapture;   // stocke le chemin du fichier sauvegardé

    @Column(name = "note_interne", columnDefinition = "TEXT")
    private String noteInterne;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_maj")
    private LocalDateTime dateMaj;

    public enum Categorie {
        BUG, FRAUDE, CONTENU_INAPPROPRIE, SECURITE, AUTRE
    }

    public enum StatutSignalement {
        NOUVEAU, EN_EXAMEN, TRAITE, REJETE
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public Categorie getCategorie() { return categorie; }
    public void setCategorie(Categorie categorie) { this.categorie = categorie; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public StatutSignalement getStatut() { return statut; }
    public void setStatut(StatutSignalement statut) {
        this.statut = statut;
        this.dateMaj = LocalDateTime.now();
    }

    public String getUrlCapture() { return urlCapture; }
    public void setUrlCapture(String urlCapture) { this.urlCapture = urlCapture; }

    public String getNoteInterne() { return noteInterne; }
    public void setNoteInterne(String noteInterne) { this.noteInterne = noteInterne; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateMaj() { return dateMaj; }
    public void setDateMaj(LocalDateTime dateMaj) { this.dateMaj = dateMaj; }
}