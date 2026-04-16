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

    /**
     * Lifecycle status stored as a VARCHAR string in the DB.
     * Defaults to NOUVEAU on creation.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutSignalement statut = StatutSignalement.NOUVEAU;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    private Long citoyenId;

    @Column(columnDefinition = "TEXT")
    private String photos;
}
