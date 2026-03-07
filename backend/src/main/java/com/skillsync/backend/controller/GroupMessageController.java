package com.skillsync.backend.controller;

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
import com.skillsync.backend.dto.CreateMessageRequest;
import com.skillsync.backend.dto.GroupMessageDTO;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;
import com.skillsync.backend.service.GroupMessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/group-messages")
@RequiredArgsConstructor
public class GroupMessageController {
    private final GroupMessageService messageService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/groups/{groupId}")
    public ResponseEntity<ApiResponse<GroupMessageDTO>> sendMessage(
            @PathVariable Long groupId,
            @RequestBody CreateMessageRequest request) {
        User currentUser = getCurrentUser();
        GroupMessageDTO message = messageService.sendMessage(groupId, request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Message sent", message));
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<ApiResponse<Page<GroupMessageDTO>>> getGroupMessages(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GroupMessageDTO> messages = messageService.getGroupMessages(groupId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Messages retrieved", messages));
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<ApiResponse<GroupMessageDTO>> updateMessage(
            @PathVariable Long messageId,
            @RequestBody CreateMessageRequest request) {
        User currentUser = getCurrentUser();
        GroupMessageDTO message = messageService.updateMessage(messageId, request.getContent(), currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Message updated", message));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<String>> deleteMessage(@PathVariable Long messageId) {
        User currentUser = getCurrentUser();
        messageService.deleteMessage(messageId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Message deleted", "Success"));
    }
}
