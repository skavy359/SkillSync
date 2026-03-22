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
            @RequestParam(name = "tag", required = false) String tag,
            @RequestParam(name = "skillId", required = false) Long skillId,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(forumService.getPosts(tag, skillId, search, page, size));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable("id") Long id) {
        return ResponseEntity.ok(forumService.getPostById(id));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable("id") Long id) {
        forumService.deletePost(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted"));
    }

    @GetMapping("/posts/{postId}/replies")
    public ResponseEntity<List<ReplyResponse>> getReplies(@PathVariable("postId") Long postId) {
        return ResponseEntity.ok(forumService.getReplies(postId));
    }

    @PostMapping("/posts/{postId}/replies")
    public ResponseEntity<ReplyResponse> addReply(
            @PathVariable("postId") Long postId,
            @RequestBody CreateReplyRequest request
    ) {
        return ResponseEntity.ok(forumService.addReply(postId, request));
    }

    @DeleteMapping("/posts/{postId}/replies/{replyId}")
    public ResponseEntity<Map<String, String>> deleteReply(
            @PathVariable("postId") Long postId,
            @PathVariable("replyId") Long replyId
    ) {
        forumService.deleteReply(postId, replyId);
        return ResponseEntity.ok(Map.of("message", "Reply deleted"));
    }

    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<PostResponse> togglePostUpvote(@PathVariable("id") Long id) {
        return ResponseEntity.ok(forumService.togglePostUpvote(id));
    }

    @PostMapping("/replies/{id}/upvote")
    public ResponseEntity<ReplyResponse> toggleReplyUpvote(@PathVariable("id") Long id) {
        return ResponseEntity.ok(forumService.toggleReplyUpvote(id));
    }

    @PutMapping("/replies/{id}/accept")
    public ResponseEntity<ReplyResponse> acceptAnswer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(forumService.acceptAnswer(id));
    }
}