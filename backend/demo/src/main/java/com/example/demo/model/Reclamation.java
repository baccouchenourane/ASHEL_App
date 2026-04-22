package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamations")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference", unique = true)
    private String reference;

    @Column(name = "cin", nullable = false)
    private String cin;  // Changed from citoyenCin

    @Column(name = "type_reclamation", nullable = false)
    private String typeReclamation;

    @Column(name = "sujet", nullable = false)
    private String sujet;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "statut", nullable = false)
    private String statut;

    @Column(name = "reference_liee")
    private String referenceLiee;

    @Column(name = "reponse_admin")
    private String reponseAdmin;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_maj")
    private LocalDateTime dateMaj;

    // Constructors
    public Reclamation() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getTypeReclamation() { return typeReclamation; }
    public void setTypeReclamation(String typeReclamation) { this.typeReclamation = typeReclamation; }

    public String getSujet() { return sujet; }
    public void setSujet(String sujet) { this.sujet = sujet; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getReferenceLiee() { return referenceLiee; }
    public void setReferenceLiee(String referenceLiee) { this.referenceLiee = referenceLiee; }

    public String getReponseAdmin() { return reponseAdmin; }
    public void setReponseAdmin(String reponseAdmin) { this.reponseAdmin = reponseAdmin; }

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
            statut = "OUVERTE";
        }
    }
}