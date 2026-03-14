package com.skillsync.backend.repository;

import com.skillsync.backend.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<QuizAttempt> findByUserIdAndSkillIdOrderByCreatedAtDesc(Long userId, Long skillId);
}