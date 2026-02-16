package com.skillsync.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    @ManyToOne
    private User user;

    public Notification() {}

    public Notification(String type, String message, User user) {
        this.type = type;
        this.message = message;
        this.user = user;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }
}