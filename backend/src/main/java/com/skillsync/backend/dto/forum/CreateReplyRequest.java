package com.skillsync.backend.dto.forum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReplyRequest {
    private String content;
}