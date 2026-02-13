package com.skillsync.backend.dto;

import com.skillsync.backend.model.SkillLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddSkillRequest {
    @NotBlank(message = "Skill name is required")
    private String name;

    @NotNull(message = "Skill level is required")
    private SkillLevel level;
}