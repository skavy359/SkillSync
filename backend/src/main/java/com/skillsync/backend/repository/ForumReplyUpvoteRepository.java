package com.skillsync.backend.repository;

import com.skillsync.backend.model.ForumReply;
import com.skillsync.backend.model.ForumReplyUpvote;
import com.skillsync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ForumReplyUpvoteRepository extends JpaRepository<ForumReplyUpvote, Long> {
    Optional<ForumReplyUpvote> findByUserAndReply(User user, ForumReply reply);
    boolean existsByUserAndReply(User user, ForumReply reply);
    List<ForumReplyUpvote> findByUserAndReplyIn(User user, List<ForumReply> replies);
    void deleteByReply(ForumReply reply);
}