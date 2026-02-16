package com.skillsync.backend.controller;

import com.skillsync.backend.dto.AddSkillRequest;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.SkillResponse;
import com.skillsync.backend.dto.session.AddSessionRequest;
import com.skillsync.backend.dto.session.SessionResponse;
import com.skillsync.backend.dto.session.SessionStatsResponse;
import com.skillsync.backend.dto.stats.CompletionProbabilityResponse;
import com.skillsync.backend.dto.stats.SkillDifficultyResponse;
import com.skillsync.backend.dto.stats.SkillEtaResponse;
import com.skillsync.backend.dto.stats.SkillVelocityResponse;
import com.skillsync.backend.model.SkillLevel;
import com.skillsync.backend.model.SkillStatus;
import com.skillsync.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.skillsync.backend.dto.UpdateSkillProgressRequest;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final UserService userService;
    public SkillController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SkillResponse>> addSkill(
            @Valid @RequestBody AddSkillRequest request) {

        SkillResponse skill = userService.addSkill(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Skill added successfully",
                        skill
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SkillResponse>>> getMySkills(
            @RequestParam(required = false) SkillStatus status,
            @RequestParam(required = false) SkillLevel level,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<SkillResponse> result =
                userService.getMySkills(status, level, search, page, size);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skills fetched",
                        result
                )
        );
    }

    @PatchMapping("/{skillId}/progress")
    public ResponseEntity<ApiResponse<SkillResponse>> updateSkillProgress(
            @PathVariable Long skillId,
            @Valid @RequestBody UpdateSkillProgressRequest request) {

        SkillResponse updatedSkill =
                userService.updateSkillProgress(skillId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill progress updated successfully",
                        updatedSkill
                )
        );
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<ApiResponse<String>> deleteSkill(
            @PathVariable Long skillId) {

        userService.deleteSkill(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill deleted successfully",
                        null
                )
        );
    }

    @PostMapping("/{skillId}/sessions")
    public ResponseEntity<ApiResponse<SessionResponse>> addSession(
            @PathVariable Long skillId,
            @RequestBody AddSessionRequest request
    ) {
        SessionResponse result =
                userService.addSession(skillId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Session added",
                        result
                )
        );
    }

    @GetMapping("/{skillId}/sessions")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getSessions(
            @PathVariable Long skillId
    ) {
        List<SessionResponse> result =
                userService.getSessions(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Sessions fetched",
                        result
                )
        );
    }

    @GetMapping("/{skillId}/session-stats")
    public ResponseEntity<ApiResponse<SessionStatsResponse>> getSessionStats(
            @PathVariable Long skillId
    ) {
        SessionStatsResponse result =
                userService.getSessionStats(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Session stats fetched",
                        result
                )
        );
    }

    @GetMapping("/{skillId}/velocity")
    public ResponseEntity<ApiResponse<SkillVelocityResponse>>
    getSkillVelocity(@PathVariable Long skillId) {

        SkillVelocityResponse result =
                userService.getSkillVelocity(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill velocity fetched",
                        result
                )
        );
    }

    @GetMapping("/{skillId}/eta")
    public ResponseEntity<ApiResponse<SkillEtaResponse>>
    getSkillEta(@PathVariable Long skillId) {

        SkillEtaResponse result =
                userService.getSkillEta(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill ETA fetched",
                        result
                )
        );
    }

    @GetMapping("/{skillId}/difficulty")
    public ResponseEntity<ApiResponse<SkillDifficultyResponse>>
    getSkillDifficulty(@PathVariable Long skillId) {

        SkillDifficultyResponse result =
                userService.getSkillDifficulty(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill difficulty calculated",
                        result
                )
        );
    }

    @GetMapping("/{skillId}/completion-probability")
    public ResponseEntity<ApiResponse<CompletionProbabilityResponse>>
    getCompletionProbability(@PathVariable Long skillId) {

        CompletionProbabilityResponse result =
                userService.getCompletionProbability(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Completion probability calculated",
                        result
                )
        );
    }

    @PutMapping("/{skillId}/category/{categoryId}")
    public ApiResponse<SkillResponse> assignCategory(
            @PathVariable Long skillId,
            @PathVariable Long categoryId) {

        SkillResponse response = userService.assignCategoryToSkill(skillId, categoryId);

        return ApiResponse.success("Category assigned to skill", response);
    }
}