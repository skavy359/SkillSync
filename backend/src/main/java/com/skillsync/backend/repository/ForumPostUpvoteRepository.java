package com.skillsync.backend.repository;

import com.skillsync.backend.model.ForumPost;
import com.skillsync.backend.model.ForumPostUpvote;
import com.skillsync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ForumPostUpvoteRepository extends JpaRepository<ForumPostUpvote, Long> {
    Optional<ForumPostUpvote> findByUserAndPost(User user, ForumPost post);
    boolean existsByUserAndPost(User user, ForumPost post);
    List<ForumPostUpvote> findByUserAndPostIn(User user, List<ForumPost> posts);
    void deleteByPost(ForumPost post);
}
