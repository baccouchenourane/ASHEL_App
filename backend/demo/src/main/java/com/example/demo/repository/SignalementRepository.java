package com.example.demo.repository;

import com.example.demo.model.Signalement;
import com.example.demo.model.Signalement.StatutSignalement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SignalementRepository extends JpaRepository<Signalement, Long> {

    List<Signalement> findByCinOrderByDateCreationDesc(String cin);

    Optional<Signalement> findByReference(String reference);

    List<Signalement> findByStatut(StatutSignalement statut);

    List<Signalement> findByCategorie(Signalement.Categorie categorie);
}