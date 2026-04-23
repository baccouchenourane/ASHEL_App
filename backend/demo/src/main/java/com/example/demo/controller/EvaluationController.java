package com.example.demo.controller;

import com.example.demo.dto.EvaluationRequest;
import com.example.demo.model.Evaluation;
import com.example.demo.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    // Create evaluation
    @PostMapping
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody EvaluationRequest request) {
        // Map DTO to entity
        Evaluation evaluation = new Evaluation();
        evaluation.setCin(request.getCitoyenId()); // citoyenId is now a String (CIN)
        evaluation.setNote(request.getNote());
        evaluation.setCommentaire(request.getCommentaire());
        evaluation.setServicePublic(request.getServicePublic());
        
        Evaluation savedEvaluation = evaluationService.saveEvaluation(evaluation);
        return new ResponseEntity<>(savedEvaluation, HttpStatus.CREATED);
    }

    // Get all evaluations
    @GetMapping
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        return ResponseEntity.ok(evaluationService.getAllEvaluations());
    }

    // Get evaluation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable Long id) {
        Evaluation evaluation = evaluationService.getEvaluationById(id);
        return ResponseEntity.ok(evaluation);
    }

    // Get evaluations by citizen CIN
    @GetMapping("/citizen/{cin}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByCin(@PathVariable String cin) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByCin(cin));
    }

    // Get evaluations by service public
    @GetMapping("/service/{servicePublic}")
    public ResponseEntity<List<Evaluation>> getEvaluationsByServicePublic(@PathVariable String servicePublic) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByServicePublic(servicePublic));
    }

    // Get average rating for a service
    @GetMapping("/service/{servicePublic}/average")
    public ResponseEntity<Double> getAverageRatingForService(@PathVariable String servicePublic) {
        Double average = evaluationService.getAverageRatingForService(servicePublic);
        return ResponseEntity.ok(average != null ? average : 0.0);
    }

    // Update evaluation
    @PutMapping("/{id}")
    public ResponseEntity<Evaluation> updateEvaluation(@PathVariable Long id, @RequestBody Evaluation evaluation) {
        Evaluation updatedEvaluation = evaluationService.updateEvaluation(id, evaluation);
        return ResponseEntity.ok(updatedEvaluation);
    }

    // Delete evaluation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
        return ResponseEntity.noContent().build();
    }
}