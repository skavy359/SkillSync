package com.skillsync.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class LearningSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int durationMinutes;

    private LocalDate sessionDate;

    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    private Skill skill;
}