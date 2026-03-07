package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAnnouncementRequest {
    private String title;
    private String content;
    private Boolean isPinned;
}