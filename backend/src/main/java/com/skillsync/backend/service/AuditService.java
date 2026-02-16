package com.skillsync.backend.service;

import com.skillsync.backend.model.AuditLog;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(
            User user,
            String action,
            String entityType,
            Long entityId
    ) {
        auditLogRepository.save(
                new AuditLog(
                        user,
                        action,
                        entityType,
                        entityId
                )
        );
    }
}