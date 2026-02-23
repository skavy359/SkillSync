package com.skillsync.backend.service;

import com.skillsync.backend.dto.EngagementMetricsResponse;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.LearningSessionRepository;
import com.skillsync.backend.repository.SkillRepository;
import com.skillsync.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final LearningSessionRepository learningSessionRepository;

    public AnalyticsService(
            UserRepository userRepository,
            SkillRepository skillRepository,
            LearningSessionRepository learningSessionRepository
    ) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.learningSessionRepository = learningSessionRepository;
    }

    public EngagementMetricsResponse getEngagementMetrics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(User::getIsActive).count();
        long inactiveUsers = totalUsers - activeUsers;

        // Most popular skills by user count
        List<Map<String, Object>> mostPopularSkills = skillRepository.findAll().stream()
                .collect(Collectors.groupingBy(Skill::getName, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("skillName", entry.getKey());
                    map.put("userCount", entry.getValue().intValue());
                    return map;
                })
                .sorted((a, b) -> ((Integer) b.get("userCount")).compareTo((Integer) a.get("userCount")))
                .limit(10)
                .collect(Collectors.toList());

        // Average session duration (in minutes)
        double averageSessionDuration = learningSessionRepository.findAll().stream()
                .mapToInt(session -> session.getDurationMinutes())
                .average()
                .orElse(0.0);

        // User retention rate (users with activity in last 30 days)
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        Set<User> activeUsersLast30Days = learningSessionRepository.findAll().stream()
                .filter(s -> s.getSessionDate().isAfter(thirtyDaysAgo) || s.getSessionDate().isEqual(thirtyDaysAgo))
                .map(s -> s.getSkill().getUser())
                .collect(Collectors.toSet());
        double userRetentionRate = totalUsers > 0 ? (activeUsersLast30Days.size() * 100.0) / totalUsers : 0;

        long totalSkillsLearned = skillRepository.count();
        long totalSessionsCompleted = learningSessionRepository.count();
        double averageSkillsPerUser = totalUsers > 0 ? totalSkillsLearned / (double) totalUsers : 0;

        // Top users by skill count
        List<Map<String, Object>> topUsers = userRepository.findAll().stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("userName", user.getName());
                    map.put("skillCount", skillRepository.countByUser(user));
                    return map;
                })
                .sorted((a, b) -> ((Long) b.get("skillCount")).compareTo((Long) a.get("skillCount")))
                .limit(10)
                .collect(Collectors.toList());

        return new EngagementMetricsResponse(
                totalUsers,
                activeUsers,
                inactiveUsers,
                mostPopularSkills,
                averageSessionDuration,
                userRetentionRate,
                totalSkillsLearned,
                totalSessionsCompleted,
                averageSkillsPerUser,
                topUsers
        );
    }
}
