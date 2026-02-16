package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UserStreakResponse {
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastActiveDate;
}