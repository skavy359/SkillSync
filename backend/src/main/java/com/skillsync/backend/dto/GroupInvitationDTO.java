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
public class GroupInvitationDTO {
    private Long id;
    private Long groupId;
    private String groupName;
    private Long invitedUserId;
    private Long invitedByUserId;
    private String invitedByName;
    private String invitedByEmail;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime respondedAt;
}
