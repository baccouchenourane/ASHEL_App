package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reclamation")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String objet;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    private String statut = "DEPOSEE";

    private LocalDateTime dateDepot = LocalDateTime.now();

    private Long citoyenId;
}