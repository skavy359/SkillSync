package com.skillsync.backend.dto;

import com.skillsync.backend.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}