package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BurnoutRiskResponse {
    private int weeklyMinutes;
    private int monthlyMinutes;
    private double ratio;
    private String riskLevel;
}