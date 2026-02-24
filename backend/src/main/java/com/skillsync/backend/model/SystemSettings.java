package com.skillsync.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
public class SystemSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String siteName = "SkillSync";

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean maintenanceMode = false;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean allowNewRegistrations = true;

    private Integer sessionReminderHours = 24;

    private Integer inactivityWarningDays = 30;

    private Integer maxSessionDurationMinutes = 120;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean enableLeaderboards = true;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean enableBadges = true;
}