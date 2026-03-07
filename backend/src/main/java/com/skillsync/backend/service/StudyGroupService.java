package com.skillsync.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillsync.backend.dto.CreateStudyGroupRequest;
import com.skillsync.backend.dto.GroupMemberDTO;
import com.skillsync.backend.dto.StudyGroupDTO;
import com.skillsync.backend.model.GroupActivity.ActivityType;
import com.skillsync.backend.model.GroupMembership;
import com.skillsync.backend.model.GroupMembership.GroupRole;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.StudyGroup;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.GroupMembershipRepository;
import com.skillsync.backend.repository.SkillRepository;
import com.skillsync.backend.repository.StudyGroupRepository;
import com.skillsync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyGroupService {
    private final StudyGroupRepository groupRepository;
    private final GroupMembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final GroupActivityService groupActivityService;

    @Transactional
    public StudyGroupDTO createGroup(CreateStudyGroupRequest request, Long userId) {
        User creator = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        StudyGroup group = new StudyGroup();
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : true);
        group.setImageUrl(request.getImageUrl());
        group.setCreatedBy(creator);

        if (request.getSkillId() != null) {
            Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));
            group.setSkill(skill);
        }

        group = groupRepository.save(group);

        // Add creator as ADMIN member
        GroupMembership adminMembership = new GroupMembership();
        adminMembership.setGroup(group);
        adminMembership.setUser(creator);
        adminMembership.setRole(GroupRole.ADMIN);
        membershipRepository.save(adminMembership);

        group.setMemberCount(1);
        groupRepository.save(group);

        // Record activity
        groupActivityService.recordActivity(group.getId(), ActivityType.GROUP_CREATED, userId, 
            "Group created by " + creator.getName());

        log.info("Created study group: {} by user: {}", group.getId(), userId);
        return mapToDTO(group, true, true);
    }

    public StudyGroupDTO getGroup(Long groupId, Long userId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        boolean isMember = membershipRepository.isMember(groupId, userId);
        boolean isAdmin = false;

        if (isMember) {
            GroupMembership membership = membershipRepository.findByGroupIdAndUserId(groupId, userId).get();
            isAdmin = membership.getRole() == GroupRole.ADMIN;
        }

        return mapToDTO(group, isMember, isAdmin);
    }

    public Page<StudyGroupDTO> listPublicGroups(Pageable pageable, Long userId) {
        return groupRepository.findByIsPublicTrue(pageable)
            .map(group -> {
                boolean isMember = membershipRepository.isMember(group.getId(), userId);
                return mapToDTO(group, isMember, false);
            });
    }

    public Page<StudyGroupDTO> searchGroups(String searchTerm, Pageable pageable, Long userId) {
        return groupRepository.searchPublicGroups(searchTerm, pageable)
            .map(group -> {
                boolean isMember = membershipRepository.isMember(group.getId(), userId);
                return mapToDTO(group, isMember, false);
            });
    }

    public Page<StudyGroupDTO> listGroupsBySkill(Long skillId, Pageable pageable, Long userId) {
        return groupRepository.findPublicGroupsBySkillId(skillId, pageable)
            .map(group -> {
                boolean isMember = membershipRepository.isMember(group.getId(), userId);
                return mapToDTO(group, isMember, false);
            });
    }

    public List<StudyGroupDTO> getUserGroups(Long userId) {
        return groupRepository.findUserGroups(userId).stream()
            .map(group -> mapToDTO(group, true, false))
            .collect(Collectors.toList());
    }

    @Transactional
    public StudyGroupDTO joinGroup(Long groupId, Long userId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        // Only allow joining public groups
        if (!group.getIsPublic()) {
            throw new RuntimeException("Cannot join private groups directly");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already a member
        if (membershipRepository.findByGroupIdAndUserId(groupId, userId).isPresent()) {
            throw new RuntimeException("User is already a member");
        }

        // Add as MEMBER
        GroupMembership membership = new GroupMembership();
        membership.setGroup(group);
        membership.setUser(user);
        membership.setRole(GroupRole.MEMBER);
        membershipRepository.save(membership);

        // Update member count
        group.setMemberCount((int) membershipRepository.countByGroupId(groupId));
        groupRepository.save(group);

        // Record activity
        groupActivityService.recordActivity(groupId, ActivityType.MEMBER_JOINED, userId, 
            user.getName() + " joined the group");

        log.info("User {} joined group {}", userId, groupId);
        return mapToDTO(group, true, false);
    }

    @Transactional
    public GroupMemberDTO addMember(Long groupId, Long newMemberId, Long currentUserId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        // Verify current user is ADMIN
        GroupMembership adminMembership = membershipRepository.findByGroupIdAndUserId(groupId, currentUserId)
            .orElseThrow(() -> new RuntimeException("User not member of group"));
        
        if (adminMembership.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("Only admins can add members");
        }

        User newMember = userRepository.findById(newMemberId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already a member
        if (membershipRepository.findByGroupIdAndUserId(groupId, newMemberId).isPresent()) {
            throw new RuntimeException("User is already a member");
        }

        GroupMembership membership = new GroupMembership();
        membership.setGroup(group);
        membership.setUser(newMember);
        membership.setRole(GroupRole.MEMBER);
        membership = membershipRepository.save(membership);

        // Update member count
        group.setMemberCount((int) membershipRepository.countByGroupId(groupId));
        groupRepository.save(group);

        log.info("Added member {} to group {}", newMemberId, groupId);
        return mapMemberToDTO(membership);
    }

    @Transactional
    public void removeMember(Long groupId, Long memberId, Long currentUserId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        // Verify current user is ADMIN
        GroupMembership adminMembership = membershipRepository.findByGroupIdAndUserId(groupId, currentUserId)
            .orElseThrow(() -> new RuntimeException("User not member of group"));
        
        if (adminMembership.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("Only admins can remove members");
        }

        // Can't remove the last member (admin)
        if (group.getMemberCount() <= 1) {
            throw new RuntimeException("Cannot remove the last member of a group");
        }

        membershipRepository.deleteByGroupIdAndUserId(groupId, memberId);

        // Update member count
        group.setMemberCount((int) membershipRepository.countByGroupId(groupId));
        groupRepository.save(group);

        log.info("Removed member {} from group {}", memberId, groupId);
    }

    public List<GroupMemberDTO> getGroupMembers(Long groupId) {
        return membershipRepository.findByGroupId(groupId).stream()
            .map(this::mapMemberToDTO)
            .collect(Collectors.toList());
    }

    private StudyGroupDTO mapToDTO(StudyGroup group, boolean isMember, boolean isAdmin) {
        StudyGroupDTO dto = new StudyGroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setImageUrl(group.getImageUrl());
        dto.setIsPublic(group.getIsPublic());
        dto.setMemberCount(group.getMemberCount());
        dto.setCreatedAt(group.getCreatedAt());
        dto.setUpdatedAt(group.getUpdatedAt());
        dto.setIsMember(isMember);
        dto.setIsAdmin(isAdmin);

        if (group.getSkill() != null) {
            dto.setSkillId(group.getSkill().getId());
            dto.setSkillName(group.getSkill().getName());
        }

        if (group.getCreatedBy() != null) {
            dto.setCreatedById(group.getCreatedBy().getId());
            dto.setCreatedByName(group.getCreatedBy().getName());
            dto.setCreatedByEmail(group.getCreatedBy().getEmail());
        }

        return dto;
    }

    private GroupMemberDTO mapMemberToDTO(GroupMembership membership) {
        GroupMemberDTO dto = new GroupMemberDTO();
        dto.setUserId(membership.getUser().getId());
        dto.setUserName(membership.getUser().getName());
        dto.setUserEmail(membership.getUser().getEmail());
        dto.setUserAbout(membership.getUser().getAbout());
        dto.setRole(membership.getRole().toString());
        dto.setJoinedAt(membership.getJoinedAt());
        return dto;
    }
}
