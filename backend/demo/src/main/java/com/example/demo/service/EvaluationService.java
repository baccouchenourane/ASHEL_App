package com.example.demo.service;

import com.example.demo.model.Evaluation;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    // Create or update evaluation
    public Evaluation saveEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    // Get all evaluations
    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    // Get evaluation by ID
    public Evaluation getEvaluationById(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation not found with id: " + id));
    }

    // Get evaluations by citizen CIN
    public List<Evaluation> getEvaluationsByCin(String cin) {
        return evaluationRepository.findByCin(cin);
    }

    // Get evaluations by service public
    public List<Evaluation> getEvaluationsByServicePublic(String servicePublic) {
        return evaluationRepository.findByServicePublic(servicePublic);
    }

    // Get evaluations by demande ID
    public List<Evaluation> getEvaluationsByDemandeId(Long demandeId) {
        return evaluationRepository.findByDemandeId(demandeId);
    }

    // Get evaluations by facture ID
    public List<Evaluation> getEvaluationsByFactureId(Long factureId) {
        return evaluationRepository.findByFactureId(factureId);
    }

    // Get average rating for a service
    public Double getAverageRatingForService(String servicePublic) {
        return evaluationRepository.getAverageRatingForService(servicePublic);
    }

    // Delete evaluation
    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }

    // Update evaluation
    public Evaluation updateEvaluation(Long id, Evaluation evaluationDetails) {
        Evaluation evaluation = getEvaluationById(id);
        evaluation.setNote(evaluationDetails.getNote());
        evaluation.setCommentaire(evaluationDetails.getCommentaire());
        return evaluationRepository.save(evaluation);
    }
}