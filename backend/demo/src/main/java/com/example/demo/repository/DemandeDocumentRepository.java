package com.example.demo.repository;

import com.example.demo.model.DemandeDocument;
import com.example.demo.model.DemandeDocument.StatutDemande;
import com.example.demo.model.DemandeDocument.TypeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DemandeDocumentRepository extends JpaRepository<DemandeDocument, Long> {

    // Toutes les demandes d'un citoyen (pour son coffre-fort)
    List<DemandeDocument> findByCinDemandeurOrderByDateCreationDesc(String cinDemandeur);

    // Retrouver par référence unique
    Optional<DemandeDocument> findByReference(String reference);

    // Demandes par statut (pour l'admin)
    List<DemandeDocument> findByStatut(StatutDemande statut);

    // Demandes d'un citoyen par type de document
    List<DemandeDocument> findByCinDemandeurAndTypeDocument(String cinDemandeur, TypeDocument typeDocument);

    // Vérifier si une demande en cours existe déjà
    boolean existsByCinDemandeurAndTypeDocumentAndStatutNot(
        String cinDemandeur, TypeDocument typeDocument, StatutDemande statut
    );
}
