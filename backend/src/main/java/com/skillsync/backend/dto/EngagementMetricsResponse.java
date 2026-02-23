package com.skillsync.backend.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EngagementMetricsResponse {
    @JsonProperty("totalUsers")
    private Long totalUsers;

    @JsonProperty("activeUsers")
    private Long activeUsers;

    @JsonProperty("inactiveUsers")
    private Long inactiveUsers;

    @JsonProperty("mostPopularSkills")
    private java.util.List<Map<String, Object>> mostPopularSkills;

    @JsonProperty("averageSessionDuration")
    private Double averageSessionDuration;

    @JsonProperty("userRetentionRate")
    private Double userRetentionRate;

    @JsonProperty("totalSkillsLearned")
    private Long totalSkillsLearned;

    @JsonProperty("totalSessionsCompleted")
    private Long totalSessionsCompleted;

    @JsonProperty("averageSkillsPerUser")
    private Double averageSkillsPerUser;

    @JsonProperty("topUsers")
    private java.util.List<Map<String, Object>> topUsers;

    @JsonProperty("topUsersBySessionMinutes")
    private java.util.List<Map<String, Object>> topUsersBySessionMinutes;

    @JsonProperty("usersWithoutActivity")
    private Long usersWithoutActivity;

    @JsonProperty("averageSessionsPerUser")
    private Double averageSessionsPerUser;

    @JsonProperty("totalCategoriesUsed")
    private Long totalCategoriesUsed;
}
