package com.skillsync.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.GroupActivityDTO;
import com.skillsync.backend.service.GroupActivityService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/group-activities")
@RequiredArgsConstructor
public class GroupActivityController {
    private final GroupActivityService activityService;

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<ApiResponse<Page<GroupActivityDTO>>> getGroupActivity(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GroupActivityDTO> activities = activityService.getGroupActivity(groupId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Activity retrieved", activities));
    }
}