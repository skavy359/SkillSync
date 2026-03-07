package com.skillsync.backend.controller;

import com.skillsync.backend.dto.quiz.QuizAttemptResponse;
import com.skillsync.backend.dto.quiz.QuizQuestionDTO;
import com.skillsync.backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/generate")
    public ResponseEntity<List<QuizQuestionDTO>> generateQuiz(@RequestBody Map<String, Object> body) {
        String skillName = (String) body.get("skillName");
        String difficulty = (String) body.getOrDefault("difficulty", "INTERMEDIATE");
        int count = body.containsKey("count") ? ((Number) body.get("count")).intValue() : 5;
        return ResponseEntity.ok(quizService.generateQuiz(skillName, difficulty, count));
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizAttemptResponse> submitAttempt(Authentication auth, @RequestBody Map<String, Object> body) {
        Long skillId = body.get("skillId") != null ? ((Number) body.get("skillId")).longValue() : null;
        String skillName = (String) body.get("skillName");
        int score = ((Number) body.get("score")).intValue();
        int total = ((Number) body.get("totalQuestions")).intValue();
        String difficulty = (String) body.getOrDefault("difficulty", "INTERMEDIATE");
        int timeTaken = body.containsKey("timeTakenSeconds") ? ((Number) body.get("timeTakenSeconds")).intValue() : 0;

        return ResponseEntity.ok(quizService.submitAttempt(auth.getName(), skillId, skillName, score, total, difficulty, timeTaken));
    }

    @GetMapping("/history")
    public ResponseEntity<List<QuizAttemptResponse>> getHistory(
            Authentication auth,
            @RequestParam(required = false) Long skillId) {
        return ResponseEntity.ok(quizService.getHistory(auth.getName(), skillId));
    }
}