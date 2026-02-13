package com.skillsync.backend.controller;

import com.skillsync.backend.dto.AddSkillRequest;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.SkillResponse;
import com.skillsync.backend.service.UserService;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getMySkills() {

        List<SkillResponse> skills = userService.getMySkills();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Skills fetched successfully",
                        skills
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
}