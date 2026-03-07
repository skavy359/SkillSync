package com.skillsync.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.LeaderboardEntryResponse;
import com.skillsync.backend.dto.SharingProfileResponse;
import com.skillsync.backend.service.LeaderboardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryResponse>>> getSkillsLeaderboard() {
        List<LeaderboardEntryResponse> leaderboard = leaderboardService.getSkillsLeaderboard();
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Skills leaderboard fetched", leaderboard)
        );
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryResponse>>> getSessionsLeaderboard() {
        List<LeaderboardEntryResponse> leaderboard = leaderboardService.getSessionsLeaderboard();
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Sessions leaderboard fetched", leaderboard)
        );
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<SharingProfileResponse>> getUserProfile(
            @PathVariable Long userId) {
        SharingProfileResponse profile = leaderboardService.getUserProfile(userId);
        return ResponseEntity.ok(
            new ApiResponse<>(true, "User profile fetched", profile)
        );
    }
}