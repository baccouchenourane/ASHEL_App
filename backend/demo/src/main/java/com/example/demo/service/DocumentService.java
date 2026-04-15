package com.example.demo.service;

import com.example.demo.dto.DemandeRequest;
import com.example.demo.dto.DemandeResponse;
import com.example.demo.model.DemandeDocument;
import com.example.demo.model.DemandeDocument.StatutDemande;
import com.example.demo.model.DemandeDocument.TypeDocument;
import com.example.demo.repository.DemandeDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DemandeDocumentRepository demandeRepo;

    // Tarifs officiels par type de document (en DT)
    private static final Map<TypeDocument, Double> TARIFS = Map.of(
        TypeDocument.EXTRAIT_NAISSANCE,    0.600,
        TypeDocument.BULLETIN_B3,          2.000,
        TypeDocument.REGISTRE_COMMERCE,    50.000,  // Frais RNE
        TypeDocument.ATTESTATION_TRAVAIL,  1.500,
        TypeDocument.CERTIFICAT_RESIDENCE, 2.000,
        TypeDocument.FICHE_PAIE_CNRPS,     0.500
    );

    // Préfixes de référence par type
    private static final Map<TypeDocument, String> PREFIXES = Map.of(
        TypeDocument.EXTRAIT_NAISSANCE,    "SMT",
        TypeDocument.BULLETIN_B3,          "B3",
        TypeDocument.REGISTRE_COMMERCE,    "RNE",
        TypeDocument.ATTESTATION_TRAVAIL,  "RH",
        TypeDocument.CERTIFICAT_RESIDENCE, "RES",
        TypeDocument.FICHE_PAIE_CNRPS,     "CNRPS"
    );

    /**
     * Crée une nouvelle demande de document après paiement confirmé.
     * Appelé depuis le frontend après l'étape de paiement (step 4).
     */
    public DemandeResponse creerDemande(DemandeRequest request) {
        // Validation du type de document
        TypeDocument type;
        try {
            type = TypeDocument.valueOf(request.getTypeDocument());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Type de document invalide : " + request.getTypeDocument());
        }

        // Validation du CIN
        if (request.getCinDemandeur() == null || request.getCinDemandeur().isBlank()) {
            throw new RuntimeException("CIN du demandeur obligatoire");
        }

        // Validation du nom
        if (request.getNomTitulaire() == null || request.getNomTitulaire().isBlank()) {
            throw new RuntimeException("Nom du titulaire obligatoire");
        }

        // Génération de la référence unique
        String reference = genererReference(type);

        // Récupération du montant officiel
        Double montant = TARIFS.getOrDefault(type, 0.0);

        // Création de l'entité
        DemandeDocument demande = new DemandeDocument(
            reference,
            type,
            request.getCinDemandeur(),
            request.getNomTitulaire().toUpperCase(),
            StatutDemande.PAIEMENT_RECU,
            request.getModePaiement(),
            montant
        );

        // Données supplémentaires (pour Registre de Commerce)
        if (request.getDonneesSupplementaires() != null && !request.getDonneesSupplementaires().isBlank()) {
            demande.setDonneesSupplementaires(request.getDonneesSupplementaires());
        }

        // Simulation traitement : passage automatique en PRET (sauf B3 et RNE)
        if (type == TypeDocument.BULLETIN_B3 || type == TypeDocument.REGISTRE_COMMERCE) {
            demande.setStatut(StatutDemande.EN_TRAITEMENT);
        } else {
            demande.setStatut(StatutDemande.PRET);
        }

        DemandeDocument saved = demandeRepo.save(demande);
        return new DemandeResponse(saved);
    }

    /**
     * Récupère tous les documents d'un citoyen pour le coffre-fort (DocumentVault).
     * Retourne la liste triée du plus récent au plus ancien.
     */
    public List<DemandeResponse> getCoffreFort(String cinDemandeur) {
        if (cinDemandeur == null || cinDemandeur.isBlank()) {
            throw new RuntimeException("CIN obligatoire");
        }

        return demandeRepo
            .findByCinDemandeurOrderByDateCreationDesc(cinDemandeur)
            .stream()
            .map(DemandeResponse::new)
            .collect(Collectors.toList());
    }

    /**
     * Récupère le statut d'une demande par sa référence.
     */
    public DemandeResponse getStatutDemande(String reference) {
        DemandeDocument demande = demandeRepo.findByReference(reference)
            .orElseThrow(() -> new RuntimeException("Demande introuvable : " + reference));
        return new DemandeResponse(demande);
    }

    /**
     * Soumettre demande Registre de Commerce (multi-étapes, sans paiement carte).
     * Utilisé par RegisterForm.jsx à l'étape finale.
     */
    public DemandeResponse soumettreRegistreCommerce(DemandeRequest request) {
        String reference = genererReference(TypeDocument.REGISTRE_COMMERCE);

        DemandeDocument demande = new DemandeDocument(
            reference,
            TypeDocument.REGISTRE_COMMERCE,
            request.getCinDemandeur(),
            (request.getNomTitulaire() != null ? request.getNomTitulaire().toUpperCase() : "NON RENSEIGNE"),
            StatutDemande.EN_TRAITEMENT,
            "VIREMENT_RNE",
            TARIFS.get(TypeDocument.REGISTRE_COMMERCE)
        );

        if (request.getDonneesSupplementaires() != null) {
            demande.setDonneesSupplementaires(request.getDonneesSupplementaires());
        }

        DemandeDocument saved = demandeRepo.save(demande);
        return new DemandeResponse(saved);
    }

    /**
     * Met à jour le statut d'une demande (usage admin ou traitement asynchrone).
     */
    public DemandeResponse mettreAJourStatut(String reference, String nouveauStatut) {
        DemandeDocument demande = demandeRepo.findByReference(reference)
            .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        try {
            demande.setStatut(StatutDemande.valueOf(nouveauStatut));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide : " + nouveauStatut);
        }

        return new DemandeResponse(demandeRepo.save(demande));
    }

    // --- Méthode privée : génération de référence unique ---
    private String genererReference(TypeDocument type) {
        String annee = String.valueOf(LocalDateTime.now().getYear());
        String prefix = PREFIXES.getOrDefault(type, "DOC");
        int rand = 1000 + new Random().nextInt(9000);
        String ref = prefix + "-" + annee + "-" + rand;

        // Garantir l'unicité
        int tentatives = 0;
        while (demandeRepo.findByReference(ref).isPresent() && tentatives < 10) {
            rand = 1000 + new Random().nextInt(9000);
            ref = prefix + "-" + annee + "-" + rand;
            tentatives++;
        }
        return ref;
    }
}
