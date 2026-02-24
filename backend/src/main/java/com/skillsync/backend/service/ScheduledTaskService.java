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

    @Scheduled(cron = "0 0 9 * * 1")
    public void sendWeeklySummaries() {
        List<User> allUsers = userRepository.findAll();
        
        for (User user : allUsers) {
            if (user.getNotifWeeklySummary() != null && user.getNotifWeeklySummary()) {
                generateAndSendWeeklySummary(user);
            }
        }
    }

    private void generateAndSendWeeklySummary(User user) {
        try {
            LocalDate today = LocalDate.now();
            LocalDate lastMonday = today.minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            LocalDate lastSunday = lastMonday.plusDays(6);

            String summaryMessage = buildWeeklySummaryMessage(user, lastMonday, lastSunday);
            
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.WEEKLY_SUMMARY,
                    summaryMessage
            );
        } catch (Exception e) {
            System.err.println("Error generating weekly summary for user " + user.getId() + ": " + e.getMessage());
        }
    }

    private String buildWeeklySummaryMessage(User user, LocalDate startDate, LocalDate endDate) {
        StringBuilder summary = new StringBuilder();
        summary.append("📊 Your Weekly Learning Summary\n\n");
        summary.append("Week of ").append(startDate).append(" to ").append(endDate).append("\n\n");
        summary.append("Keep up your learning streak and continue growing your skills! ");
        summary.append("Check the Dashboard for detailed analytics.\n");
        
        return summary.toString();
    }
}