package com.skillsync.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupActivityDTO {
    private Long id;
    private Long groupId;
    private Long userId;
    private String userName;
    private String activityType;
    private String description;
    private LocalDateTime createdAt;
}