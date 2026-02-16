package com.skillsync.backend.dto.recommendation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserRecommendationResponse {
    private String focusSkill;
    private String slowSkill;
    private String strongSkill;
    private int suggestedDailyMinutes;
}