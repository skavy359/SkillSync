package com.skillsync.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Integer totalSkills;
    private Integer totalSessions;
    private LocalDateTime createdAt;

    public AdminUserResponse() {

    }
}