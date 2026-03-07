package com.skillsync.backend.dto;

import com.skillsync.backend.model.SkillLevel;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddSkillRequest {
    @NotBlank(message = "Skill name is required")
    private String name;

    private SkillLevel level = SkillLevel.BEGINNER;

    private Long categoryId;

    private Double estimatedHours;
}