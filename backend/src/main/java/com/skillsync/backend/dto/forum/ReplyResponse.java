package com.skillsync.backend.dto.forum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ReplyResponse {
    private Long id;
    private String content;
    private String authorName;
    private Long authorId;
    private int upvotes;
    private boolean acceptedAnswer;
    private boolean upvotedByMe;
    private LocalDateTime createdAt;
}
