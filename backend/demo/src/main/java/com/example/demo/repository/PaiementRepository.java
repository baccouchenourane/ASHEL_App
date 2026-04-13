package com.example.demo.repository;

import com.example.demo.model.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    /** Historique des paiements d'un utilisateur (du plus récent au plus ancien) */
    List<Paiement> findByCinOrderByDatePaiementDesc(String cin);

    /** Rechercher par numéro de transaction */
    Optional<Paiement> findByNumeroTransaction(String numeroTransaction);

    /** Paiements liés à une facture précise */
    List<Paiement> findByReferenceFacture(String referenceFacture);
}
