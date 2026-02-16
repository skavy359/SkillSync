package com.skillsync.backend.exception.admin;

public class AdminOperationNotAllowedException extends RuntimeException {
    public AdminOperationNotAllowedException(String message) {
        super(message);
    }
}