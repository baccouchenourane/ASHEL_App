package com.example.demo.dto;

/**
 * DTO reçu depuis le frontend pour créer une demande de document.
 * Utilisé par tous les formulaires : BirthCertification, BulletinB3,
 * WorkCertificate, ResidenceCertificate, SalarySlip.
 */
public class DemandeRequest {

    // CIN du citoyen connecté
    private String cinDemandeur;

    // Nom du titulaire sur le document (= cardHolder dans le frontend)
    private String nomTitulaire;

    // Type: EXTRAIT_NAISSANCE, BULLETIN_B3, ATTESTATION_TRAVAIL,
    //       CERTIFICAT_RESIDENCE, FICHE_PAIE_CNRPS, REGISTRE_COMMERCE
    private String typeDocument;

    // Mode de paiement: "CARTE_BANCAIRE" ou "EDINAR"
    private String modePaiement;

    // Derniers 4 chiffres de la carte (ne jamais stocker le numéro complet!)
    private String dernierChiffresCartee;

    // Données supplémentaires pour le registre de commerce (JSON en string)
    // Ex: {"raisonSociale":"TECH SARL","formeJuridique":"SARL","cin":"12345678",...}
    private String donneesSupplementaires;

    // --- Getters & Setters ---
    public String getCinDemandeur() { return cinDemandeur; }
    public void setCinDemandeur(String cinDemandeur) { this.cinDemandeur = cinDemandeur; }

    public String getNomTitulaire() { return nomTitulaire; }
    public void setNomTitulaire(String nomTitulaire) { this.nomTitulaire = nomTitulaire; }

    public String getTypeDocument() { return typeDocument; }
    public void setTypeDocument(String typeDocument) { this.typeDocument = typeDocument; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getDernierChiffresCartee() { return dernierChiffresCartee; }
    public void setDernierChiffresCartee(String dernierChiffresCartee) { this.dernierChiffresCartee = dernierChiffresCartee; }

    public String getDonneesSupplementaires() { return donneesSupplementaires; }
    public void setDonneesSupplementaires(String donneesSupplementaires) { this.donneesSupplementaires = donneesSupplementaires; }
}
