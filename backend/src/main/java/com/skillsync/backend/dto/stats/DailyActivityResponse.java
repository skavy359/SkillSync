package com.skillsync.backend.dto.stats;

import lombok.Getter;
import java.time.LocalDate;

@Getter
public class DailyActivityResponse {

    private LocalDate date;
    private Long minutes;

    public DailyActivityResponse(LocalDate date, Long minutes) {
        this.date = date;
        this.minutes = minutes;
    }
}