package com.skillsync.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.skillsync.backend.model.Notification;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    
    // Default deduplication window: 12 hours
    private static final int DEDUPLICATION_HOURS = 12;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }

    public enum NotificationType {
        SESSION_REMINDERS("sessionReminders"),
        GOAL_ALERTS("goalAlerts"),
        SKILL_COMPLETIONS("skillCompletions"),
        LEARNING_STREAKS("learningStreaks"),
        CATEGORY_MILESTONES("categoryMilestones"),
        BURNOUT_WARNINGS("burnoutWarnings"),
        WEEKLY_SUMMARY("weeklySummary"),
        ACHIEVEMENT_NOTIFICATIONS("achievementNotifications");

        private final String preferenceKey;

        NotificationType(String preferenceKey) {
            this.preferenceKey = preferenceKey;
        }

        public String getPreferenceKey() {
            return preferenceKey;
        }
    }

    public void createNotification(
            User user,
            String type,
            String message
    ) {
        Notification notification =
                new Notification(type, message, user);

        notificationRepository.save(notification);
    }

    public void createNotificationIfPreferenceEnabled(
            User user,
            NotificationType type,
            String message
    ) {
        // Check user's preference for this notification type
        boolean isEnabled = isNotificationTypeEnabled(user, type);
        
        if (isEnabled) {
            // Check if a similar notification was created recently to avoid duplicates
            if (!isDuplicateNotification(user, type)) {
                createNotification(user, type.name(), message);
            }
        }
    }
    
    /**
     * Check if a notification of the same type was created within the deduplication window
     */
    private boolean isDuplicateNotification(User user, NotificationType type) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(DEDUPLICATION_HOURS);
        Notification recentNotification = notificationRepository
                .findLatestNotificationOfType(user, type.name(), cutoffTime);
        return recentNotification != null;
    }

    private boolean isNotificationTypeEnabled(User user, NotificationType type) {
        return switch (type) {
            case SESSION_REMINDERS -> user.getNotifSessionReminders() != null && user.getNotifSessionReminders();
            case GOAL_ALERTS -> user.getNotifGoalAlerts() != null && user.getNotifGoalAlerts();
            case SKILL_COMPLETIONS -> user.getNotifSkillCompletions() != null && user.getNotifSkillCompletions();
            case LEARNING_STREAKS -> user.getNotifLearningStreaks() != null && user.getNotifLearningStreaks();
            case CATEGORY_MILESTONES -> user.getNotifCategoryMilestones() != null && user.getNotifCategoryMilestones();
            case BURNOUT_WARNINGS -> user.getNotifBurnoutWarnings() != null && user.getNotifBurnoutWarnings();
            case WEEKLY_SUMMARY -> user.getNotifWeeklySummary() != null && user.getNotifWeeklySummary();
            case ACHIEVEMENT_NOTIFICATIONS -> user.getNotifAchievementNotifications() != null && user.getNotifAchievementNotifications();
        };
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository
                .countByUserAndReadFalse(user);
    }

    public void markAsRead(Long id) {
        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow();

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(User user) {
        List<Notification> unread =
                notificationRepository.findByUserAndReadFalse(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}