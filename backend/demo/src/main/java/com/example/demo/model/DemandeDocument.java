package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "demandes_documents")
public class DemandeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence unique du dossier (ex: SMT-2026-1234)
    @Column(unique = true, nullable = false)
    private String reference;

    // Type de document demandé
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDocument typeDocument;

    // CIN du demandeur (lié à User)
    @Column(nullable = false, length = 8)
    private String cinDemandeur;

    // Nom complet du titulaire du document
    @Column(nullable = false)
    private String nomTitulaire;

    // Statut de la demande
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDemande statut;

    // Mode de paiement utilisé
    @Column
    private String modePaiement; // "CARTE_BANCAIRE" ou "EDINAR"

    // Montant payé en dinars
    @Column
    private Double montantPaye;

    // Date de création de la demande
    @Column(nullable = false)
    private LocalDateTime dateCreation;

    // Date de mise à jour
    @Column
    private LocalDateTime dateMAJ;

    // Données supplémentaires (JSON simplifié pour RegisterForm)
    @Column(columnDefinition = "TEXT")
    private String donneesSupplementaires;

    // Enums internes
    public enum TypeDocument {
        EXTRAIT_NAISSANCE,
        BULLETIN_B3,
        REGISTRE_COMMERCE,
        ATTESTATION_TRAVAIL,
        CERTIFICAT_RESIDENCE,
        FICHE_PAIE_CNRPS
    }

    public enum StatutDemande {
        EN_ATTENTE,
        PAIEMENT_RECU,
        EN_TRAITEMENT,
        PRET,
        REJETE
    }

    // --- Constructeurs ---
    public DemandeDocument() {}

    public DemandeDocument(String reference, TypeDocument typeDocument,
                           String cinDemandeur, String nomTitulaire,
                           StatutDemande statut, String modePaiement,
                           Double montantPaye) {
        this.reference = reference;
        this.typeDocument = typeDocument;
        this.cinDemandeur = cinDemandeur;
        this.nomTitulaire = nomTitulaire;
        this.statut = statut;
        this.modePaiement = modePaiement;
        this.montantPaye = montantPaye;
        this.dateCreation = LocalDateTime.now();
        this.dateMAJ = LocalDateTime.now();
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public TypeDocument getTypeDocument() { return typeDocument; }
    public void setTypeDocument(TypeDocument typeDocument) { this.typeDocument = typeDocument; }

    public String getCinDemandeur() { return cinDemandeur; }
    public void setCinDemandeur(String cinDemandeur) { this.cinDemandeur = cinDemandeur; }

    public String getNomTitulaire() { return nomTitulaire; }
    public void setNomTitulaire(String nomTitulaire) { this.nomTitulaire = nomTitulaire; }

    public StatutDemande getStatut() { return statut; }
    public void setStatut(StatutDemande statut) {
        this.statut = statut;
        this.dateMAJ = LocalDateTime.now();
    }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public Double getMontantPaye() { return montantPaye; }
    public void setMontantPaye(Double montantPaye) { this.montantPaye = montantPaye; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateMAJ() { return dateMAJ; }
    public void setDateMAJ(LocalDateTime dateMAJ) { this.dateMAJ = dateMAJ; }

    public String getDonneesSupplementaires() { return donneesSupplementaires; }
    public void setDonneesSupplementaires(String donneesSupplementaires) { this.donneesSupplementaires = donneesSupplementaires; }
}
