package com.example.demo.repository;

import com.example.demo.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    // Fixed: Changed from citoyenCin to cin
    List<Reclamation> findByCin(String cin);

    // Fixed: Changed from findAllByOrderByDateDepotDesc to findAllByOrderByDateCreationDesc
    List<Reclamation> findAllByOrderByDateCreationDesc();

    // Fixed: Changed from findByCitoyenCinOrderByDateDepotDesc to findByCinOrderByDateCreationDesc
    List<Reclamation> findByCinOrderByDateCreationDesc(String cin);

    // Additional useful methods
    List<Reclamation> findByStatut(String statut);

    List<Reclamation> findByCinAndStatut(String cin, String statut);

    @Query("SELECT r FROM Reclamation r WHERE r.statut = :statut ORDER BY r.dateCreation DESC")
    List<Reclamation> findReclamationsByStatut(@Param("statut") String statut);

    long countByCin(String cin);

    long countByStatut(String statut);

    List<Reclamation> findAllByOrderByDateDepotDesc();

    List<Reclamation> findByCitoyenCinOrderByDateDepotDesc(String citoyenCin);
}