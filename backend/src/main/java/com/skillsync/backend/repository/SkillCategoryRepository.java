package com.skillsync.backend.repository;

import com.skillsync.backend.model.SkillCategory;
import com.skillsync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {

    List<SkillCategory> findAllByUser(User user);

    Optional<SkillCategory> findByIdAndUser(Long id, User user);

    List<SkillCategory> findByUser(User user);
}