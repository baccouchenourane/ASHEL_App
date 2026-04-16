package com.example.demo.repository;

import com.example.demo.entity.Signalement;
import com.example.demo.entity.StatutSignalement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SignalementRepository extends JpaRepository<Signalement, Long> {

    List<Signalement> findByCitoyenId(Long citoyenId);

    List<Signalement> findByStatut(StatutSignalement statut);

    List<Signalement> findAllByOrderByDateCreationDesc();

    List<Signalement> findByCitoyenIdOrderByDateCreationDesc(Long citoyenId);
}
