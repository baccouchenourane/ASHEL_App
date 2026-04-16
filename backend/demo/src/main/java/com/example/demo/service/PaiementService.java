package com.example.demo.service;

import com.example.demo.model.Facture;
import com.example.demo.model.Paiement;
import com.example.demo.model.User;
import com.example.demo.repository.FactureRepository;
import com.example.demo.repository.PaiementRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;

@Service
public class PaiementService {

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private UserRepository userRepository;

    // ─── MÉTHODES PUBLIQUES ───────────────────────────────────────────────────

    /**
     * Retourne toutes les factures d'un utilisateur avec leur statut.
     */
    public List<Map<String, Object>> getFacturesByCin(String cin) {
        verifierUtilisateur(cin);

        List<Facture> factures = factureRepository.findByCinOrderByDateEcheanceAsc(cin);

        // Si aucune facture en base, on génère les factures par défaut
        if (factures.isEmpty()) {
            genererFacturesParDefaut(cin);
            factures = factureRepository.findByCinOrderByDateEcheanceAsc(cin);
        }

        return factures.stream().map(this::factureToMap).toList();
    }

    /**
     * Retourne le détail d'une facture (par typeFacture) pour un utilisateur.
     */
    public Map<String, Object> getFactureByType(String cin, String typeFacture) {
        verifierUtilisateur(cin);
        Facture facture = factureRepository.findByCinAndTypeFacture(cin, typeFacture)
                .orElseThrow(() -> new RuntimeException("Facture introuvable : " + typeFacture));
        return factureToMap(facture);
    }

    /**
     * Initialise un paiement : vérifie la facture, crée un enregistrement EN_COURS.
     * Retourne un numéro de transaction temporaire.
     */
    @Transactional
    public Map<String, Object> initierPaiement(String cin, String referenceFacture, String methodePaiement) {
        verifierUtilisateur(cin);

        Facture facture = factureRepository.findByReference(referenceFacture)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        if (!facture.getCin().equals(cin)) {
            throw new RuntimeException("Cette facture n'appartient pas à cet utilisateur");
        }
        if ("PAYEE".equals(facture.getStatut())) {
            throw new RuntimeException("Cette facture est déjà réglée");
        }

        validerMethodePaiement(methodePaiement);

        String numeroTransaction = genererNumeroTransaction();

        Paiement paiement = new Paiement(cin, referenceFacture, methodePaiement.toUpperCase(),
                facture.getMontant(), numeroTransaction);
        paiementRepository.save(paiement);

        return Map.of(
                "numeroTransaction", numeroTransaction,
                "montant", facture.getMontant(),
                "reference", facture.getReference(),
                "methode", methodePaiement.toUpperCase(),
                "statut", "EN_COURS",
                "message", "Paiement initié — en attente de confirmation"
        );
    }

    /**
     * Confirme un paiement (simule la validation bancaire).
     * Met à jour la facture et le paiement en base.
     */
    @Transactional
    public Map<String, Object> confirmerPaiement(String numeroTransaction) {
        Paiement paiement = paiementRepository.findByNumeroTransaction(numeroTransaction)
                .orElseThrow(() -> new RuntimeException("Transaction introuvable : " + numeroTransaction));

        if ("SUCCES".equals(paiement.getStatut())) {
            throw new RuntimeException("Ce paiement a déjà été confirmé");
        }

        // Marquer le paiement comme réussi
        paiement.setStatut("SUCCES");
        paiement.setDatePaiement(LocalDateTime.now());
        paiementRepository.save(paiement);

        // Mettre à jour la facture associée
        factureRepository.findByReference(paiement.getReferenceFacture()).ifPresent(f -> {
            f.setStatut("PAYEE");
            f.setDatePaiement(LocalDate.now());
            factureRepository.save(f);
        });

        return Map.of(
                "success", true,
                "numeroTransaction", numeroTransaction,
                "montant", paiement.getMontant(),
                "methode", paiement.getMethodePaiement(),
                "datePaiement", paiement.getDatePaiement().toString(),
                "message", "Paiement confirmé avec succès"
        );
    }

    /**
     * Retourne l'historique des paiements d'un utilisateur.
     */
    public List<Map<String, Object>> getHistoriquePaiements(String cin) {
        verifierUtilisateur(cin);
        return paiementRepository.findByCinOrderByDatePaiementDesc(cin)
                .stream()
                .map(this::paiementToMap)
                .toList();
    }

    /**
     * Retourne le détail d'une transaction par son numéro (reçu).
     */
    public Map<String, Object> getRecu(String numeroTransaction) {
        Paiement paiement = paiementRepository.findByNumeroTransaction(numeroTransaction)
                .orElseThrow(() -> new RuntimeException("Transaction introuvable"));

        Map<String, Object> recu = new LinkedHashMap<>(paiementToMap(paiement));

        // Enrichir avec les infos de la facture
        factureRepository.findByReference(paiement.getReferenceFacture()).ifPresent(f -> {
            recu.put("organisme", f.getOrganisme());
            recu.put("libelle", f.getLibelle());
        });

        return recu;
    }

    // ─── MÉTHODES PRIVÉES ─────────────────────────────────────────────────────

    private void verifierUtilisateur(String cin) {
        if (!userRepository.existsByCin(cin)) {
            throw new RuntimeException("Utilisateur introuvable : " + cin);
        }
    }

    private void validerMethodePaiement(String methode) {
        List<String> methodesValides = List.of("CARTE", "EDINAR", "VIREMENT", "POSTE");
        if (!methodesValides.contains(methode.toUpperCase())) {
            throw new RuntimeException("Méthode de paiement invalide. Choisir parmi : CARTE, EDINAR, VIREMENT, POSTE");
        }
    }

    private String genererNumeroTransaction() {
        return "TXN-" + System.currentTimeMillis() + "-" + (new Random().nextInt(9000) + 1000);
    }

    /**
     * Crée des factures de démonstration pour un nouveau utilisateur.
     */
    private void genererFacturesParDefaut(String cin) {
        List<Facture> defauts = List.of(
                new Facture(cin, "electricite", "STEG",
                        "Facture Électricité",
                        new BigDecimal("85.500"), "STEG-2026-" + cin,
                        LocalDate.now().plusDays(15)),
                new Facture(cin, "eau", "SONEDE",
                        "Facture Eau",
                        new BigDecimal("42.200"), "SONDE-2026-" + cin,
                        LocalDate.now().plusDays(20)),
                new Facture(cin, "radar", "MIN. INTÉRIEUR",
                        "Amende Radar PV-2026-88",
                        new BigDecimal("60.000"), "RADAR-2026-" + cin,
                        LocalDate.now().plusDays(5)),
                new Facture(cin, "etude", "UNIVERSITÉ",
                        "Frais Inscription Universitaire",
                        new BigDecimal("10.000"), "UNIV-2026-" + cin,
                        LocalDate.now().plusDays(30))
        );

        // Marquer la facture eau comme déjà payée (comme dans le frontend)
        defauts.get(1).setStatut("PAYEE");
        defauts.get(1).setDatePaiement(LocalDate.now().minusDays(10));

        factureRepository.saveAll(defauts);
    }

    private Map<String, Object> factureToMap(Facture f) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", f.getId());
        map.put("typeFacture", f.getTypeFacture());
        map.put("organisme", f.getOrganisme());
        map.put("libelle", f.getLibelle());
        map.put("montant", f.getMontant());
        map.put("reference", f.getReference());
        map.put("statut", f.getStatut());
        map.put("dateEcheance", f.getDateEcheance() != null ? f.getDateEcheance().toString() : null);
        map.put("datePaiement", f.getDatePaiement() != null ? f.getDatePaiement().toString() : null);
        return map;
    }

    private Map<String, Object> paiementToMap(Paiement p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", p.getId());
        map.put("numeroTransaction", p.getNumeroTransaction());
        map.put("referenceFacture", p.getReferenceFacture());
        map.put("methodePaiement", p.getMethodePaiement());
        map.put("montant", p.getMontant());
        map.put("statut", p.getStatut());
        map.put("datePaiement", p.getDatePaiement().toString());
        return map;
    }
}
