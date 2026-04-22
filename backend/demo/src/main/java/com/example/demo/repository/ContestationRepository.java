package com.example.demo.repository;

import com.example.demo.model.Contestation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContestationRepository extends JpaRepository<Contestation, Long> {

    /** Contestations d'un citoyen, triées du plus récent au plus ancien */
    List<Contestation> findByCinOrderByDateSoumissionDesc(String cin);

    /** Toutes les contestations (vue admin), triées du plus récent au plus ancien */
    List<Contestation> findAllByOrderByDateSoumissionDesc();

    /** Vérifie si une contestation est déjà en attente pour une amende donnée */
    boolean existsByCinAndReferenceAmendeAndStatut(String cin, String referenceAmende, String statut);

    /** Contestations par statut (pour les stats admin) */
    List<Contestation> findByStatut(String statut);
}
