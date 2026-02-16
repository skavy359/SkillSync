package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SkillEtaResponse {
    private Long skillId;
    private String skillName;
    private int progress;
    private int remainingPercent;
    private double velocityPerHour;
    private Double estimatedHours;
}