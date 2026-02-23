package com.skillsync.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SystemSettingsResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("siteName")
    private String siteName;

    @JsonProperty("maintenanceMode")
    private Boolean maintenanceMode;

    @JsonProperty("allowNewRegistrations")
    private Boolean allowNewRegistrations;

    @JsonProperty("sessionReminderHours")
    private Integer sessionReminderHours;

    @JsonProperty("inactivityWarningDays")
    private Integer inactivityWarningDays;

    @JsonProperty("maxSessionDurationMinutes")
    private Integer maxSessionDurationMinutes;

    @JsonProperty("enableLeaderboards")
    private Boolean enableLeaderboards;

    @JsonProperty("enableBadges")
    private Boolean enableBadges;
}
