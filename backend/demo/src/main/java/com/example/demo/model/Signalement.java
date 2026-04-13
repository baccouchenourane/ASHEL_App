package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "signalement")
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String categorie;

    private String statut = "NOUVEAU";
    private LocalDateTime dateCreation = LocalDateTime.now();
    private Long citoyenId;

    @Column(columnDefinition = "TEXT")
    private String photos;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime d) { this.dateCreation = d; }
    public Long getCitoyenId() { return citoyenId; }
    public void setCitoyenId(Long citoyenId) { this.citoyenId = citoyenId; }
    public String getPhotos() { return photos; }
    public void setPhotos(String photos) { this.photos = photos; }
}