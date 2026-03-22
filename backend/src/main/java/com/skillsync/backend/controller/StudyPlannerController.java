package com.skillsync.backend.controller;

import com.skillsync.backend.dto.studyplanner.CreateStudyEventRequest;
import com.skillsync.backend.dto.studyplanner.StudyEventResponse;
import com.skillsync.backend.service.StudyPlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-planner")
public class StudyPlannerController {

    @Autowired
    private StudyPlannerService studyPlannerService;

    @PostMapping("/events")
    public ResponseEntity<StudyEventResponse> createEvent(Authentication auth, @RequestBody CreateStudyEventRequest request) {
        return ResponseEntity.ok(studyPlannerService.createEvent(auth.getName(), request));
    }

    @GetMapping("/events")
    public ResponseEntity<List<StudyEventResponse>> getEvents(
            Authentication auth,
            @RequestParam(name = "month", required = false) Integer month,
            @RequestParam(name = "year", required = false) Integer year) {
        if (month != null && year != null) {
            return ResponseEntity.ok(studyPlannerService.getEventsByMonth(auth.getName(), year, month));
        }
        return ResponseEntity.ok(studyPlannerService.getAllEvents(auth.getName()));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<StudyEventResponse> updateEvent(Authentication auth, @PathVariable("id") Long id, @RequestBody CreateStudyEventRequest request) {
        return ResponseEntity.ok(studyPlannerService.updateEvent(auth.getName(), id, request));
    }

    @PutMapping("/events/{id}/status")
    public ResponseEntity<StudyEventResponse> updateStatus(Authentication auth, @PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(studyPlannerService.updateStatus(auth.getName(), id, body.get("status")));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(Authentication auth, @PathVariable("id") Long id) {
        studyPlannerService.deleteEvent(auth.getName(), id);
        return ResponseEntity.ok().build();
    }
}