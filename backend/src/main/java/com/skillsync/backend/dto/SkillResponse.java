package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SkillResponse {
    private Long id;
    private String name;
    private String level;
    private int progress;
    private String status;
    private int totalMinutes;
    private String category;
    private Long categoryId;
    private Double estimatedHours;

    public SkillResponse(Long id, String name, String level, int progress, String status, int totalMinutes) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.progress = progress;
        this.status = status;
        this.totalMinutes = totalMinutes;
        this.category = null;
        this.categoryId = null;
        this.estimatedHours = null;
    }

    public SkillResponse(Long id, String name, String level, int progress, String status, int totalMinutes, String category) {
        this(id, name, level, progress, status, totalMinutes);
        this.category = category;
    }

    public SkillResponse() {

    }
}