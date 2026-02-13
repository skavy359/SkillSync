package com.skillsync.backend.repository;

import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByUser(User user);
    Optional<Skill> findByIdAndUser(Long id, User user);
}