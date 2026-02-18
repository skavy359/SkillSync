package com.skillsync.backend.repository;

import com.skillsync.backend.model.LearningGoal;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningGoalRepository extends JpaRepository<LearningGoal, Long> {

    List<LearningGoal> findAllByUser(User user);

    Optional<LearningGoal> findByUserAndSkill(User user, Skill skill);

    List<LearningGoal> findByUser(User user);
}