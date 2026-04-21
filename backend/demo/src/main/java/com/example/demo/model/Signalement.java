package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "signalements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Signalement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;

    // Changé en String pour être compatible avec ton service existant
    private String categorie;        // ex: "INFRASTRUCTURE"

    // Changé en String pour être compatible avec ton service existant
    private String statut = "NOUVEAU";

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_traitement")
    private LocalDateTime dateTraitement;

    @Transient
    private String photos;

    @Column(name = "citoyen_cin")
    private Long citoyenId;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Administrateur admin;
}