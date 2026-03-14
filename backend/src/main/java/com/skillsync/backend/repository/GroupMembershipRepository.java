package com.skillsync.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skillsync.backend.model.GroupMembership;

public interface GroupMembershipRepository extends JpaRepository<GroupMembership, Long> {
    List<GroupMembership> findByGroupId(Long groupId);
    
    List<GroupMembership> findByUserId(Long userId);
    
    Optional<GroupMembership> findByGroupIdAndUserId(Long groupId, Long userId);
    
    void deleteByGroupIdAndUserId(Long groupId, Long userId);
    
    long countByGroupId(Long groupId);
    
    @Query("SELECT COUNT(gm) > 0 FROM GroupMembership gm WHERE gm.group.id = :groupId AND gm.user.id = :userId")
    boolean isMember(@Param("groupId") Long groupId, @Param("userId") Long userId);
    
    void deleteByGroupId(Long groupId);
}
