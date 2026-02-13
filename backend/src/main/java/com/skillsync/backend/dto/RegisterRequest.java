package com.skillsync.backend.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.*;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message="Name is required")
    @Size(min=2,message="Name must be at least 2 characters")
    @Pattern(regexp = "^[a-zA-Z]+(?: [a-zA-Z]+)*$" , message = "Name should contain only characters")
    private String name;

    @Email(message="Email must be valid")
    @NotBlank(message="Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min=8,max=20,message="Password must be 8-20 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\\d){3,})(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{5,}$",
            message = "Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 3 digits, and 1 symbol."
    )
    private String password;
}