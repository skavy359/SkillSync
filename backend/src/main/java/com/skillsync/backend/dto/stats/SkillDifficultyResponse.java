package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SkillDifficultyResponse {
    private Long skillId;
    private String skillName;
    private int totalMinutes;
    private int progress;
    private double difficultyScore;
}