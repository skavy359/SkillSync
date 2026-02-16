package com.skillsync.backend.controller;

import com.skillsync.backend.dto.stats.AdminStatsResponse;
import com.skillsync.backend.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
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
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<AdminUserResponse> result =
                userService.getAllUsersForAdmin(role, search, page, size);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Users fetched",
                        result
                )
        );
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getAdminStats() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Admin stats fetched",
                        userService.getAdminStats()
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