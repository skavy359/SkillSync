package com.skillsync.backend.repository;

import com.skillsync.backend.model.ForumPost;
import com.skillsync.backend.model.ForumReply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {
    List<ForumReply> findByPostOrderByCreatedAtAsc(ForumPost post);
}
