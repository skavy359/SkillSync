package com.skillsync.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skillsync.backend.model.GroupInvitation;
import com.skillsync.backend.model.GroupInvitation.InvitationStatus;

public interface GroupInvitationRepository extends JpaRepository<GroupInvitation, Long> {
    List<GroupInvitation> findByInvitedUserId(Long userId);
    
    List<GroupInvitation> findByGroupId(Long groupId);
    
    List<GroupInvitation> findByInvitedUserIdAndStatus(Long userId, InvitationStatus status);
    
    Optional<GroupInvitation> findByGroupIdAndInvitedUserIdAndStatus(Long groupId, Long userId, InvitationStatus status);
    
    @Query("SELECT gi FROM GroupInvitation gi WHERE gi.invitedUser.id = :userId AND gi.status = 'PENDING' AND gi.expiresAt > CURRENT_TIMESTAMP")
    List<GroupInvitation> findPendingInvitations(@Param("userId") Long userId);
    
    long countByGroupIdAndStatus(Long groupId, InvitationStatus status);
    
    void deleteByGroupId(Long groupId);
}
