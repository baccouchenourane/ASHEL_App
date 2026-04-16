package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonAlias;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer note;        // entre 1 et 5

    private String commentaire;

    @Column(name = "service_public", nullable = false)
    private String servicePublic;

    @Column(name = "date_evaluation")
    private LocalDateTime dateEvaluation = LocalDateTime.now();

    @Column(name = "citoyen_cin", nullable = false)
    @JsonAlias("citoyenId")
    private String citoyenCin;
}