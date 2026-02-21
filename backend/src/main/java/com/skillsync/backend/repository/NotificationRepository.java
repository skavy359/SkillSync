package com.skillsync.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skillsync.backend.model.Notification;
import com.skillsync.backend.model.User;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndReadFalse(User user);
    long countByUserAndReadFalse(User user);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.type = :type " +
           "AND n.createdAt > :afterTime ORDER BY n.createdAt DESC LIMIT 1")
    Notification findLatestNotificationOfType(@Param("user") User user, 
                                             @Param("type") String type, 
                                             @Param("afterTime") LocalDateTime afterTime);
}