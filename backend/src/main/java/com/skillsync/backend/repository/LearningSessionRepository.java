package com.skillsync.backend.repository;

import com.skillsync.backend.dto.stats.DailyActivityResponse;
import com.skillsync.backend.model.LearningSession;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.SkillCategory;
import com.skillsync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface LearningSessionRepository
        extends JpaRepository<LearningSession, Long> {

    List<LearningSession> findBySkill(Skill skill);
    long countBySkill(Skill skill);

    @Query("""
       SELECT COALESCE(SUM(ls.durationMinutes), 0)
       FROM LearningSession ls
       WHERE ls.skill = :skill
       """)
    int sumDurationMinutesBySkill(@Param("skill") Skill skill);

    long countBySkill_User(User user);

    @Query("""
       SELECT COALESCE(SUM(ls.durationMinutes),0)
       FROM LearningSession ls
       WHERE ls.skill.user = :user
       """)
    int sumDurationMinutesByUser(@Param("user") User user);

    @Query("""
       SELECT ls.skill.name
       FROM LearningSession ls
       WHERE ls.skill.user = :user
       GROUP BY ls.skill.name
       ORDER BY SUM(ls.durationMinutes) DESC
       LIMIT 1
       """)
    String findMostStudiedSkill(@Param("user") User user);

    @Query("""
       SELECT DISTINCT ls.sessionDate
       FROM LearningSession ls
       WHERE ls.skill.user = :user
       ORDER BY ls.sessionDate DESC
       """)
    List<LocalDate> findSessionDatesByUser(@Param("user") User user);

    @Query("""
       SELECT new com.skillsync.backend.dto.stats.DailyActivityResponse(
           ls.sessionDate,
           SUM(ls.durationMinutes)
       )
       FROM LearningSession ls
       WHERE ls.skill.user = :user
       GROUP BY ls.sessionDate
       ORDER BY ls.sessionDate
       """)
    List<DailyActivityResponse> getDailyActivity(@Param("user") User user);

    @Query("""
       SELECT COUNT(ls)
       FROM LearningSession ls
       WHERE ls.skill.category = :category
       """)
    long countByCategory(@Param("category") SkillCategory category);

    @Query("""
       SELECT COALESCE(SUM(ls.durationMinutes),0)
       FROM LearningSession ls
       WHERE ls.skill.category = :category
       """)
    int sumMinutesByCategory(@Param("category") SkillCategory category);

    @Query("""
       SELECT COALESCE(SUM(ls.durationMinutes),0)
       FROM LearningSession ls
       WHERE ls.skill.user = :user
       AND ls.sessionDate >= :startDate
       """)
    int sumMinutesFromDate(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate
    );

    @Query("""
       SELECT COUNT(ls)
       FROM LearningSession ls
       WHERE ls.skill.user = :user
       AND ls.sessionDate >= :startDate
       """)
    long countSessionsFromDate(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate
    );

    @Query("""
       SELECT COUNT(DISTINCT ls.sessionDate)
       FROM LearningSession ls
       WHERE ls.skill.user = :user
       AND ls.sessionDate >= :startDate
       """)
    long countActiveDaysFromDate(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate
    );
}