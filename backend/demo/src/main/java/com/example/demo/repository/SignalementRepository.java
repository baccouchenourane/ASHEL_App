package com.example.demo.repository;

import com.example.demo.model.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SignalementRepository extends JpaRepository<Signalement, Long> {

    // Based on your schema, the field is 'cin', not 'citoyenId' or 'citoyenCin'
    List<Signalement> findByCin(String cin);

    List<Signalement> findByStatut(String statut);

    List<Signalement> findByCategorie(String categorie);

    List<Signalement> findByCinOrderByDateCreationDesc(String cin);

    List<Signalement> findAllByOrderByDateCreationDesc();

    @Query("SELECT s FROM Signalement s WHERE s.statut = :statut ORDER BY s.dateCreation DESC")
    List<Signalement> findSignalementsByStatut(@Param("statut") String statut);

    long countByCin(String cin);

    long countByStatut(String statut);
}