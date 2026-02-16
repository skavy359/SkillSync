package com.skillsync.backend.dto.session;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SessionStatsResponse {
    private long totalSessions;
    private int totalMinutes;
    private double averageMinutes;
}