package com.skillsync.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}