package com.skillsync.backend.service;

import com.skillsync.backend.dto.forum.*;
import com.skillsync.backend.model.*;
import com.skillsync.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ForumService {

    private final ForumPostRepository postRepository;
    private final ForumReplyRepository replyRepository;
    private final ForumPostUpvoteRepository postUpvoteRepository;
    private final ForumReplyUpvoteRepository replyUpvoteRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public ForumService(
            ForumPostRepository postRepository,
            ForumReplyRepository replyRepository,
            ForumPostUpvoteRepository postUpvoteRepository,
            ForumReplyUpvoteRepository replyUpvoteRepository,
            UserRepository userRepository,
            SkillRepository skillRepository
    ) {
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
        this.postUpvoteRepository = postUpvoteRepository;
        this.replyUpvoteRepository = replyUpvoteRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public PostResponse createPost(CreatePostRequest request) {
        User user = getCurrentUser();

        ForumPost post = new ForumPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(user);
        post.setTag(PostTag.valueOf(request.getTag()));

        if (request.getSkillId() != null) {
            Skill skill = skillRepository.findById(request.getSkillId())
                    .orElse(null);
            post.setSkill(skill);
        }

        ForumPost saved = postRepository.save(post);
        return mapPost(saved, user);
    }

    public Page<PostResponse> getPosts(String tag, Long skillId, String search, int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);

        Page<ForumPost> postPage;

        if (search != null && !search.isBlank()) {
            postPage = postRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(search, pageable);
        } else if (tag != null && !tag.isBlank()) {
            postPage = postRepository.findByTagOrderByCreatedAtDesc(PostTag.valueOf(tag), pageable);
        } else if (skillId != null) {
            Skill skill = skillRepository.findById(skillId).orElse(null);
            if (skill != null) {
                postPage = postRepository.findBySkillOrderByCreatedAtDesc(skill, pageable);
            } else {
                postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);
            }
        } else {
            postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<ForumPost> posts = postPage.getContent();
        Set<Long> upvotedPostIds = postUpvoteRepository.findByUserAndPostIn(user, posts)
                .stream()
                .map(uv -> uv.getPost().getId())
                .collect(Collectors.toSet());

        return postPage.map(post -> mapPost(post, user, upvotedPostIds.contains(post.getId())));
    }

    public PostResponse getPostById(Long postId) {
        User user = getCurrentUser();
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapPost(post, user);
    }

    public List<ReplyResponse> getReplies(Long postId) {
        User user = getCurrentUser();
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<ForumReply> replies = replyRepository.findByPostOrderByCreatedAtAsc(post);

        Set<Long> upvotedReplyIds = replyUpvoteRepository.findByUserAndReplyIn(user, replies)
                .stream()
                .map(uv -> uv.getReply().getId())
                .collect(Collectors.toSet());

        return replies.stream()
                .map(r -> mapReply(r, upvotedReplyIds.contains(r.getId())))
                .toList();
    }

    @Transactional
    public void deletePost(Long postId) {
        User user = getCurrentUser();
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    @Transactional
    public ReplyResponse addReply(Long postId, CreateReplyRequest request) {
        User user = getCurrentUser();
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        ForumReply reply = new ForumReply();
        reply.setContent(request.getContent());
        reply.setAuthor(user);
        reply.setPost(post);

        ForumReply saved = replyRepository.save(reply);
        return mapReply(saved, false);
    }

    @Transactional
    public void deleteReply(Long postId, Long replyId) {
        User user = getCurrentUser();
        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        if (!reply.getPost().getId().equals(postId)) {
            throw new RuntimeException("Reply does not belong to this post");
        }
        if (!reply.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own replies");
        }

        replyRepository.delete(reply);
    }

    @Transactional
    public PostResponse togglePostUpvote(Long postId) {
        User user = getCurrentUser();
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        var existing = postUpvoteRepository.findByUserAndPost(user, post);
        boolean nowUpvoted;

        if (existing.isPresent()) {
            postUpvoteRepository.delete(existing.get());
            post.setUpvotes(Math.max(0, post.getUpvotes() - 1));
            nowUpvoted = false;
        } else {
            ForumPostUpvote upvote = new ForumPostUpvote();
            upvote.setUser(user);
            upvote.setPost(post);
            postUpvoteRepository.save(upvote);
            post.setUpvotes(post.getUpvotes() + 1);
            nowUpvoted = true;
        }

        postRepository.save(post);
        return mapPost(post, user, nowUpvoted);
    }

    @Transactional
    public ReplyResponse toggleReplyUpvote(Long replyId) {
        User user = getCurrentUser();
        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        var existing = replyUpvoteRepository.findByUserAndReply(user, reply);
        boolean nowUpvoted;

        if (existing.isPresent()) {
            replyUpvoteRepository.delete(existing.get());
            reply.setUpvotes(Math.max(0, reply.getUpvotes() - 1));
            nowUpvoted = false;
        } else {
            ForumReplyUpvote upvote = new ForumReplyUpvote();
            upvote.setUser(user);
            upvote.setReply(reply);
            replyUpvoteRepository.save(upvote);
            reply.setUpvotes(reply.getUpvotes() + 1);
            nowUpvoted = true;
        }

        replyRepository.save(reply);
        return mapReply(reply, nowUpvoted);
    }

    @Transactional
    public ReplyResponse acceptAnswer(Long replyId) {
        User user = getCurrentUser();
        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        ForumPost post = reply.getPost();
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Only the post author can accept answers");
        }

        List<ForumReply> allReplies = replyRepository.findByPostOrderByCreatedAtAsc(post);
        for (ForumReply r : allReplies) {
            r.setAcceptedAnswer(false);
        }
        replyRepository.saveAll(allReplies);

        boolean wasAccepted = reply.isAcceptedAnswer();
        reply.setAcceptedAnswer(!wasAccepted);
        ForumReply saved = replyRepository.save(reply);

        boolean upvoted = replyUpvoteRepository.existsByUserAndReply(user, reply);
        return mapReply(saved, upvoted);
    }

    private PostResponse mapPost(ForumPost post, User currentUser) {
        boolean upvoted = postUpvoteRepository.existsByUserAndPost(currentUser, post);
        return mapPost(post, currentUser, upvoted);
    }

    private PostResponse mapPost(ForumPost post, User currentUser, boolean upvoted) {
        int replyCount = post.getReplies() != null ? post.getReplies().size() : 0;
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getName(),
                post.getAuthor().getId(),
                post.getSkill() != null ? post.getSkill().getName() : null,
                post.getTag().name(),
                post.getUpvotes(),
                replyCount,
                upvoted,
                post.getCreatedAt()
        );
    }

    private ReplyResponse mapReply(ForumReply reply, boolean upvoted) {
        return new ReplyResponse(
                reply.getId(),
                reply.getContent(),
                reply.getAuthor().getName(),
                reply.getAuthor().getId(),
                reply.getUpvotes(),
                reply.isAcceptedAnswer(),
                upvoted,
                reply.getCreatedAt()
        );
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}