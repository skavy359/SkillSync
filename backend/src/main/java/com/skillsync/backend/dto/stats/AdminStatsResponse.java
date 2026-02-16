package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalSkills;
    private long activeSkills;
    private long completedSkills;
    private long adminCount;
    private long userCount;
}