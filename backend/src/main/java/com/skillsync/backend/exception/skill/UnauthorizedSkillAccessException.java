package com.skillsync.backend.exception.skill;

public class UnauthorizedSkillAccessException extends RuntimeException {
    public UnauthorizedSkillAccessException(Long skillId) {
        super("You do not have access to skill id: " + skillId);
    }
}