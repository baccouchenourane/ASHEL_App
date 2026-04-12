package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamation")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String objet;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    private String statut = "DEPOSEE";
    private LocalDateTime dateDepot = LocalDateTime.now();
    private Long citoyenId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getObjet() { return objet; }
    public void setObjet(String objet) { this.objet = objet; }
    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDateTime getDateDepot() { return dateDepot; }
    public void setDateDepot(LocalDateTime d) { this.dateDepot = d; }
    public Long getCitoyenId() { return citoyenId; }
    public void setCitoyenId(Long citoyenId) { this.citoyenId = citoyenId; }
}