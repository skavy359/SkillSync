package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CodingProfileResponse {
    private Long userId;
    private String name;
    private String leetcodeUsername;
    private String codeforcesUsername;
    private String githubUsername;
    private String hackerrankUsername;
    private String atcoderUsername;
    private String spojUsername;
}