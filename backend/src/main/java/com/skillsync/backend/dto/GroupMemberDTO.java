package com.skillsync.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberDTO {
    private Long userId;
    private String userName;
    private String userEmail;
    private String userAbout;
    private String role;
    private LocalDateTime joinedAt;
}