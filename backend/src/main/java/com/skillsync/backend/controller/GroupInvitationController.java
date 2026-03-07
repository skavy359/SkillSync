package com.skillsync.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.GroupInvitationDTO;
import com.skillsync.backend.dto.InviteUserRequest;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;
import com.skillsync.backend.service.GroupInvitationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/group-invitations")
@RequiredArgsConstructor
public class GroupInvitationController {
    private final GroupInvitationService invitationService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/groups/{groupId}")
    public ResponseEntity<ApiResponse<GroupInvitationDTO>> inviteUser(
            @PathVariable Long groupId,
            @RequestBody InviteUserRequest request) {
        User currentUser = getCurrentUser();
        GroupInvitationDTO invitation = invitationService.inviteUser(groupId, request.getUserId(), currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Invitation sent", invitation));
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<ApiResponse<GroupInvitationDTO>> acceptInvitation(@PathVariable Long invitationId) {
        User currentUser = getCurrentUser();
        GroupInvitationDTO invitation = invitationService.acceptInvitation(invitationId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Invitation accepted", invitation));
    }

    @PostMapping("/{invitationId}/reject")
    public ResponseEntity<ApiResponse<GroupInvitationDTO>> rejectInvitation(@PathVariable Long invitationId) {
        User currentUser = getCurrentUser();
        GroupInvitationDTO invitation = invitationService.rejectInvitation(invitationId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Invitation rejected", invitation));
    }

    @GetMapping("/my-invitations")
    public ResponseEntity<ApiResponse<List<GroupInvitationDTO>>> getMyInvitations() {
        User currentUser = getCurrentUser();
        List<GroupInvitationDTO> invitations = invitationService.getUserInvitations(currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Your invitations", invitations));
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<ApiResponse<List<GroupInvitationDTO>>> getGroupInvitations(@PathVariable Long groupId) {
        List<GroupInvitationDTO> invitations = invitationService.getGroupInvitations(groupId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Group invitations", invitations));
    }
}
