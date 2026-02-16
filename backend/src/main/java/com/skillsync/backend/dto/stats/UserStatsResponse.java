package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserStatsResponse {
    private long totalSkills;
    private long activeSkills;
    private long completedSkills;
    private double completionRate;
    private double averageProgress;
    private String topSkill;
}