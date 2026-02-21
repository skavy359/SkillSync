package com.skillsync.backend.model;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(columnDefinition = "TEXT")
    private String about;

    private LocalDateTime createdAt;

    // Notification Preferences
    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean notifSessionReminders = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean notifGoalAlerts = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean notifSkillCompletions = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean notifLearningStreaks = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean notifCategoryMilestones = false;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean notifBurnoutWarnings = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean notifWeeklySummary = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean notifAchievementNotifications = true;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}