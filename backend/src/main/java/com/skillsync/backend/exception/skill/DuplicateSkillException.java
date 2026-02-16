package com.skillsync.backend.exception.skill;

public class DuplicateSkillException extends RuntimeException {
    public DuplicateSkillException(String name) {
        super("Skill already exists: " + name);
    }
}