package com.skillsync.backend.dto.quiz;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class QuizAttemptResponse {
    private Long id;
    private String skillName;
    private Long skillId;
    private int score;
    private int totalQuestions;
    private String difficulty;
    private int timeTakenSeconds;
    private double percentage;
    private LocalDateTime createdAt;
}
