package com.example.demo.controller;

import com.example.demo.model.Evaluation;
import com.example.demo.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping
    public ResponseEntity<Evaluation> creer(@RequestBody Evaluation evaluation) {
        return ResponseEntity.ok(evaluationService.creer(evaluation));
    }

    @GetMapping
    public ResponseEntity<List<Evaluation>> getAll() {
        return ResponseEntity.ok(evaluationService.getAll());
    }

    @GetMapping("/citoyen/{cin}")
public ResponseEntity<List<Evaluation>> getByCin(@PathVariable String cin) {
    return ResponseEntity.ok(evaluationService.getByCin(cin));
}
}