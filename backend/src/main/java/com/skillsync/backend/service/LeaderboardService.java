package com.skillsync.backend.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.skillsync.backend.dto.LeaderboardEntryResponse;
import com.skillsync.backend.dto.SharingProfileResponse;
import com.skillsync.backend.model.LearningSession;
import com.skillsync.backend.model.Role;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.LearningSessionRepository;
import com.skillsync.backend.repository.SkillRepository;
import com.skillsync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final LearningSessionRepository learningSessionRepository;

    public List<LeaderboardEntryResponse> getSkillsLeaderboard() {
        List<User> users = userRepository.findAll().stream()
            .filter(user -> !user.getRole().equals(Role.ADMIN))
            .toList();
        
        List<LeaderboardEntryResponse> entries = users.stream()
            .map(user -> {
                long skillCount = skillRepository.countByUserId(user.getId());
                return new LeaderboardEntryResponse(
                    user.getId(),
                    user.getName(),
                    0,
                    (int) skillCount,
                    "Skills"
                );
            })
            .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
            .collect(Collectors.toList());

        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        return entries;
    }

    public List<LeaderboardEntryResponse> getSessionsLeaderboard() {
        List<User> users = userRepository.findAll().stream()
            .filter(user -> !user.getRole().equals(Role.ADMIN))
            .toList();
        
        List<LeaderboardEntryResponse> entries = users.stream()
            .map(user -> {
                long sessionCount = learningSessionRepository.countBySkill_UserId(user.getId());
                return new LeaderboardEntryResponse(
                    user.getId(),
                    user.getName(),
                    0,
                    (int) sessionCount,
                    "Sessions"
                );
            })
            .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
            .collect(Collectors.toList());

        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        return entries;
    }

    public SharingProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Skill> userSkills = skillRepository.findByUserId(userId);

        int totalSkills = userSkills.size();
        
        long totalMinutes = userSkills.stream()
            .mapToLong(skill -> {
                List<LearningSession> sessions = learningSessionRepository.findBySkillId(skill.getId());
                return sessions.stream()
                    .mapToLong(s -> s.getDurationMinutes())
                    .sum();
            })
            .sum();

        long totalSessions = learningSessionRepository.countBySkill_UserId(userId);

        String mostActiveCategory = "N/A";
        int categoryCount = 0;
        
        if (!userSkills.isEmpty()) {
            mostActiveCategory = userSkills.stream()
                .filter(skill -> skill.getCategory() != null)
                .collect(Collectors.groupingBy(
                    skill -> skill.getCategory().getName(),
                    Collectors.counting()
                ))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

            categoryCount = (int) userSkills.stream()
                .filter(skill -> skill.getCategory() != null)
                .map(skill -> skill.getCategory().getId())
                .distinct()
                .count();
        }

        List<SharingProfileResponse.SkillSummary> topSkills = userSkills.stream()
            .map(skill -> {
                List<LearningSession> sessions = learningSessionRepository.findBySkillId(skill.getId());
                long minutesSpent = sessions.stream()
                    .mapToLong(s -> s.getDurationMinutes())
                    .sum();
                int sessionsCount = sessions.size();
                return new SharingProfileResponse.SkillSummary(
                    skill.getId(),
                    skill.getName(),
                    sessionsCount,
                    minutesSpent
                );
            })
            .sorted((a, b) -> Long.compare(b.getMinutesSpent(), a.getMinutesSpent()))
            .limit(5)
            .toList();

        return new SharingProfileResponse(
            user.getId(),
            user.getName(),
            totalSkills,
            (int) totalSessions,
            totalMinutes,
            mostActiveCategory,
            categoryCount,
            topSkills
        );
    }
}