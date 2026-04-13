package com.example.demo.repository;

import com.example.demo.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {

    /** Toutes les factures d'un utilisateur */
    List<Facture> findByCinOrderByDateEcheanceAsc(String cin);

    /** Factures filtrées par statut */
    List<Facture> findByCinAndStatut(String cin, String statut);

    /** Récupérer une facture par sa référence */
    Optional<Facture> findByReference(String reference);

    /** Récupérer une facture par CIN + typeFacture */
    Optional<Facture> findByCinAndTypeFacture(String cin, String typeFacture);

    /** Vérifier si une référence existe déjà */
    boolean existsByReference(String reference);
}
