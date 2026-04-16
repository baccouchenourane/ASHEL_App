package com.example.demo.repository;

import com.example.demo.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByCitoyenCin(String citoyenCin);
}