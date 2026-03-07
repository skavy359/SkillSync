package com.skillsync.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStudyGroupRequest {
    private String name;
    private String description;
    private String imageUrl;
}
