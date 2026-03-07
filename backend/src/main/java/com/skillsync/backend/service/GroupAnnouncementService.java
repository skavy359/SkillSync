package com.skillsync.backend.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.skillsync.backend.dto.CreateAnnouncementRequest;
import com.skillsync.backend.dto.GroupAnnouncementDTO;
import com.skillsync.backend.model.GroupActivity.ActivityType;
import com.skillsync.backend.model.GroupAnnouncement;
import com.skillsync.backend.model.GroupMembership;
import com.skillsync.backend.model.GroupMembership.GroupRole;
import com.skillsync.backend.model.StudyGroup;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.GroupAnnouncementRepository;
import com.skillsync.backend.repository.GroupMembershipRepository;
import com.skillsync.backend.repository.StudyGroupRepository;
import com.skillsync.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupAnnouncementService {
    private final GroupAnnouncementRepository announcementRepository;
    private final StudyGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMembershipRepository membershipRepository;
    private final GroupActivityService groupActivityService;

    @Transactional
    public GroupAnnouncementDTO createAnnouncement(Long groupId, CreateAnnouncementRequest request, Long userId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        GroupMembership membership = membershipRepository.findByGroupIdAndUserId(groupId, userId)
            .orElseThrow(() -> new RuntimeException("Not a member of this group"));

        if (membership.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("Only admins can post announcements");
        }

        GroupAnnouncement announcement = new GroupAnnouncement();
        announcement.setGroup(group);
        announcement.setCreatedBy(user);
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setIsPinned(request.getIsPinned() != null ? request.getIsPinned() : false);

        announcement = announcementRepository.save(announcement);
        log.info("Announcement {} created by user {} in group {}", announcement.getId(), userId, groupId);

        groupActivityService.recordActivity(groupId, ActivityType.ANNOUNCEMENT_POSTED, userId, 
            user.getName() + " posted an announcement: " + request.getTitle());

        return mapToDTO(announcement);
    }

    public Page<GroupAnnouncementDTO> getAnnouncements(Long groupId, Pageable pageable) {
        return announcementRepository.findByGroupIdOrderByIsPinnedDescCreatedAtDesc(groupId, pageable)
            .map(this::mapToDTO);
    }

    public List<GroupAnnouncementDTO> getPinnedAnnouncements(Long groupId) {
        return announcementRepository.findByGroupIdAndIsPinnedTrueOrderByPinnedAtDesc(groupId)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public GroupAnnouncementDTO togglePin(Long announcementId, Long userId) {
        GroupAnnouncement announcement = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));

        GroupMembership membership = membershipRepository.findByGroupIdAndUserId(announcement.getGroup().getId(), userId)
            .orElseThrow(() -> new RuntimeException("Not a member of this group"));

        if (membership.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("Only admins can pin announcements");
        }

        announcement.setIsPinned(!announcement.getIsPinned());
        if (announcement.getIsPinned()) {
            announcement.setPinnedAt(java.time.LocalDateTime.now());
        } else {
            announcement.setPinnedAt(null);
        }

        announcement = announcementRepository.save(announcement);
        log.info("Announcement {} pinned status toggled by user {}", announcementId, userId);

        return mapToDTO(announcement);
    }

    @Transactional
    public void deleteAnnouncement(Long announcementId, Long userId) {
        GroupAnnouncement announcement = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));

        if (!announcement.getCreatedBy().getId().equals(userId)) {
            GroupMembership membership = membershipRepository.findByGroupIdAndUserId(announcement.getGroup().getId(), userId)
                .orElseThrow(() -> new RuntimeException("Not a member of this group"));

            if (membership.getRole() != GroupRole.ADMIN) {
                throw new RuntimeException("Only creator or admins can delete announcements");
            }
        }

        announcementRepository.delete(announcement);
        log.info("Announcement {} deleted by user {}", announcementId, userId);
    }

    public long getAnnouncementCount(Long groupId) {
        return announcementRepository.countByGroupId(groupId);
    }

    private GroupAnnouncementDTO mapToDTO(GroupAnnouncement announcement) {
        GroupAnnouncementDTO dto = new GroupAnnouncementDTO();
        dto.setId(announcement.getId());
        dto.setGroupId(announcement.getGroup().getId());
        dto.setCreatedById(announcement.getCreatedBy().getId());
        dto.setCreatedByName(announcement.getCreatedBy().getName());
        dto.setCreatedByEmail(announcement.getCreatedBy().getEmail());
        dto.setTitle(announcement.getTitle());
        dto.setContent(announcement.getContent());
        dto.setIsPinned(announcement.getIsPinned());
        dto.setCreatedAt(announcement.getCreatedAt());
        dto.setPinnedAt(announcement.getPinnedAt());
        dto.setUpdatedAt(announcement.getUpdatedAt());
        return dto;
    }
}