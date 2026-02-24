package com.skillsync.backend.dto.goal;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoalResponse {
    private Long id;
    private Long skillId;
    private String skillName;
    private LocalDate targetDate;
}