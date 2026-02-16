package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompletionProbabilityResponse {
    private Long skillId;
    private String skillName;
    private double probability;
}