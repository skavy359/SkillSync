package com.skillsync.backend.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.skillsync.backend.dto.CreateMessageRequest;
import com.skillsync.backend.dto.GroupMessageDTO;
import com.skillsync.backend.model.GroupMessage;
import com.skillsync.backend.model.StudyGroup;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.GroupMessageRepository;
import com.skillsync.backend.repository.StudyGroupRepository;
import com.skillsync.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupMessageService {
    private final GroupMessageRepository messageRepository;
    private final StudyGroupRepository groupRepository;
    private final UserRepository userRepository;

    @Transactional
    public GroupMessageDTO sendMessage(Long groupId, CreateMessageRequest request, Long userId) {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        GroupMessage message = new GroupMessage();
        message.setGroup(group);
        message.setUser(user);
        message.setContent(request.getContent());
        message.setIsEdited(false);

        message = messageRepository.save(message);
        log.info("Message sent by user {} in group {}", userId, groupId);

        return mapToDTO(message);
    }

    public Page<GroupMessageDTO> getGroupMessages(Long groupId, Pageable pageable) {
        return messageRepository.findByGroupIdOrderByCreatedAtDesc(groupId, pageable)
            .map(this::mapToDTO);
    }

    public List<GroupMessageDTO> getLatestMessages(Long groupId) {
        return messageRepository.findLatestMessagesByGroup(groupId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public GroupMessageDTO updateMessage(Long messageId, String content, Long userId) {
        GroupMessage message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getUser().getId().equals(userId)) {
            throw new RuntimeException("Can only edit your own messages");
        }

        message.setContent(content);
        message.setIsEdited(true);
        
        message = messageRepository.save(message);
        log.info("Message {} updated by user {}", messageId, userId);

        return mapToDTO(message);
    }

    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        GroupMessage message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getUser().getId().equals(userId)) {
            throw new RuntimeException("Can only delete your own messages");
        }

        messageRepository.delete(message);
        log.info("Message {} deleted by user {}", messageId, userId);
    }

    public long getMessageCount(Long groupId) {
        return messageRepository.countByGroupId(groupId);
    }

    private GroupMessageDTO mapToDTO(GroupMessage message) {
        GroupMessageDTO dto = new GroupMessageDTO();
        dto.setId(message.getId());
        dto.setGroupId(message.getGroup().getId());
        dto.setUserId(message.getUser().getId());
        dto.setUserName(message.getUser().getName());
        dto.setUserEmail(message.getUser().getEmail());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setIsEdited(message.getIsEdited());
        dto.setEditedAt(message.getEditedAt());
        return dto;
    }
}