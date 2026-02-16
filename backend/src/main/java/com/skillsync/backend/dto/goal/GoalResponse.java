package com.skillsync.backend.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class GoalResponse {
    private Long goalId;
    private Long skillId;
    private String skillName;
    private LocalDate targetDate;
}