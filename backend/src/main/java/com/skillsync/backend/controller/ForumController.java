package com.skillsync.backend.controller;

import com.skillsync.backend.dto.forum.*;
import com.skillsync.backend.service.ForumService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ForumService forumService;
    public ForumController(ForumService forumService) {
        this.forumService = forumService;
    }

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> createPost(@RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(forumService.createPost(request));
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponse>> getPosts(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Long skillId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(forumService.getPosts(tag, skillId, search, page, size));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.getPostById(id));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long id) {
        forumService.deletePost(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted"));
    }

    @GetMapping("/posts/{postId}/replies")
    public ResponseEntity<List<ReplyResponse>> getReplies(@PathVariable Long postId) {
        return ResponseEntity.ok(forumService.getReplies(postId));
    }

    @PostMapping("/posts/{postId}/replies")
    public ResponseEntity<ReplyResponse> addReply(
            @PathVariable Long postId,
            @RequestBody CreateReplyRequest request
    ) {
        return ResponseEntity.ok(forumService.addReply(postId, request));
    }

    @DeleteMapping("/posts/{postId}/replies/{replyId}")
    public ResponseEntity<Map<String, String>> deleteReply(
            @PathVariable Long postId,
            @PathVariable Long replyId
    ) {
        forumService.deleteReply(postId, replyId);
        return ResponseEntity.ok(Map.of("message", "Reply deleted"));
    }

    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<PostResponse> togglePostUpvote(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.togglePostUpvote(id));
    }

    @PostMapping("/replies/{id}/upvote")
    public ResponseEntity<ReplyResponse> toggleReplyUpvote(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.toggleReplyUpvote(id));
    }

    @PutMapping("/replies/{id}/accept")
    public ResponseEntity<ReplyResponse> acceptAnswer(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.acceptAnswer(id));
    }
}