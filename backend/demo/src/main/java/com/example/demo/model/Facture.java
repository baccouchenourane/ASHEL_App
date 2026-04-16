package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

/**
 * Entité représentant une facture liée à un utilisateur (STEG, SONEDE, amende, etc.)
 */
@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** CIN du propriétaire de la facture */
    @Column(nullable = false, length = 8)
    private String cin;

    /** Identifiant métier unique (ex: "electricite", "eau", "radar", "etude") */
    @Column(nullable = false, length = 50)
    private String typeFacture;

    /** Organisme émetteur (STEG, SONEDE, MIN. INTÉRIEUR, UNIVERSITÉ…) */
    @Column(nullable = false, length = 100)
    private String organisme;

    /** Intitulé de la facture */
    @Column(nullable = false)
    private String libelle;

    /** Montant en dinars tunisiens (ex: 85.500) */
    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal montant;

    /** Référence unique de la facture (ex: STEG-2026-001234) */
    @Column(unique = true, nullable = false, length = 50)
    private String reference;

    /** IMPAYEE | PAYEE | EN_ATTENTE */
    @Column(nullable = false, length = 20)
    private String statut = "IMPAYEE";

    @Column
    private LocalDate dateEcheance;

    @Column
    private LocalDate datePaiement;

    // ─── Constructeurs ────────────────────────────────────────────────────────

    public Facture() {}

    public Facture(String cin, String typeFacture, String organisme, String libelle,
                   BigDecimal montant, String reference, LocalDate dateEcheance) {
        this.cin = cin;
        this.typeFacture = typeFacture;
        this.organisme = organisme;
        this.libelle = libelle;
        this.montant = montant;
        this.reference = reference;
        this.dateEcheance = dateEcheance;
        this.statut = "IMPAYEE";
    }

    // ─── Getters / Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getTypeFacture() { return typeFacture; }
    public void setTypeFacture(String typeFacture) { this.typeFacture = typeFacture; }

    public String getOrganisme() { return organisme; }
    public void setOrganisme(String organisme) { this.organisme = organisme; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDate getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(LocalDate dateEcheance) { this.dateEcheance = dateEcheance; }

    public LocalDate getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDate datePaiement) { this.datePaiement = datePaiement; }
}
