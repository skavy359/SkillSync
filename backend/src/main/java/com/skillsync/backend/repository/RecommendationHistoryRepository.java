package com.skillsync.backend.repository;

import com.skillsync.backend.model.RecommendationHistory;
import com.skillsync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendationHistoryRepository
        extends JpaRepository<RecommendationHistory, Long> {
    List<RecommendationHistory>findByUserOrderByCreatedAtDesc(User user);
}