package com.skillsync.backend.dto.recommendation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecommendationHistoryResponse {
    private Long skillId;
    private String skillName;
    private String reason;
    private String createdAt;
}