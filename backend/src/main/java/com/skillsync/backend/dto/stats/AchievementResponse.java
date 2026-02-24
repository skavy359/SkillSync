package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AchievementResponse {
    private String id;
    private String title;
    private String description;
    private String icon;
    private String gradient;
    private String borderColor;
    private Boolean unlocked;
    private String requirement;
    private String currentProgress;
}