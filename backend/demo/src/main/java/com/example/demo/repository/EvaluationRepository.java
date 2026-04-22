package com.example.demo.repository;

import com.example.demo.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;  // ADD THIS IMPORT
import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    // Find by citizen CIN
    List<Evaluation> findByCin(String cin);

    // Find by demande ID
    List<Evaluation> findByDemandeId(Long demandeId);

    // Find by facture ID
    List<Evaluation> findByFactureId(Long factureId);

    // Find by service public name
    List<Evaluation> findByServicePublic(String servicePublic);

    // Find by CIN and order by date
    List<Evaluation> findByCinOrderByDateCreationDesc(String cin);

    // Get average rating for a specific service
    @Query("SELECT AVG(e.note) FROM Evaluation e WHERE e.servicePublic = :servicePublic")
    Double getAverageRatingForService(@Param("servicePublic") String servicePublic);

    // Get average rating for all services by a citizen
    @Query("SELECT AVG(e.note) FROM Evaluation e WHERE e.cin = :cin")
    Double getAverageRatingByCitizen(@Param("cin") String cin);

    // Get evaluations with note >= given value
    List<Evaluation> findByCinAndNoteGreaterThanEqual(String cin, Integer note);

    // Count evaluations by service
    long countByServicePublic(String servicePublic);

    // Get all evaluations with note = 5 (excellent)
    List<Evaluation> findByNote(Integer note);

    // Custom query to get evaluations with comments
    @Query("SELECT e FROM Evaluation e WHERE e.commentaire IS NOT NULL AND e.commentaire != ''")
    List<Evaluation> findEvaluationsWithComments();

    // Get evaluations between dates
    List<Evaluation> findByDateCreationBetween(LocalDateTime startDate, LocalDateTime endDate);
}