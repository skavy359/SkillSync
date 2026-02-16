package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserLearningStatsResponse {
    private long totalSkills;
    private long totalSessions;
    private int totalMinutes;
    private double avgMinutesPerSkill;
    private String mostStudiedSkill;
}