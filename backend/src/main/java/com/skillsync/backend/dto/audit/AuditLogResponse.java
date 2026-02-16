package com.skillsync.backend.dto.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuditLogResponse {
    private String action;
    private String entityType;
    private Long entityId;
    private String createdAt;
}
