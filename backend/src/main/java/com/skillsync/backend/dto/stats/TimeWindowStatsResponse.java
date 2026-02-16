package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TimeWindowStatsResponse {
    private int totalMinutes;
    private long totalSessions;
    private long activeDays;
}