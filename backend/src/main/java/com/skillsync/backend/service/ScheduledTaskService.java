package com.skillsync.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;

@Service
public class ScheduledTaskService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final UserService userService;

    public ScheduledTaskService(
            UserRepository userRepository,
            NotificationService notificationService,
            UserService userService
    ) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    /**
     * Runs every Monday at 9:00 AM to send weekly learning summaries
     * Cron expression: 0 0 9 * * 1 (second minute hour day month day-of-week)
     * This means: 9:00 AM on Mondays
     */
    @Scheduled(cron = "0 0 9 * * 1")
    public void sendWeeklySummaries() {
        List<User> allUsers = userRepository.findAll();
        
        for (User user : allUsers) {
            // Only send if user has enabled weekly summaries
            if (user.getNotifWeeklySummary() != null && user.getNotifWeeklySummary()) {
                generateAndSendWeeklySummary(user);
            }
        }
    }

    private void generateAndSendWeeklySummary(User user) {
        try {
            // Calculate last week's date range (Monday to Sunday)
            LocalDate today = LocalDate.now();
            LocalDate lastMonday = today.minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            LocalDate lastSunday = lastMonday.plusDays(6);

            // Get last week's stats
            // Note: This would need additional methods in UserService to fetch week-specific stats
            String summaryMessage = buildWeeklySummaryMessage(user, lastMonday, lastSunday);
            
            // Send notification with the summary
            notificationService.createNotification(
                    user,
                    NotificationService.NotificationType.WEEKLY_SUMMARY.name(),
                    summaryMessage
            );
        } catch (Exception e) {
            // Log error but don't fail the entire scheduled task
            System.err.println("Error generating weekly summary for user " + user.getId() + ": " + e.getMessage());
        }
    }

    private String buildWeeklySummaryMessage(User user, LocalDate startDate, LocalDate endDate) {
        // This is a placeholder message structure
        // In a real implementation, you would fetch actual statistics for the user
        StringBuilder summary = new StringBuilder();
        summary.append("📊 Your Weekly Learning Summary\n\n");
        summary.append("Week of ").append(startDate).append(" to ").append(endDate).append("\n\n");
        summary.append("Keep up your learning streak and continue growing your skills! ");
        summary.append("Check the Dashboard for detailed analytics.\n");
        
        return summary.toString();
    }
}      
