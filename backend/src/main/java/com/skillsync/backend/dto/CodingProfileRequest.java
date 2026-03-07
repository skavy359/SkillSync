package com.skillsync.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodingProfileRequest {
    private String leetcodeUsername;
    private String codeforcesUsername;
    private String githubUsername;
    private String hackerrankUsername;
    private String atcoderUsername;
    private String spojUsername;
}
