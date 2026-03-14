package com.skillsync.backend.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.skillsync.backend.model.StudyGroup;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    List<StudyGroup> findBySkillId(Long skillId);
    
    List<StudyGroup> findByCreatedById(Long userId);
    
    Page<StudyGroup> findByIsPublicTrue(Pageable pageable);
    
    @Query("SELECT sg FROM StudyGroup sg WHERE sg.skill.id = :skillId AND sg.isPublic = true")
    Page<StudyGroup> findPublicGroupsBySkillId(@Param("skillId") Long skillId, Pageable pageable);
    
    @Query("SELECT sg FROM StudyGroup sg JOIN GroupMembership gm ON sg.id = gm.group.id WHERE gm.user.id = :userId")
    List<StudyGroup> findUserGroups(@Param("userId") Long userId);
    
    @Query("SELECT sg FROM StudyGroup sg WHERE LOWER(sg.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND sg.isPublic = true")
    Page<StudyGroup> searchPublicGroups(@Param("searchTerm") String searchTerm, Pageable pageable);
}