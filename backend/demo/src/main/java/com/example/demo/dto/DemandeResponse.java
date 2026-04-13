package com.example.demo.dto;

import com.example.demo.model.DemandeDocument;
import java.time.LocalDateTime;

/**
 * DTO renvoyé au frontend après création ou consultation d'une demande.
 * Correspond exactement aux données affichées dans DocumentVault.jsx.
 */
public class DemandeResponse {

    private Long id;
    private String reference;
    private String typeDocument;     // Libellé lisible (ex: "Extrait de Naissance")
    private String cinDemandeur;
    private String nomTitulaire;
    private String statut;           // "EN_ATTENTE", "PAIEMENT_RECU", "PRET", etc.
    private String modePaiement;
    private Double montantPaye;
    private LocalDateTime dateCreation;
    private LocalDateTime dateMAJ;

    // Constructeur depuis l'entité
    public DemandeResponse(DemandeDocument d) {
        this.id = d.getId();
        this.reference = d.getReference();
        this.typeDocument = getLibelle(d.getTypeDocument());
        this.cinDemandeur = d.getCinDemandeur();
        this.nomTitulaire = d.getNomTitulaire();
        this.statut = d.getStatut().name();
        this.modePaiement = d.getModePaiement();
        this.montantPaye = d.getMontantPaye();
        this.dateCreation = d.getDateCreation();
        this.dateMAJ = d.getDateMAJ();
    }

    // Convertit l'enum en libellé français pour le frontend
    private String getLibelle(DemandeDocument.TypeDocument type) {
        return switch (type) {
            case EXTRAIT_NAISSANCE    -> "Extrait de Naissance";
            case BULLETIN_B3          -> "Bulletin N°3";
            case REGISTRE_COMMERCE    -> "Registre de Commerce";
            case ATTESTATION_TRAVAIL  -> "Attestation de Travail";
            case CERTIFICAT_RESIDENCE -> "Certificat de Résidence";
            case FICHE_PAIE_CNRPS     -> "Fiche de Paie (CNRPS)";
        };
    }

    // --- Getters ---
    public Long getId() { return id; }
    public String getReference() { return reference; }
    public String getTypeDocument() { return typeDocument; }
    public String getCinDemandeur() { return cinDemandeur; }
    public String getNomTitulaire() { return nomTitulaire; }
    public String getStatut() { return statut; }
    public String getModePaiement() { return modePaiement; }
    public Double getMontantPaye() { return montantPaye; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public LocalDateTime getDateMAJ() { return dateMAJ; }
}
