package com.skillsync.backend.repository;

import com.skillsync.backend.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByUser(User user);
    Optional<Skill> findByIdAndUser(Long id, User user);
    boolean existsByIdAndUser(Long id, User user);
    List<Skill> findByUserAndStatus(User user, SkillStatus status);
    List<Skill> findByUserAndLevel(User user, SkillLevel level);
    List<Skill> findByUserAndStatusAndLevel(User user, SkillStatus status, SkillLevel level);
    List<Skill> findByUserAndNameContainingIgnoreCase(User user, String name);
    long countByUser(User user);
    long countByUserAndStatus(User user, SkillStatus status);
    long countByUserAndLevel(User user, SkillLevel level);
    Optional<Skill> findTopByUserOrderByProgressDesc(User user);
    Optional<Skill> findTopByUserOrderByProgressAsc(User user);
    long countByStatus(SkillStatus status);
    long countByLevel(SkillLevel level);
    Page<Skill> findByUser(User user, Pageable pageable);
    Page<Skill> findByUserAndStatus(User user, SkillStatus status, Pageable pageable);
    Page<Skill> findByUserAndLevel(User user, SkillLevel level, Pageable pageable);

    Page<Skill> findByUserAndNameContainingIgnoreCase(
            User user,
            String name,
            Pageable pageable
    );

    List<Skill> findAllByCategory(SkillCategory category);
    long countByCategory(SkillCategory category);

    @Query("""
       SELECT COALESCE(AVG(s.progress),0)
       FROM Skill s
       WHERE s.category = :category
       """)
    double avgProgressByCategory(@Param("category") SkillCategory category);
}