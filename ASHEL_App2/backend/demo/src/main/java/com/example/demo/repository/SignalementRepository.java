package com.example.demo.repository;

import com.example.demo.entity.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SignalementRepository extends JpaRepository<Signalement, Long> {
    List<Signalement> findByCitoyenId(Long citoyenId);
    List<Signalement> findByStatut(String statut);
}