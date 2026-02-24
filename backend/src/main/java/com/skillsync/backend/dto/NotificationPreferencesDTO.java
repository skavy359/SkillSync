package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferencesDTO {
    private Boolean sessionReminders;
    private Boolean goalAlerts;
    private Boolean skillCompletions;
    private Boolean learningStreaks;
    private Boolean categoryMilestones;
    private Boolean burnoutWarnings;
    private Boolean weeklySummary;
    private Boolean achievementNotifications;
}