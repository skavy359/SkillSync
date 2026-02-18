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

    public SkillResponse() {

    }
}