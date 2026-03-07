package com.skillsync.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillsync.backend.dto.GroupInvitationDTO;
import com.skillsync.backend.model.GroupActivity.ActivityType;
import com.skillsync.backend.model.GroupInvitation;
import com.skillsync.backend.model.GroupInvitation.InvitationStatus;
import com.skillsync.backend.model.GroupMembership;
import com.skillsync.backend.model.GroupMembership.GroupRole;
import com.skillsync.backend.model.StudyGroup;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.GroupInvitationRepository;
import com.skillsync.backend.repository.GroupMembershipRepository;
import com.skillsync.backend.repository.StudyGroupRepository;
import com.skillsync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupInvitationService {
    private final GroupInvitationRepository invitationRepository;
    private final StudyGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMembershipRepository membershipRepository;
    private final GroupActivityService groupActivityService;

    @Transactional
    public GroupInvitationDTO inviteUser(Long groupId, Long invitedUserId, Long invitedByUserId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        User invitedUser = userRepository.findById(invitedUserId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        User invitedByUser = userRepository.findById(invitedByUserId)
            .orElseThrow(() -> new RuntimeException("Inviting user not found"));

        // Verify inviter is ADMIN
        GroupMembership inviterMembership = membershipRepository.findByGroupIdAndUserId(groupId, invitedByUserId)
            .orElseThrow(() -> new RuntimeException("User not member of group"));
        
        if (inviterMembership.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("Only admins can invite members");
        }

        // Check if already a member
        if (membershipRepository.findByGroupIdAndUserId(groupId, invitedUserId).isPresent()) {
            throw new RuntimeException("User is already a member");
        }

        // Check if invitation already exists
        invitationRepository.findByGroupIdAndInvitedUserIdAndStatus(groupId, invitedUserId, InvitationStatus.PENDING)
            .ifPresent(inv -> {
                throw new RuntimeException("Invitation already sent to this user");
            });

        GroupInvitation invitation = new GroupInvitation();
        invitation.setGroup(group);
        invitation.setInvitedUser(invitedUser);
        invitation.setInvitedBy(invitedByUser);
        invitation.setStatus(InvitationStatus.PENDING);
        invitation = invitationRepository.save(invitation);

        log.info("Sent invitation to user {} for group {}", invitedUserId, groupId);
        
        // Record activity
        groupActivityService.recordActivity(groupId, ActivityType.INVITATION_SENT, invitedByUserId, 
            "Invitation sent to " + invitedUser.getName());

        return mapToDTO(invitation);
    }

    @Transactional
    public GroupInvitationDTO inviteUserByEmail(Long groupId, String invitedEmail, Long invitedByUserId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        User invitedUser = userRepository.findByEmail(invitedEmail)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + invitedEmail));

        User invitedByUser = userRepository.findById(invitedByUserId)
            .orElseThrow(() -> new RuntimeException("Inviting user not found"));

        // Verify inviter is ADMIN
        GroupMembership inviterMembership = membershipRepository.findByGroupIdAndUserId(groupId, invitedByUserId)
            .orElseThrow(() -> new RuntimeException("User not member of group"));
        
        if (inviterMembership.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("Only admins can invite members");
        }

        // Check if already a member
        if (membershipRepository.findByGroupIdAndUserId(groupId, invitedUser.getId()).isPresent()) {
            throw new RuntimeException("User is already a member");
        }

        // Check if invitation already exists
        invitationRepository.findByGroupIdAndInvitedUserIdAndStatus(groupId, invitedUser.getId(), InvitationStatus.PENDING)
            .ifPresent(inv -> {
                throw new RuntimeException("Invitation already sent to this user");
            });

        GroupInvitation invitation = new GroupInvitation();
        invitation.setGroup(group);
        invitation.setInvitedUser(invitedUser);
        invitation.setInvitedBy(invitedByUser);
        invitation.setStatus(InvitationStatus.PENDING);
        invitation = invitationRepository.save(invitation);

        log.info("Sent invitation to user {} (email: {}) for group {}", invitedUser.getId(), invitedEmail, groupId);
        
        // Record activity
        groupActivityService.recordActivity(groupId, ActivityType.INVITATION_SENT, invitedByUserId, 
            "Invitation sent to " + invitedUser.getName());

        return mapToDTO(invitation);
    }

    @Transactional
    public GroupInvitationDTO acceptInvitation(Long invitationId, Long userId) {
        log.debug("Accepting invitation {} for user {}", invitationId, userId);
        
        GroupInvitation invitation = invitationRepository.findById(invitationId)
            .orElseThrow(() -> new RuntimeException("Invitation not found"));

        Long groupId = invitation.getGroup().getId();
        Long invitedUserId = invitation.getInvitedUser().getId();

        if (!invitedUserId.equals(userId)) {
            throw new RuntimeException("You cannot accept this invitation");
        }

        if (!invitation.getStatus().equals(InvitationStatus.PENDING)) {
            throw new RuntimeException("Invitation is no longer pending");
        }

        // Check if user already has an ACCEPTED invitation for this group
        var existingAccepted = invitationRepository.findByGroupIdAndInvitedUserIdAndStatus(groupId, invitedUserId, InvitationStatus.ACCEPTED);
        if (existingAccepted.isPresent()) {
            log.info("User {} already accepted an invitation for group {}. Deleting duplicate pending invitation.", userId, groupId);
            // Delete the current pending invitation to avoid constraint violation
            invitationRepository.delete(invitation);
            invitationRepository.flush();
            return mapToDTO(existingAccepted.get());
        }

        // FIRST: Add user to group if not already a member
        if (membershipRepository.findByGroupIdAndUserId(groupId, invitedUserId).isEmpty()) {
            log.debug("Creating new membership for user {} in group {}", invitedUserId, groupId);
            
            GroupMembership membership = new GroupMembership();
            membership.setGroup(invitation.getGroup());
            membership.setUser(invitation.getInvitedUser());
            membership.setRole(GroupRole.MEMBER);
            membershipRepository.save(membership);
            membershipRepository.flush(); // Ensure this is persisted immediately

            // Update group member count
            StudyGroup group = invitation.getGroup();
            group.setMemberCount((int) membershipRepository.countByGroupId(groupId));
            groupRepository.save(group);
        } else {
            log.debug("User {} already member of group {}", invitedUserId, groupId);
        }

        // SECOND: Mark invitation as accepted
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setRespondedAt(java.time.LocalDateTime.now());
        invitation = invitationRepository.save(invitation);
        invitationRepository.flush(); // Ensure this is persisted immediately

        log.info("User {} accepted invitation for group {}", userId, groupId);
        
        // Record activities - wrap in try-catch to prevent transaction rollback
        try {
            groupActivityService.recordActivity(groupId, ActivityType.INVITATION_ACCEPTED, userId, 
                invitation.getInvitedUser().getName() + " accepted invitation");
            groupActivityService.recordActivity(groupId, ActivityType.MEMBER_JOINED, userId, 
                invitation.getInvitedUser().getName() + " joined the group");
        } catch (Exception e) {
            log.error("Failed to record activity for invitation acceptance", e);
        }
        
        return mapToDTO(invitation);
    }

    @Transactional
    public GroupInvitationDTO rejectInvitation(Long invitationId, Long userId) {
        GroupInvitation invitation = invitationRepository.findById(invitationId)
            .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!invitation.getInvitedUser().getId().equals(userId)) {
            throw new RuntimeException("You cannot reject this invitation");
        }

        if (!invitation.getStatus().equals(InvitationStatus.PENDING)) {
            throw new RuntimeException("Invitation is no longer pending");
        }

        invitation.setStatus(InvitationStatus.REJECTED);
        invitation.setRespondedAt(java.time.LocalDateTime.now());
        invitation = invitationRepository.save(invitation);

        log.info("User {} rejected invitation for group {}", userId, invitation.getGroup().getId());
        return mapToDTO(invitation);
    }

    public List<GroupInvitationDTO> getUserInvitations(Long userId) {
        return invitationRepository.findPendingInvitations(userId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<GroupInvitationDTO> getGroupInvitations(Long groupId) {
        return invitationRepository.findByGroupId(groupId).stream()
            .filter(inv -> inv.getStatus().equals(InvitationStatus.PENDING))
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    private GroupInvitationDTO mapToDTO(GroupInvitation invitation) {
        GroupInvitationDTO dto = new GroupInvitationDTO();
        dto.setId(invitation.getId());
        dto.setGroupId(invitation.getGroup().getId());
        dto.setGroupName(invitation.getGroup().getName());
        dto.setInvitedUserId(invitation.getInvitedUser().getId());
        dto.setInvitedByUserId(invitation.getInvitedBy().getId());
        dto.setInvitedByName(invitation.getInvitedBy().getName());
        dto.setInvitedByEmail(invitation.getInvitedBy().getEmail());
        dto.setStatus(invitation.getStatus().toString());
        dto.setCreatedAt(invitation.getCreatedAt());
        dto.setExpiresAt(invitation.getExpiresAt());
        dto.setRespondedAt(invitation.getRespondedAt());
        return dto;
    }
}
