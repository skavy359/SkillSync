package com.skillsync.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.skillsync.backend.dto.AdminUserResponse;
import com.skillsync.backend.dto.ApiResponse;
import java.util.List;
import com.skillsync.backend.service.UserService;
import com.skillsync.backend.dto.SkillResponse;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminDashboard() {
        return ResponseEntity.ok("Welcome ADMIN");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {

        List<AdminUserResponse> users =
                userService.getAllUsersForAdmin();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "All users fetched successfully",
                        users
                )
        );
    }

    @GetMapping("/users/{userId}/skills")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getUserSkills(
            @PathVariable Long userId) {

        List<SkillResponse> skills =
                userService.getSkillsOfUserForAdmin(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User skills fetched successfully",
                        skills
                )
        );
    }
}

