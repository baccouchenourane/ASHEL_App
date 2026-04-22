package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "signalements")
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference", unique = true)
    private String reference;

    @Column(name = "cin", nullable = false)
    private String cin;  // Changed from citoyenId

    @Column(name = "titre", nullable = false)
    private String titre;

    @Column(name = "categorie", nullable = false)
    private String categorie;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "statut", nullable = false)
    private String statut;

    @Column(name = "photos")
    private String photos;

    @Column(name = "url_capture")
    private String urlCapture;

    @Column(name = "note_interne")
    private String noteInterne;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_maj")
    private LocalDateTime dateMaj;

    // Constructors
    public Signalement() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getPhotos() { return photos; }
    public void setPhotos(String photos) { this.photos = photos; }

    public String getUrlCapture() { return urlCapture; }
    public void setUrlCapture(String urlCapture) { this.urlCapture = urlCapture; }

    public String getNoteInterne() { return noteInterne; }
    public void setNoteInterne(String noteInterne) { this.noteInterne = noteInterne; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateMaj() { return dateMaj; }
    public void setDateMaj(LocalDateTime dateMaj) { this.dateMaj = dateMaj; }

    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (statut == null) {
            statut = "NOUVEAU";
        }
    }
}