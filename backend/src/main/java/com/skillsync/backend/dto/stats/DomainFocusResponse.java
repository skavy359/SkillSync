package com.skillsync.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DomainFocusResponse {
    private Long categoryId;
    private String categoryName;
    private int totalMinutes;
}