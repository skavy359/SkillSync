package com.skillsync.backend.service;

import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skillsync.backend.dto.GroupActivityDTO;
import com.skillsync.backend.model.GroupActivity;
import com.skillsync.backend.model.GroupActivity.ActivityType;
import com.skillsync.backend.model.StudyGroup;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.GroupActivityRepository;
import com.skillsync.backend.repository.StudyGroupRepository;
import com.skillsync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupActivityService {
    private final GroupActivityRepository activityRepository;
    private final StudyGroupRepository groupRepository;
    private final UserRepository userRepository;

    @Transactional
    public GroupActivityDTO recordActivity(Long groupId, ActivityType activityType, Long userId, String description) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        GroupActivity activity = new GroupActivity();
        activity.setGroup(group);
        activity.setUser(user);
        activity.setActivityType(activityType);
        activity.setDescription(description);

        activity = activityRepository.save(activity);
        log.info("Activity {} recorded for group {}", activityType, groupId);

        return mapToDTO(activity);
    }

    public Page<GroupActivityDTO> getGroupActivity(Long groupId, Pageable pageable) {
        return activityRepository.findByGroupIdOrderByCreatedAtDesc(groupId, pageable)
            .map(this::mapToDTO);
    }

    public long getActivityCount(Long groupId) {
        return activityRepository.countByGroupId(groupId);
    }

    private GroupActivityDTO mapToDTO(GroupActivity activity) {
        GroupActivityDTO dto = new GroupActivityDTO();
        dto.setId(activity.getId());
        dto.setGroupId(activity.getGroup().getId());
        if (activity.getUser() != null) {
            dto.setUserId(activity.getUser().getId());
            dto.setUserName(activity.getUser().getName());
        }
        dto.setActivityType(activity.getActivityType().toString());
        dto.setDescription(activity.getDescription());
        dto.setCreatedAt(activity.getCreatedAt());
        return dto;
    }
}
