package com.skillsync.backend.controller;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.RegisterRequest;
import com.skillsync.backend.service.UserService;
import com.skillsync.backend.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.skillsync.backend.dto.UserResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @jakarta.validation.Valid @RequestBody RegisterRequest request){
        UserResponse userResponse = userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "User registered successfully!",
                        userResponse
                ));
    }
}