package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamations")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String reference;

    @Column(nullable = false, length = 8)
    private String cin;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_reclamation", nullable = false)
    private TypeReclamation typeReclamation;

    @Column(nullable = false)
    private String sujet;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReclamation statut = StatutReclamation.OUVERTE;

    @Column(name = "reference_liee", length = 50)
    private String referenceLiee;

    @Column(name = "reponse_admin", columnDefinition = "TEXT")
    private String reponseAdmin;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_maj")
    private LocalDateTime dateMaj;

    public enum TypeReclamation {
        DOCUMENT, PAIEMENT, FACTURE, SERVICE, AUTRE
    }

    public enum StatutReclamation {
        OUVERTE, EN_COURS, RESOLUE, FERMEE
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public TypeReclamation getTypeReclamation() { return typeReclamation; }
    public void setTypeReclamation(TypeReclamation typeReclamation) { this.typeReclamation = typeReclamation; }

    public String getSujet() { return sujet; }
    public void setSujet(String sujet) { this.sujet = sujet; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public StatutReclamation getStatut() { return statut; }
    public void setStatut(StatutReclamation statut) {
        this.statut = statut;
        this.dateMaj = LocalDateTime.now();
    }

    public String getReferenceLiee() { return referenceLiee; }
    public void setReferenceLiee(String referenceLiee) { this.referenceLiee = referenceLiee; }

    public String getReponseAdmin() { return reponseAdmin; }
    public void setReponseAdmin(String reponseAdmin) { this.reponseAdmin = reponseAdmin; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateMaj() { return dateMaj; }
    public void setDateMaj(LocalDateTime dateMaj) { this.dateMaj = dateMaj; }
}