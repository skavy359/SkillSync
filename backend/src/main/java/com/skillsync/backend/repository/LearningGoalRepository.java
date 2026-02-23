package com.skillsync.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillsync.backend.model.LearningGoal;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.User;

@Repository
public interface LearningGoalRepository extends JpaRepository<LearningGoal, Long> {

    List<LearningGoal> findAllByUser(User user);

    Optional<LearningGoal> findByUserAndSkill(User user, Skill skill);

    List<LearningGoal> findByUser(User user);

    List<LearningGoal> findBySkill(Skill skill);
}