package com.skillsync.backend.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.skillsync.backend.dto.EngagementMetricsResponse;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.LearningSessionRepository;
import com.skillsync.backend.repository.SkillRepository;
import com.skillsync.backend.repository.UserRepository;

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

        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        Set<User> activeUsers = learningSessionRepository.findAll().stream()
                .filter(s -> s.getSessionDate().isAfter(thirtyDaysAgo) || s.getSessionDate().isEqual(thirtyDaysAgo))
                .map(s -> s.getSkill().getUser())
                .collect(Collectors.toSet());
        long activeUsersCount = activeUsers.size();
        long inactiveUsersCount = totalUsers - activeUsersCount;
        
        Set<User> usersWithSessions = learningSessionRepository.findAll().stream()
                .map(s -> s.getSkill().getUser())
                .collect(Collectors.toSet());
        long usersWithoutActivity = totalUsers - usersWithSessions.size();

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

        double averageSessionDuration = learningSessionRepository.findAll().stream()
                .mapToInt(session -> session.getDurationMinutes())
                .average()
                .orElse(0.0);

        double userRetentionRate = totalUsers > 0 ? (activeUsersCount * 100.0) / totalUsers : 0;

        long totalSkillsLearned = skillRepository.count();
        long totalSessionsCompleted = learningSessionRepository.count();
        double averageSkillsPerUser = totalUsers > 0 ? totalSkillsLearned / (double) totalUsers : 0;
        double averageSessionsPerUser = totalUsers > 0 ? totalSessionsCompleted / (double) totalUsers : 0;

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

        List<Map<String, Object>> topUsersBySessionMinutes = userRepository.findAll().stream()
                .map(user -> {
                    int totalMinutes = learningSessionRepository.findAll().stream()
                            .filter(session -> session.getSkill().getUser().getId().equals(user.getId()))
                            .mapToInt(session -> session.getDurationMinutes())
                            .sum();
                    Map<String, Object> map = new HashMap<>();
                    map.put("userName", user.getName());
                    map.put("totalSessionMinutes", totalMinutes);
                    return map;
                })
                .filter(map -> ((Integer) map.get("totalSessionMinutes")) > 0)
                .sorted((a, b) -> ((Integer) b.get("totalSessionMinutes")).compareTo((Integer) a.get("totalSessionMinutes")))
                .limit(10)
                .collect(Collectors.toList());

        return new EngagementMetricsResponse(
                totalUsers,
                activeUsersCount,
                inactiveUsersCount,
                mostPopularSkills,
                averageSessionDuration,
                userRetentionRate,
                totalSkillsLearned,
                totalSessionsCompleted,
                averageSkillsPerUser,
                topUsers,
                topUsersBySessionMinutes,
                usersWithoutActivity,
                averageSessionsPerUser,
                skillRepository.findAll().stream()
                        .map(Skill::getCategory)
                        .filter(Objects::nonNull)
                        .distinct()
                        .count()
        );
    }
}