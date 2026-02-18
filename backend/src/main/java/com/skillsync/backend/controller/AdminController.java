package com.skillsync.backend.controller;

import com.skillsync.backend.dto.*;
import com.skillsync.backend.dto.stats.AdminStatsResponse;
import com.skillsync.backend.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.skillsync.backend.service.UserService;

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

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminUserResponse>> createUser(
            @RequestBody CreateUserRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User created",
                        userService.adminCreateUser(request)
                )
        );
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long userId) {

        userService.adminDeleteUser(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "User deleted", null)
        );
    }

    @PostMapping("/users/{userId}/skills")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SkillResponse>> addSkillToUser(
            @PathVariable Long userId,
            @RequestBody AddSkillRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill added to user",
                        userService.adminAddSkill(userId, request)
                )
        );
    }

    @DeleteMapping("/skills/{skillId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(
            @PathVariable Long skillId) {

        userService.adminDeleteSkill(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Skill deleted", null)
        );
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @RequestBody CreateCategoryRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category created",
                        userService.adminCreateCategory(request)
                )
        );
    }

    @DeleteMapping("/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long categoryId) {

        userService.adminDeleteCategory(categoryId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Category deleted", null)
        );
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {

        String roleStr = request.get("role");
        Role role = Role.valueOf(roleStr);

        userService.updateUserRole(userId, role);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "User role updated", null)
        );
    }


}