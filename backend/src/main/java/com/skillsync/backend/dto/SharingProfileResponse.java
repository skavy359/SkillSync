package com.skillsync.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SharingProfileResponse {
    private Long userId;
    private String userName;
    private Integer totalSkills;
    private Integer totalSessions;
    private Long totalMinutesStudied;
    private String mostActiveCategory;
    private Integer categoryCount;
    private List<SkillSummary> topSkills;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillSummary {
        private Long skillId;
        private String skillName;
        private Integer sessionsCompleted;
        private Long minutesSpent;
    }
}
