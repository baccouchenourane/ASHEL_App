package com.example.demo.repository;

import com.example.demo.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    boolean existsByCinAndDemandeId(String cin, Long demandeId);
    boolean existsByCinAndFactureId(String cin, Long factureId);
    List<Evaluation> findByCinOrderByDateCreationDesc(String cin);
}