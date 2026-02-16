package com.skillsync.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class RecommendationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Skill skill;

    private String reason;
    private LocalDateTime createdAt;

    public RecommendationHistory() {}

    public RecommendationHistory(
            User user,
            Skill skill,
            String reason
    ) {
        this.user = user;
        this.skill = skill;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }
}