package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    private Long userId;
    private String userName;
    private Integer rank;
    private Integer value;
    private String metric;
}