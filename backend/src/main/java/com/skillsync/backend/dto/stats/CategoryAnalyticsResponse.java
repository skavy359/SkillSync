package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryAnalyticsResponse {
    private Long categoryId;
    private String categoryName;
    private long totalSkills;
    private long totalSessions;
    private int totalMinutes;
    private double avgProgress;
}