package com.skillsync.backend.service;

import org.springframework.stereotype.Service;

import com.skillsync.backend.dto.SystemSettingsResponse;
import com.skillsync.backend.model.SystemSettings;
import com.skillsync.backend.repository.SystemSettingsRepository;

@Service
public class SystemSettingsService {
    private final SystemSettingsRepository systemSettingsRepository;

    public SystemSettingsService(SystemSettingsRepository systemSettingsRepository) {
        this.systemSettingsRepository = systemSettingsRepository;
    }

    public SystemSettingsResponse getSettings() {
        SystemSettings settings = systemSettingsRepository.findById(1L)
                .orElseGet(() -> {
                    SystemSettings newSettings = new SystemSettings();
                    return systemSettingsRepository.save(newSettings);
                });
        return convertToResponse(settings);
    }

    public SystemSettingsResponse updateSettings(SystemSettingsResponse request) {
        SystemSettings settings = systemSettingsRepository.findById(1L)
                .orElseGet(SystemSettings::new);

        if (request.getSiteName() != null) {
            settings.setSiteName(request.getSiteName());
        }
        if (request.getMaintenanceMode() != null) {
            settings.setMaintenanceMode(request.getMaintenanceMode());
        }
        if (request.getAllowNewRegistrations() != null) {
            settings.setAllowNewRegistrations(request.getAllowNewRegistrations());
        }
        if (request.getSessionReminderHours() != null) {
            settings.setSessionReminderHours(request.getSessionReminderHours());
        }
        if (request.getInactivityWarningDays() != null) {
            settings.setInactivityWarningDays(request.getInactivityWarningDays());
        }
        if (request.getMaxSessionDurationMinutes() != null) {
            settings.setMaxSessionDurationMinutes(request.getMaxSessionDurationMinutes());
        }
        if (request.getEnableLeaderboards() != null) {
            settings.setEnableLeaderboards(request.getEnableLeaderboards());
        }
        if (request.getEnableBadges() != null) {
            settings.setEnableBadges(request.getEnableBadges());
        }

        settings = systemSettingsRepository.save(settings);
        return convertToResponse(settings);
    }

    private SystemSettingsResponse convertToResponse(SystemSettings settings) {
        return new SystemSettingsResponse(
                settings.getId(),
                settings.getSiteName(),
                settings.getMaintenanceMode(),
                settings.getAllowNewRegistrations(),
                settings.getSessionReminderHours(),
                settings.getInactivityWarningDays(),
                settings.getMaxSessionDurationMinutes(),
                settings.getEnableLeaderboards(),
                settings.getEnableBadges()
        );
    }
}
