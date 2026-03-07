package com.skillsync.backend.service;

import com.skillsync.backend.dto.quiz.QuizAttemptResponse;
import com.skillsync.backend.dto.quiz.QuizQuestionDTO;
import com.skillsync.backend.model.*;
import com.skillsync.backend.repository.QuizAttemptRepository;
import com.skillsync.backend.repository.SkillRepository;
import com.skillsync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {
    @Autowired
    private GeminiService geminiService;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    public List<QuizQuestionDTO> generateQuiz(String skillName, String difficulty, int count) {
        if (count < 1) count = 5;
        if (count > 20) count = 20;
        if (difficulty == null || difficulty.isBlank()) difficulty = "INTERMEDIATE";
        return geminiService.generateQuizQuestions(skillName, difficulty, count);
    }

    public QuizAttemptResponse submitAttempt(String userEmail, Long skillId, String skillName,
                                              int score, int totalQuestions, String difficulty, int timeTakenSeconds) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setScore(score);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setDifficulty(difficulty);
        attempt.setTimeTakenSeconds(timeTakenSeconds);
        attempt.setSkillName(skillName);

        if (skillId != null) {
            Skill skill = skillRepository.findById(skillId).orElse(null);
            attempt.setSkill(skill);
            if (skill != null && (skillName == null || skillName.isBlank())) {
                attempt.setSkillName(skill.getName());
            }
        }

        QuizAttempt saved = quizAttemptRepository.save(attempt);
        return toResponse(saved);
    }

    public List<QuizAttemptResponse> getHistory(String userEmail, Long skillId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<QuizAttempt> attempts;
        if (skillId != null) {
            attempts = quizAttemptRepository.findByUserIdAndSkillIdOrderByCreatedAtDesc(user.getId(), skillId);
        } else {
            attempts = quizAttemptRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }
        return attempts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private QuizAttemptResponse toResponse(QuizAttempt a) {
        QuizAttemptResponse r = new QuizAttemptResponse();
        r.setId(a.getId());
        r.setSkillName(a.getSkillName());
        r.setScore(a.getScore());
        r.setTotalQuestions(a.getTotalQuestions());
        r.setDifficulty(a.getDifficulty());
        r.setTimeTakenSeconds(a.getTimeTakenSeconds());
        r.setPercentage(a.getTotalQuestions() > 0 ? (double) a.getScore() / a.getTotalQuestions() * 100 : 0);
        r.setCreatedAt(a.getCreatedAt());
        if (a.getSkill() != null) {
            r.setSkillId(a.getSkill().getId());
        }
        return r;
    }
}