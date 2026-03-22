package com.skillsync.backend.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.skillsync.backend.dto.AddSkillRequest;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.SkillResponse;
import com.skillsync.backend.dto.UpdateSkillProgressRequest;
import com.skillsync.backend.dto.UpdateSkillRequest;
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
            @RequestParam(name = "status", required = false) SkillStatus status,
            @RequestParam(name = "level", required = false) SkillLevel level,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
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
            @PathVariable("skillId") Long skillId,
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
            @PathVariable("skillId") Long skillId) {

        userService.deleteSkill(skillId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill deleted successfully",
                        null
                )
        );
    }

    @PutMapping("/{skillId}")
    public ResponseEntity<ApiResponse<SkillResponse>> updateSkill(
            @PathVariable("skillId") Long skillId,
            @Valid @RequestBody UpdateSkillRequest request) {

        SkillResponse updatedSkill = userService.updateSkill(skillId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skill updated successfully",
                        updatedSkill
                )
        );
    }

    @PostMapping("/{skillId}/sessions")
    public ResponseEntity<ApiResponse<SessionResponse>> addSession(
            @PathVariable("skillId") Long skillId,
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
            @PathVariable("skillId") Long skillId
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

    @PatchMapping("/{skillId}/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<SessionResponse>> updateSession(
            @PathVariable("skillId") Long skillId,
            @PathVariable("sessionId") Long sessionId,
            @RequestBody AddSessionRequest request
    ) {
        SessionResponse result =
                userService.updateSession(skillId, sessionId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Session updated successfully",
                        result
                )
        );
    }

    @DeleteMapping("/{skillId}/sessions/{sessionId}")
    public ResponseEntity<ApiResponse<String>> deleteSession(
            @PathVariable("skillId") Long skillId,
            @PathVariable("sessionId") Long sessionId
    ) {
        userService.deleteSession(skillId, sessionId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Session deleted successfully",
                        null
                )
        );
    }

    @GetMapping("/{skillId}/session-stats")
    public ResponseEntity<ApiResponse<SessionStatsResponse>> getSessionStats(
            @PathVariable("skillId") Long skillId
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
    getSkillVelocity(@PathVariable("skillId") Long skillId) {

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
    getSkillEta(@PathVariable("skillId") Long skillId) {

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
    getSkillDifficulty(@PathVariable("skillId") Long skillId) {

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
    getCompletionProbability(@PathVariable("skillId") Long skillId) {

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
            @PathVariable("skillId") Long skillId,
            @PathVariable("categoryId") Long categoryId) {

        SkillResponse response = userService.assignCategoryToSkill(skillId, categoryId);

        return new ApiResponse<>(
                true,
                "Category assigned to skill",
                response
        );
    }

    @DeleteMapping("/{skillId}/category")
    public ApiResponse<SkillResponse> removeCategory(
            @PathVariable("skillId") Long skillId) {

        SkillResponse response = userService.removeCategoryFromSkill(skillId);

        return new ApiResponse<>(
                true,
                "Category removed from skill",
                response
        );
    }
}