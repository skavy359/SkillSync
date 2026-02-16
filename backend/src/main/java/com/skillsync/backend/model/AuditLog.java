package com.skillsync.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String action;
    private String entityType;
    private Long entityId;
    private LocalDateTime createdAt;

    public AuditLog() {}

    public AuditLog(
            User user,
            String action,
            String entityType,
            Long entityId
    ) {
        this.user = user;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.createdAt = LocalDateTime.now();
    }
}