package com.skillsync.backend.dto.goal;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class CreateGoalRequest {
    private Long skillId;
    private LocalDate targetDate;
}