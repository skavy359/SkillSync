package com.skillsync.backend.dto.forum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private Long authorId;
    private String skillName;
    private String tag;
    private int upvotes;
    private int replyCount;
    private boolean upvotedByMe;
    private LocalDateTime createdAt;
}
