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

    public SkillResponse(Long id, String name, String level, int progress, String status, int totalMinutes) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.progress = progress;
        this.status = status;
        this.totalMinutes = totalMinutes;
        this.category = null;
    }

    public SkillResponse() {

    }
}