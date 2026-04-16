package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

/**
 * Entité représentant une transaction de paiement effectuée par un utilisateur.
 */
@Entity
@Table(name = "paiements")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** CIN du payeur */
    @Column(nullable = false, length = 8)
    private String cin;

    /** Référence de la facture réglée */
    @Column(nullable = false, length = 50)
    private String referenceFacture;

    /** Moyen de paiement utilisé : CARTE | EDINAR | VIREMENT | POSTE */
    @Column(nullable = false, length = 20)
    private String methodePaiement;

    /** Montant effectivement payé */
    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal montant;

    /** Numéro de transaction unique généré */
    @Column(unique = true, nullable = false, length = 30)
    private String numeroTransaction;

    /** SUCCES | ECHEC | EN_COURS */
    @Column(nullable = false, length = 20)
    private String statut = "EN_COURS";

    @Column(nullable = false)
    private LocalDateTime datePaiement = LocalDateTime.now();

    // ─── Constructeurs ────────────────────────────────────────────────────────

    public Paiement() {}

    public Paiement(String cin, String referenceFacture, String methodePaiement,
                    BigDecimal montant, String numeroTransaction) {
        this.cin = cin;
        this.referenceFacture = referenceFacture;
        this.methodePaiement = methodePaiement;
        this.montant = montant;
        this.numeroTransaction = numeroTransaction;
        this.statut = "EN_COURS";
        this.datePaiement = LocalDateTime.now();
    }

    // ─── Getters / Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getReferenceFacture() { return referenceFacture; }
    public void setReferenceFacture(String referenceFacture) { this.referenceFacture = referenceFacture; }

    public String getMethodePaiement() { return methodePaiement; }
    public void setMethodePaiement(String methodePaiement) { this.methodePaiement = methodePaiement; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public String getNumeroTransaction() { return numeroTransaction; }
    public void setNumeroTransaction(String numeroTransaction) { this.numeroTransaction = numeroTransaction; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }
}
