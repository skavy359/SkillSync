package com.skillsync.backend.dto.session;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class AddSessionRequest {
    private int durationMinutes;
    private LocalDate sessionDate;
    private String notes;
}