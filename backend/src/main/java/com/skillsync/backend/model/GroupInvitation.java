package com.skillsync.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "group_invitations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"group_id", "invited_user_id", "status"})
})
@Getter
@Setter
public class GroupInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_user_id", nullable = false)
    private User invitedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by_user_id", nullable = false)
    private User invitedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private InvitationStatus status = InvitationStatus.PENDING;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime respondedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        // Invitations expire in 7 days
        expiresAt = LocalDateTime.now().plusDays(7);
    }

    public enum InvitationStatus {
        PENDING, ACCEPTED, REJECTED, EXPIRED
    }
}
