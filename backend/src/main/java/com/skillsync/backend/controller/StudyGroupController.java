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
import com.skillsync.backend.dto.CreateStudyGroupRequest;
import com.skillsync.backend.dto.GroupMemberDTO;
import com.skillsync.backend.dto.StudyGroupDTO;
import com.skillsync.backend.dto.UpdateStudyGroupRequest;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;
import com.skillsync.backend.service.StudyGroupService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {
    private final StudyGroupService groupService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudyGroupDTO>> createGroup(@RequestBody CreateStudyGroupRequest request) {
        User currentUser = getCurrentUser();
        StudyGroupDTO group = groupService.createGroup(request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Group created successfully", group));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<StudyGroupDTO>> getGroup(@PathVariable Long groupId) {
        User currentUser = getCurrentUser();
        StudyGroupDTO group = groupService.getGroup(groupId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Group fetched", group));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudyGroupDTO>>> listPublicGroups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<StudyGroupDTO> groups = groupService.listPublicGroups(pageable, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Public groups fetched", groups));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<StudyGroupDTO>>> searchGroups(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<StudyGroupDTO> groups = groupService.searchGroups(query, pageable, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results", groups));
    }

    @GetMapping("/skill/{skillId}")
    public ResponseEntity<ApiResponse<Page<StudyGroupDTO>>> listGroupsBySkill(
            @PathVariable Long skillId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<StudyGroupDTO> groups = groupService.listGroupsBySkill(skillId, pageable, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Groups for skill", groups));
    }

    @GetMapping("/my-groups")
    public ResponseEntity<ApiResponse<List<StudyGroupDTO>>> getMyGroups() {
        User currentUser = getCurrentUser();
        List<StudyGroupDTO> groups = groupService.getUserGroups(currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Your groups", groups));
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<ApiResponse<StudyGroupDTO>> joinGroup(@PathVariable Long groupId) {
        User currentUser = getCurrentUser();
        StudyGroupDTO group = groupService.joinGroup(groupId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Joined group successfully", group));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<ApiResponse<StudyGroupDTO>> updateGroup(
            @PathVariable Long groupId,
            @RequestBody UpdateStudyGroupRequest request) {
        User currentUser = getCurrentUser();
        StudyGroupDTO group = groupService.updateGroup(groupId, request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Group updated successfully", group));
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<ApiResponse<List<GroupMemberDTO>>> getGroupMembers(@PathVariable Long groupId) {
        List<GroupMemberDTO> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Group members", members));
    }

    @PostMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<ApiResponse<GroupMemberDTO>> addMember(
            @PathVariable Long groupId,
            @PathVariable Long memberId) {
        User currentUser = getCurrentUser();
        GroupMemberDTO member = groupService.addMember(groupId, memberId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Member added", member));
    }

    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<ApiResponse<String>> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long memberId) {
        User currentUser = getCurrentUser();
        groupService.removeMember(groupId, memberId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Member removed", "Success"));
    }
}