package com.skillsync.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.CategoryResponse;
import com.skillsync.backend.dto.CreateCategoryRequest;
import com.skillsync.backend.dto.NotificationPreferencesDTO;
import com.skillsync.backend.dto.SkillResponse;
import com.skillsync.backend.dto.UpdateProfileRequest;
import com.skillsync.backend.dto.UserProfileResponse;
import com.skillsync.backend.dto.audit.AuditLogResponse;
import com.skillsync.backend.dto.goal.CreateGoalRequest;
import com.skillsync.backend.dto.goal.GoalAnalyticsResponse;
import com.skillsync.backend.dto.goal.GoalResponse;
import com.skillsync.backend.dto.goal.UpdateGoalRequest;
import com.skillsync.backend.dto.recommendation.RecommendationHistoryResponse;
import com.skillsync.backend.dto.recommendation.SkillRecommendationResponse;
import com.skillsync.backend.dto.recommendation.UserRecommendationResponse;
import com.skillsync.backend.dto.stats.BurnoutRiskResponse;
import com.skillsync.backend.dto.stats.CategoryAnalyticsResponse;
import com.skillsync.backend.dto.stats.DailyActivityResponse;
import com.skillsync.backend.dto.stats.DomainFocusResponse;
import com.skillsync.backend.dto.stats.TimeWindowStatsResponse;
import com.skillsync.backend.dto.stats.UserLearningStatsResponse;
import com.skillsync.backend.dto.stats.UserStatsResponse;
import com.skillsync.backend.dto.stats.UserStreakResponse;
import com.skillsync.backend.model.Notification;
import com.skillsync.backend.model.User;
import com.skillsync.backend.service.NotificationService;
import com.skillsync.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserService userService;
    private final NotificationService notificationService;
    public UserProfileController(UserService userService, NotificationService notificationService) {
        this.userService = userService;
        this.notificationService = notificationService;
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

    @GetMapping("/me/learning-stats")
    public ResponseEntity<ApiResponse<UserLearningStatsResponse>>
    getMyLearningStats() {

        UserLearningStatsResponse stats = userService.getMyLearningStats();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Learning stats fetched",
                        stats
                )
        );
    }

    @GetMapping("/me/streak")
    public ResponseEntity<ApiResponse<UserStreakResponse>> getMyStreak() {

        UserStreakResponse streak = userService.getMyStreak();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Streak fetched",
                        streak
                )
        );
    }

    @GetMapping("/me/recommendations")
    public ResponseEntity<ApiResponse<UserRecommendationResponse>>
    getMyRecommendations() {

        UserRecommendationResponse rec =
                userService.getMyRecommendations();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Recommendations generated",
                        rec
                )
        );
    }

    @GetMapping("/me/activity-heatmap")
    public ResponseEntity<ApiResponse<List<DailyActivityResponse>>>
    getMyActivityHeatmap() {

        List<DailyActivityResponse> data =
                userService.getMyActivityHeatmap();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Activity heatmap fetched",
                        data
                )
        );
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserStatsResponse>> getMyStats() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User stats fetched",
                        userService.getMyStats()
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
    @GetMapping("/me/notification-preferences")
    public ResponseEntity<ApiResponse<NotificationPreferencesDTO>> getNotificationPreferences() {
        NotificationPreferencesDTO prefs = userService.getNotificationPreferences();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Notification preferences fetched",
                        prefs
                )
        );
    }

    @PatchMapping("/me/notification-preferences")
    public ResponseEntity<ApiResponse<NotificationPreferencesDTO>> updateNotificationPreferences(
            @RequestBody NotificationPreferencesDTO preferences) {
        NotificationPreferencesDTO updated = userService.updateNotificationPreferences(preferences);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Notification preferences updated",
                        updated
                )
        );
    }
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>>
    createCategory(@RequestBody CreateCategoryRequest request) {

        CategoryResponse result =
                userService.createCategory(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category created",
                        result
                )
        );
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryResponse>>
    updateCategory(@PathVariable Long categoryId, @RequestBody CreateCategoryRequest request) {

        CategoryResponse result =
                userService.updateCategory(categoryId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category updated",
                        result
                )
        );
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<Void>>
    deleteCategory(@PathVariable Long categoryId) {

        userService.deleteCategory(categoryId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category deleted",
                        null
                )
        );
    }

    @GetMapping("/categories/{categoryId}/skills")
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getSkillsByCategory(
            @PathVariable Long categoryId) {

        List<SkillResponse> result =
                userService.getSkillsByCategory(categoryId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category skills fetched",
                        result
                )
        );
    }

    @GetMapping("/categories/analytics")
    public ResponseEntity<ApiResponse<List<CategoryAnalyticsResponse>>>
    getCategoryAnalytics() {

        List<CategoryAnalyticsResponse> data =
                userService.getCategoryAnalytics();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category analytics fetched",
                        data
                )
        );
    }

    @GetMapping("/categories/focus")
    public ResponseEntity<ApiResponse<DomainFocusResponse>>
    getDomainFocus() {

        DomainFocusResponse focus =
                userService.getDomainFocus();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Domain focus detected",
                        focus
                )
        );
    }

    @PostMapping("/goals")
    public ResponseEntity<ApiResponse<GoalResponse>> createGoal(
            @RequestBody CreateGoalRequest request) {

        GoalResponse goal =
                userService.createGoal(request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Goal created",
                        goal
                )
        );
    }

    @PutMapping("/goals/{goalId}")
    public ResponseEntity<ApiResponse<GoalResponse>> updateGoal(
            @PathVariable Long goalId,
            @RequestBody UpdateGoalRequest request) {

        GoalResponse goal =
                userService.updateGoal(goalId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Goal updated",
                        goal
                )
        );
    }

    @DeleteMapping("/goals/{goalId}")
    public ResponseEntity<ApiResponse<String>> deleteGoal(
            @PathVariable Long goalId) {

        userService.deleteGoal(goalId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Goal deleted",
                        null
                )
        );
    }

    @GetMapping("/goals/analytics")
    public ResponseEntity<ApiResponse<List<GoalAnalyticsResponse>>>
    getGoalAnalytics() {

        List<GoalAnalyticsResponse> data =
                userService.getGoalAnalytics();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Goal analytics fetched",
                        data
                )
        );
    }

    @GetMapping("/me/weekly-stats")
    public ResponseEntity<ApiResponse<TimeWindowStatsResponse>>
    getWeeklyStats() {

        TimeWindowStatsResponse stats =
                userService.getWeeklyStats();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Weekly stats fetched",
                        stats
                )
        );
    }

    @GetMapping("/me/monthly-stats")
    public ResponseEntity<ApiResponse<TimeWindowStatsResponse>>
    getMonthlyStats() {

        TimeWindowStatsResponse stats =
                userService.getMonthlyStats();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Monthly stats fetched",
                        stats
                )
        );
    }

    @GetMapping("/me/burnout-risk")
    public ResponseEntity<ApiResponse<BurnoutRiskResponse>>
    getBurnoutRisk() {

        BurnoutRiskResponse risk =
                userService.getBurnoutRisk();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Burnout risk calculated",
                        risk
                )
        );
    }

    @GetMapping("/me/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>>
    getMyNotifications() {

        User user = userService.getCurrentUser();

        List<Notification> notifications =
                notificationService.getUserNotifications(user);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Notifications fetched",
                        notifications
                )
        );
    }

    @PatchMapping("/me/notifications/{id}/read")
    public ResponseEntity<ApiResponse<String>>
    markNotificationAsRead(@PathVariable Long id) {

        notificationService.markAsRead(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Notification marked as read",
                        null
                )
        );
    }

    @PatchMapping("/me/notifications/read-all")
    public ResponseEntity<ApiResponse<String>>
    markAllNotificationsAsRead() {

        User user = userService.getCurrentUser();
        notificationService.markAllAsRead(user);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "All notifications marked as read",
                        null
                )
        );
    }

    @GetMapping("/me/recommendation")
    public ResponseEntity<ApiResponse<SkillRecommendationResponse>>
    getRecommendation() {

        SkillRecommendationResponse response =
                userService.getNextSkillRecommendation();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Recommendation generated",
                        response
                )
        );
    }

    @GetMapping("/me/recommendation-history")
    public ResponseEntity<ApiResponse<List<RecommendationHistoryResponse>>>
    getRecommendationHistory() {

        List<RecommendationHistoryResponse> history =
                userService.getRecommendationHistory();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Recommendation history fetched",
                        history
                )
        );
    }

    @GetMapping("/me/audit")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getMyAuditLogs() {

        List<AuditLogResponse> logs = userService.getMyAuditLogs();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Audit logs fetched",
                        logs
                )
        );
    }





    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = userService.getAllCategories();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Categories fetched",
                        categories
                )
        );
    }

    @GetMapping("/goals")
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getMyGoals() {
        List<GoalResponse> goals = userService.getMyGoals();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Goals fetched",
                        goals
                )
        );
    }

    @GetMapping("/me/achievements")
    public ResponseEntity<ApiResponse<com.skillsync.backend.dto.stats.UserAchievementsResponse>> getMyAchievements() {
        com.skillsync.backend.dto.stats.UserAchievementsResponse achievements = userService.getUserAchievements();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Achievements fetched",
                        achievements
                )
        );
    }

    @PostMapping("/delete-account")
    public ResponseEntity<ApiResponse<String>> deleteAccount() {
        userService.deleteMyAccount();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Account deleted successfully",
                        null
                )
        );
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestBody com.skillsync.backend.dto.ChangePasswordRequest request) {
        userService.changePassword(request.getOldPassword(), request.getNewPassword());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Password changed successfully",
                        null
                )
        );
    }
}