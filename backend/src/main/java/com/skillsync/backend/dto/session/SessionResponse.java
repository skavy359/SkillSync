package com.skillsync.backend.dto.session;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class SessionResponse {
    private Long id;
    private int durationMinutes;
    private LocalDate sessionDate;
    private String notes;
}