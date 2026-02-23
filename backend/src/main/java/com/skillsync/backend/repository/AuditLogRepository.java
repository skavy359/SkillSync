package com.skillsync.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillsync.backend.model.AuditLog;
import com.skillsync.backend.model.User;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserOrderByCreatedAtDesc(User user);

    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);

    List<AuditLog> findByEntityTypeOrderByCreatedAtDesc(String entityType);

    List<AuditLog> findByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);

    List<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
}