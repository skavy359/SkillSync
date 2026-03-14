package com.skillsync.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.skillsync.backend.model.GroupMessage;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    Page<GroupMessage> findByGroupIdOrderByCreatedAtDesc(Long groupId, Pageable pageable);
    
    List<GroupMessage> findByGroupIdAndCreatedAtAfterOrderByCreatedAtDesc(Long groupId, LocalDateTime since);
    
    long countByGroupId(Long groupId);
    
    @Query("SELECT gm FROM GroupMessage gm WHERE gm.group.id = :groupId ORDER BY gm.createdAt DESC")
    List<GroupMessage> findLatestMessagesByGroup(@Param("groupId") Long groupId);
    
    void deleteByGroupId(Long groupId);
}