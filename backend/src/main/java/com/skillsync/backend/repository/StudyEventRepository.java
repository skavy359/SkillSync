package com.skillsync.backend.repository;

import com.skillsync.backend.model.StudyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StudyEventRepository extends JpaRepository<StudyEvent, Long> {
    List<StudyEvent> findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(Long userId, LocalDateTime start, LocalDateTime end);
    List<StudyEvent> findByUserIdOrderByStartTimeAsc(Long userId);
}