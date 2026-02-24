package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class PlatformStatsResponse {
    private long totalUsers;
    private long totalSessions;
    private long totalSkills;
}