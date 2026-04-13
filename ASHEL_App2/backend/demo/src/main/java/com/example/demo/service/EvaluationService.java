package com.example.demo.service;

import com.example.demo.entity.Evaluation;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    public Evaluation creer(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    public List<Evaluation> getAll() {
        return evaluationRepository.findAll();
    }

    public List<Evaluation> getByCitoyen(Long citoyenId) {
        return evaluationRepository.findByCitoyenId(citoyenId);
    }
}