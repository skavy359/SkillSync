package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AccountStatusRequest {
    private Long userId;
    private Boolean isActive;
}