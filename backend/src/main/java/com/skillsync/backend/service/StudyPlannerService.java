package com.skillsync.backend.service;

import com.skillsync.backend.dto.studyplanner.CreateStudyEventRequest;
import com.skillsync.backend.dto.studyplanner.StudyEventResponse;
import com.skillsync.backend.model.*;
import com.skillsync.backend.repository.StudyEventRepository;
import com.skillsync.backend.repository.SkillRepository;
import com.skillsync.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudyPlannerService {

    @Autowired
    private StudyEventRepository studyEventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    public StudyEventResponse createEvent(String userEmail, CreateStudyEventRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudyEvent event = new StudyEvent();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setColor(request.getColor() != null ? request.getColor() : "#8b5cf6");
        event.setUser(user);
        event.setStatus(StudyEventStatus.PLANNED);

        if (request.getSkillId() != null) {
            Skill skill = skillRepository.findById(request.getSkillId()).orElse(null);
            event.setSkill(skill);
        }

        StudyEvent saved = studyEventRepository.save(event);
        return toResponse(saved);
    }

    public List<StudyEventResponse> getEventsByMonth(String userEmail, int year, int month) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        return studyEventRepository.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(user.getId(), start, end)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<StudyEventResponse> getAllEvents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return studyEventRepository.findByUserIdOrderByStartTimeAsc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public StudyEventResponse updateEvent(String userEmail, Long eventId, CreateStudyEventRequest request) {
        StudyEvent event = studyEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        if (request.getColor() != null) event.setColor(request.getColor());

        if (request.getSkillId() != null) {
            Skill skill = skillRepository.findById(request.getSkillId()).orElse(null);
            event.setSkill(skill);
        } else {
            event.setSkill(null);
        }

        return toResponse(studyEventRepository.save(event));
    }

    public StudyEventResponse updateStatus(String userEmail, Long eventId, String status) {
        StudyEvent event = studyEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        event.setStatus(StudyEventStatus.valueOf(status));
        return toResponse(studyEventRepository.save(event));
    }

    public void deleteEvent(String userEmail, Long eventId) {
        StudyEvent event = studyEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        studyEventRepository.delete(event);
    }

    private StudyEventResponse toResponse(StudyEvent event) {
        StudyEventResponse r = new StudyEventResponse();
        r.setId(event.getId());
        r.setTitle(event.getTitle());
        r.setDescription(event.getDescription());
        r.setStartTime(event.getStartTime());
        r.setEndTime(event.getEndTime());
        r.setStatus(event.getStatus().name());
        r.setColor(event.getColor());
        r.setCreatedAt(event.getCreatedAt());

        if (event.getSkill() != null) {
            r.setSkillId(event.getSkill().getId());
            r.setSkillName(event.getSkill().getName());
        }

        return r;
    }
}
