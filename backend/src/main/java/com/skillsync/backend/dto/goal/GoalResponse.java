package com.skillsync.backend.dto.goal;

import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.User;
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

    public GoalResponse(Long id, User user, Skill skill, LocalDate targetDate) {
    }
}