package com.skillsync.backend.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GoalAnalyticsResponse {
    private Long goalId;
    private String skillName;
    private int progress;
    private int remainingPercent;
    private long daysLeft;
    private double currentVelocity;
    private double requiredVelocity;
    private String riskLevel;
}