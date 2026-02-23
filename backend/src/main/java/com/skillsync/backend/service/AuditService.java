package com.skillsync.backend.service;

import com.skillsync.backend.dto.AuditLogResponse;
import com.skillsync.backend.model.AuditLog;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(User user, String action, String entityType, Long entityId) {
        AuditLog log = new AuditLog(user, action, entityType, entityId);
        auditLogRepository.save(log);
    }

    public Page<AuditLogResponse> getAllAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToResponse);
    }

    public List<AuditLogResponse> getAuditLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByCreatedAtDesc(action)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getAuditLogsByEntityType(String entityType) {
        return auditLogRepository.findByEntityTypeOrderByCreatedAtDesc(entityType)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getAuditLogsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getUserAuditLogs(User user) {
        return auditLogRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private AuditLogResponse convertToResponse(AuditLog auditLog) {
        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getUser().getId(),
                auditLog.getUser().getName(),
                auditLog.getAction(),
                auditLog.getEntityType(),
                auditLog.getEntityId(),
                auditLog.getCreatedAt()
        );
    }
}