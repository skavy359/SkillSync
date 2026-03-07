package com.skillsync.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupAnnouncementDTO {
    private Long id;
    private Long groupId;
    private Long createdById;
    private String createdByName;
    private String createdByEmail;
    private String title;
    private String content;
    private Boolean isPinned;
    private LocalDateTime createdAt;
    private LocalDateTime pinnedAt;
    private LocalDateTime updatedAt;
}