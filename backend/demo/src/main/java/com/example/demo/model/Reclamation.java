package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonAlias;

import com.example.demo.model.StatutReclamation;

@Entity
@Table(name = "reclamations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String objet;
    private String contenu;

    @Enumerated(EnumType.STRING)
    private StatutReclamation statut = StatutReclamation.DEPOSEE;

    @Column(name = "date_depot")
    private LocalDateTime dateDepot = LocalDateTime.now();

    @Column(name = "date_cloture")
    private LocalDateTime dateCloture;

    @Column(name = "citoyen_cin", nullable = false)
    @JsonAlias("citoyenId")
    private String citoyenCin;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Administrateur admin;
}
