package com.skillsync.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.skillsync.backend.model.GroupAnnouncement;

public interface GroupAnnouncementRepository extends JpaRepository<GroupAnnouncement, Long> {
    Page<GroupAnnouncement> findByGroupIdOrderByIsPinnedDescCreatedAtDesc(Long groupId, Pageable pageable);
    
    List<GroupAnnouncement> findByGroupIdAndIsPinnedTrueOrderByPinnedAtDesc(Long groupId);
    
    long countByGroupId(Long groupId);
    void deleteByGroupId(Long groupId);
}
