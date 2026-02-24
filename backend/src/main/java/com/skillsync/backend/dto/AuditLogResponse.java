package com.skillsync.backend.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuditLogResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("userName")
    private String userName;

    @JsonProperty("action")
    private String action;

    @JsonProperty("entityType")
    private String entityType;

    @JsonProperty("entityId")
    private Long entityId;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
}