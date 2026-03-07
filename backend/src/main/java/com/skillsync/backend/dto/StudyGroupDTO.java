package com.skillsync.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudyGroupDTO {
    private Long id;
    private String name;
    private String description;
    private Long skillId;
    private String skillName;
    private Long createdById;
    private String createdByName;
    private String createdByEmail;
    private Boolean isPublic;
    private String imageUrl;
    private Integer memberCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // For group details view
    private List<GroupMemberDTO> members;
    private Boolean isMember;
    private Boolean isAdmin;
}
