package com.skillsync.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSkillRequest {
    @NotBlank(message = "Skill name is required")
    private String name;
}
