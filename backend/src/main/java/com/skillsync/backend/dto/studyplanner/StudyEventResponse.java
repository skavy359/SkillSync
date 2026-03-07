package com.skillsync.backend.dto.studyplanner;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class StudyEventResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String color;
    private Long skillId;
    private String skillName;
    private LocalDateTime createdAt;
}