package com.skillsync.backend.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.CreateAnnouncementRequest;
import com.skillsync.backend.dto.GroupAnnouncementDTO;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;
import com.skillsync.backend.service.GroupAnnouncementService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/group-announcements")
@RequiredArgsConstructor
public class GroupAnnouncementController {
    private final GroupAnnouncementService announcementService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/groups/{groupId}")
    public ResponseEntity<ApiResponse<GroupAnnouncementDTO>> createAnnouncement(
            @PathVariable Long groupId,
            @RequestBody CreateAnnouncementRequest request) {
        User currentUser = getCurrentUser();
        GroupAnnouncementDTO announcement = announcementService.createAnnouncement(groupId, request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Announcement created", announcement));
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<ApiResponse<Page<GroupAnnouncementDTO>>> getAnnouncements(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GroupAnnouncementDTO> announcements = announcementService.getAnnouncements(groupId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Announcements retrieved", announcements));
    }

    @GetMapping("/groups/{groupId}/pinned")
    public ResponseEntity<ApiResponse<List<GroupAnnouncementDTO>>> getPinnedAnnouncements(
            @PathVariable Long groupId) {
        List<GroupAnnouncementDTO> announcements = announcementService.getPinnedAnnouncements(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pinned announcements", announcements));
    }

    @PutMapping("/{announcementId}/toggle-pin")
    public ResponseEntity<ApiResponse<GroupAnnouncementDTO>> togglePin(@PathVariable Long announcementId) {
        User currentUser = getCurrentUser();
        GroupAnnouncementDTO announcement = announcementService.togglePin(announcementId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Pin status toggled", announcement));
    }

    @DeleteMapping("/{announcementId}")
    public ResponseEntity<ApiResponse<String>> deleteAnnouncement(@PathVariable Long announcementId) {
        User currentUser = getCurrentUser();
        announcementService.deleteAnnouncement(announcementId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Announcement deleted", "Success"));
    }
}