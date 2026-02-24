package com.skillsync.backend.dto.stats;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAchievementsResponse {
    private int totalUnlocked;
    private int totalAchievements;
    private List<AchievementResponse> achievements;
}