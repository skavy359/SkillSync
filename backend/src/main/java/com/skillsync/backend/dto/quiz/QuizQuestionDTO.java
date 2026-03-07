package com.skillsync.backend.dto.quiz;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class QuizQuestionDTO {
    private String question;
    private List<String> options;
    private int correctAnswer;
    private String explanation;
}