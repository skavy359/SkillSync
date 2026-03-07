package com.skillsync.backend.dto.forum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePostRequest {
    private String title;
    private String content;
    private Long skillId;
    private String tag;
}
