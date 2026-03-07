package com.skillsync.backend.dto.goal;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateGoalRequest {
    private LocalDate targetDate;
}