package com.example.demo.repository;

import com.example.demo.model.Reclamation;
import com.example.demo.model.Reclamation.StatutReclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    List<Reclamation> findByCinOrderByDateCreationDesc(String cin);

    Optional<Reclamation> findByReference(String reference);

    List<Reclamation> findByStatut(StatutReclamation statut);
}