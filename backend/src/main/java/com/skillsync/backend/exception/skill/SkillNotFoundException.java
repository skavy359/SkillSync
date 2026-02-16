package com.skillsync.backend.exception.skill;

public class SkillNotFoundException extends RuntimeException {
    public SkillNotFoundException(Long skillId) {
        super("Skill not found with id: " + skillId);
    }
}