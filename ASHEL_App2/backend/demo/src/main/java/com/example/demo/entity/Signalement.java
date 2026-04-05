package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "signalement")
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String categorie;

    private String statut = "NOUVEAU";

    private LocalDateTime dateCreation = LocalDateTime.now();

    private Long citoyenId;

    @Column(columnDefinition = "TEXT")
    private String photos;
}