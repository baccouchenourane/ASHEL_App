package com.example.demo.repository;

import com.example.demo.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    // Find by citizen CIN
    List<Reclamation> findByCin(String cin);

    // All reclamations ordered by date creation (newest first)
    List<Reclamation> findAllByOrderByDateCreationDesc();

    // Reclamations for a specific citizen ordered by date creation (newest first)
    List<Reclamation> findByCinOrderByDateCreationDesc(String cin);

    // Additional useful methods
    List<Reclamation> findByStatut(String statut);

    List<Reclamation> findByCinAndStatut(String cin, String statut);

    @Query("SELECT r FROM Reclamation r WHERE r.statut = :statut ORDER BY r.dateCreation DESC")
    List<Reclamation> findReclamationsByStatut(@Param("statut") String statut);

    long countByCin(String cin);

    long countByStatut(String statut);

    // REMOVE THESE OLD METHODS - they cause compilation errors:
    // List<Reclamation> findAllByOrderByDateDepotDesc();
    // List<Reclamation> findByCitoyenCinOrderByDateDepotDesc(String citoyenCin);
}