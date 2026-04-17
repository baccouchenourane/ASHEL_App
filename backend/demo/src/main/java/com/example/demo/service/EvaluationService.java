package com.example.demo.service;

import com.example.demo.model.Evaluation;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    public Evaluation creer(Evaluation evaluation) {
        // Vérification de la contrainte XOR avant sauvegarde
        boolean xorOk = (evaluation.getDemandeId() != null) ^ (evaluation.getFactureId() != null);
        if (!xorOk) {
            throw new RuntimeException(
                "Une évaluation doit cibler soit une demande, soit une facture — pas les deux, ni aucune."
            );
        }

        // Vérifier doublon
        if (evaluation.getDemandeId() != null &&
            evaluationRepository.existsByCinAndDemandeId(evaluation.getCin(), evaluation.getDemandeId())) {
            throw new RuntimeException("Vous avez déjà évalué cette demande.");
        }
        if (evaluation.getFactureId() != null &&
            evaluationRepository.existsByCinAndFactureId(evaluation.getCin(), evaluation.getFactureId())) {
            throw new RuntimeException("Vous avez déjà évalué cette facture.");
        }

        return evaluationRepository.save(evaluation);
    }

    public List<Evaluation> getAll() {
        return evaluationRepository.findAll();
    }

    public List<Evaluation> getByCin(String cin) {
        return evaluationRepository.findByCinOrderByDateCreationDesc(cin);
    }
}