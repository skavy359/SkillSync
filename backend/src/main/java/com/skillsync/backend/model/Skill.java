package com.skillsync.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skills")
@Getter
@Setter
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillLevel level;

    @Column(nullable = false)
    private int progress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL)
    private List<LearningSession> sessions = new ArrayList<>();

    @ManyToOne
    private SkillCategory category;

    @Column
    private Double estimatedHours;
}