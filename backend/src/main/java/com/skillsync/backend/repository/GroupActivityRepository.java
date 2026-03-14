package com.skillsync.backend.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.skillsync.backend.model.GroupActivity;
import com.skillsync.backend.model.GroupActivity.ActivityType;

public interface GroupActivityRepository extends JpaRepository<GroupActivity, Long> {
    Page<GroupActivity> findByGroupIdOrderByCreatedAtDesc(Long groupId, Pageable pageable);
    
    List<GroupActivity> findByGroupIdAndActivityTypeOrderByCreatedAtDesc(Long groupId, ActivityType activityType);
    
    long countByGroupId(Long groupId);
    void deleteByGroupId(Long groupId);
}