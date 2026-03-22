package com.skillsync.backend.controller;

import com.skillsync.backend.dto.*;
import com.skillsync.backend.dto.stats.AdminStatsResponse;
import com.skillsync.backend.model.Role;
import com.skillsync.backend.service.AuditService;
import com.skillsync.backend.service.SystemSettingsService;
import com.skillsync.backend.service.AnalyticsService;
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
    private final AuditService auditService;
    private final SystemSettingsService systemSettingsService;
    private final AnalyticsService analyticsService;

    public AdminController(
            UserService userService,
            AuditService auditService,
            SystemSettingsService systemSettingsService,
            AnalyticsService analyticsService
    ) {
        this.userService = userService;
        this.auditService = auditService;
        this.systemSettingsService = systemSettingsService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminDashboard() {
        return ResponseEntity.ok("Welcome ADMIN");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getUsers(
            @RequestParam(name = "role", required = false) Role role,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
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
            @PathVariable("userId") Long userId) {

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
            @PathVariable("userId") Long userId) {

        userService.adminDeleteUser(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "User deleted", null)
        );
    }

    @PostMapping("/users/{userId}/skills")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SkillResponse>> addSkillToUser(
            @PathVariable("userId") Long userId,
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
            @PathVariable("skillId") Long skillId) {

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
            @PathVariable("categoryId") Long categoryId) {

        userService.adminDeleteCategory(categoryId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Category deleted", null)
        );
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(
            @PathVariable("userId") Long userId,
            @RequestBody Map<String, String> request) {

        String roleStr = request.get("role");
        Role role = Role.valueOf(roleStr);

        userService.updateUserRole(userId, role);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "User role updated", null)
        );
    }

    @PutMapping("/users/{userId}/account-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleAccountStatus(
            @PathVariable("userId") Long userId,
            @RequestBody AccountStatusRequest request) {

        userService.toggleAccountStatus(userId, request.getIsActive());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        request.getIsActive() ? "Account activated" : "Account deactivated",
                        null
                )
        );
    }

    @PutMapping("/users/{userId}/password-reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> resetUserPassword(
            @PathVariable("userId") Long userId,
            @RequestBody PasswordResetRequest request) {

        userService.resetUserPassword(request.getUserId(), request.getNewPassword());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Password reset successfully", null)
        );
    }

    @GetMapping("/users/inactive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getInactiveUsers(
            @RequestParam(name = "days", defaultValue = "30") int days) {

        List<UserResponse> inactiveUsers = userService.getInactiveUsers(days);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Inactive users fetched", inactiveUsers)
        );
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getAuditLogs(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {

        Page<AuditLogResponse> logs = auditService.getAllAuditLogs(page, size);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Audit logs fetched", logs)
        );
    }

    @GetMapping("/audit-logs/action/{action}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAuditLogsByAction(
            @PathVariable("action") String action) {

        List<AuditLogResponse> logs = auditService.getAuditLogsByAction(action);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Audit logs fetched by action", logs)
        );
    }

    @GetMapping("/audit-logs/entity/{entityType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAuditLogsByEntityType(
            @PathVariable("entityType") String entityType) {

        List<AuditLogResponse> logs = auditService.getAuditLogsByEntityType(entityType);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Audit logs fetched by entity type", logs)
        );
    }

    @GetMapping("/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SystemSettingsResponse>> getSystemSettings() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "System settings fetched",
                        systemSettingsService.getSettings()
                )
        );
    }

    @PutMapping("/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SystemSettingsResponse>> updateSystemSettings(
            @RequestBody SystemSettingsResponse request) {

        SystemSettingsResponse updated = systemSettingsService.updateSettings(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "System settings updated", updated)
        );
    }

    @GetMapping("/analytics/engagement")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EngagementMetricsResponse>> getEngagementMetrics() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Engagement metrics fetched",
                        analyticsService.getEngagementMetrics()
                )
        );
    }

    @GetMapping("/users/{userId}/activity-report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserActivityReport(
            @PathVariable("userId") Long userId) {

        Map<String, Object> report = userService.getUserActivityReport(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "User activity report fetched", report)
        );
    }

    @PostMapping("/notifications/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> broadcastNotification(
            @RequestBody BroadcastNotificationRequest request) {

        userService.broadcastNotification(
                request.getTitle(),
                request.getMessage(),
                request.getTargetUserIds()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Notification sent to " + 
                        (request.getTargetUserIds() == null ? "all users" : request.getTargetUserIds().size() + " users"),
                        null
                )
        );
    }

    @GetMapping("/users/search/email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> searchUsersByEmail(
            @RequestParam("email") String email) {

        List<AdminUserResponse> users = userService.searchUsersByEmail(email);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Users found", users)
        );
    }
}