package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entité représentant une contestation d'amende soumise par un citoyen.
 */
@Entity
@Table(name = "contestations")
public class Contestation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** CIN du citoyen qui conteste */
    @Column(nullable = false, length = 8)
    private String cin;

    /** Référence du PV contesté (ex: PV-2026-88) */
    @Column(nullable = false, length = 50)
    private String referenceAmende;

    /** Motif légal de la contestation */
    @Column(nullable = false, length = 200)
    private String motif;

    /** Description détaillée fournie par le citoyen */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    /** Chemin vers le fichier justificatif (optionnel) */
    @Column(length = 500)
    private String cheminJustificatif;

    /**
     * Statut de la contestation :
     *   EN_ATTENTE → soumise, pas encore traitée
     *   EN_COURS   → en cours d'examen par l'admin
     *   ACCEPTEE   → amende annulée
     *   REJETEE    → contestation refusée, amende maintenue
     */
    @Column(nullable = false, length = 20)
    private String statut = "EN_ATTENTE";

    /** Commentaire laissé par l'administrateur lors du traitement */
    @Column(columnDefinition = "TEXT")
    private String commentaireAdmin;

    /** Date de soumission de la contestation */
    @Column(nullable = false)
    private LocalDateTime dateSoumission = LocalDateTime.now();

    /** Date de traitement par l'admin */
    @Column
    private LocalDateTime dateTraitement;

    // ─── Constructeurs ────────────────────────────────────────────────────────

    public Contestation() {}

    public Contestation(String cin, String referenceAmende, String motif, String description) {
        this.cin = cin;
        this.referenceAmende = referenceAmende;
        this.motif = motif;
        this.description = description;
        this.statut = "EN_ATTENTE";
        this.dateSoumission = LocalDateTime.now();
    }

    // ─── Getters / Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getReferenceAmende() { return referenceAmende; }
    public void setReferenceAmende(String referenceAmende) { this.referenceAmende = referenceAmende; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCheminJustificatif() { return cheminJustificatif; }
    public void setCheminJustificatif(String cheminJustificatif) { this.cheminJustificatif = cheminJustificatif; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getCommentaireAdmin() { return commentaireAdmin; }
    public void setCommentaireAdmin(String commentaireAdmin) { this.commentaireAdmin = commentaireAdmin; }

    public LocalDateTime getDateSoumission() { return dateSoumission; }
    public void setDateSoumission(LocalDateTime dateSoumission) { this.dateSoumission = dateSoumission; }

    public LocalDateTime getDateTraitement() { return dateTraitement; }
    public void setDateTraitement(LocalDateTime dateTraitement) { this.dateTraitement = dateTraitement; }
}
