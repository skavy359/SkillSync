package com.skillsync.backend.service;

import com.skillsync.backend.model.Notification;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(
            User user,
            String type,
            String message
    ) {
        Notification notification =
                new Notification(type, message, user);

        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository
                .countByUserAndReadFalse(user);
    }

    public void markAsRead(Long id) {
        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow();

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}