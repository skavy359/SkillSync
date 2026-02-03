package com.skillsync.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
}
