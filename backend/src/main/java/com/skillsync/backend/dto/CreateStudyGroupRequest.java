package com.skillsync.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStudyGroupRequest {
    private String name;
    private String description;
    private Long skillId;
    private Boolean isPublic = true;
    private String imageUrl;
}