package com.skillsync.backend.repository;

import com.skillsync.backend.model.ForumPost;
import com.skillsync.backend.model.PostTag;
import com.skillsync.backend.model.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    Page<ForumPost> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<ForumPost> findByTagOrderByCreatedAtDesc(PostTag tag, Pageable pageable);
    Page<ForumPost> findBySkillOrderByCreatedAtDesc(Skill skill, Pageable pageable);
    Page<ForumPost> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword, Pageable pageable);
}