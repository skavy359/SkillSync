package com.skillsync.backend.controller;

import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.UserProfileResponse;
import com.skillsync.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.skillsync.backend.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserService userService;
    public UserProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile() {

        UserProfileResponse profile = userService.getMyProfile();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Profile fetched successfully",
                        profile
                )
        );
    }

    @PatchMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        UserProfileResponse updatedProfile =
                userService.updateMyProfile(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Profile updated successfully",
                        updatedProfile
                )
        );
    }
}