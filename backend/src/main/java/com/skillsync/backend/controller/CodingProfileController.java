package com.skillsync.backend.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.skillsync.backend.dto.ApiResponse;
import com.skillsync.backend.dto.CodingProfileRequest;
import com.skillsync.backend.dto.CodingProfileResponse;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;
import com.skillsync.backend.service.CodingStatsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coding-profile")
@RequiredArgsConstructor
public class CodingProfileController {
    private final UserRepository userRepository;
    private final CodingStatsService codingStatsService;

    @GetMapping
    public ResponseEntity<ApiResponse<CodingProfileResponse>> getProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(new ApiResponse<>(true, "Coding profile fetched", mapToResponse(user)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<CodingProfileResponse>> updateProfile(@RequestBody CodingProfileRequest request) {
        User user = getCurrentUser();
        user.setLeetcodeUsername(request.getLeetcodeUsername());
        user.setCodeforcesUsername(request.getCodeforcesUsername());
        user.setGithubUsername(request.getGithubUsername());
        user.setHackerrankUsername(request.getHackerrankUsername());
        user.setAtcoderUsername(request.getAtcoderUsername());
        user.setSpojUsername(request.getSpojUsername());
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Coding profile updated", mapToResponse(user)));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<ApiResponse<List<CodingProfileResponse>>> getLeaderboard() {
        List<User> users = userRepository.findAll();
        List<CodingProfileResponse> profiles = users.stream()
            .filter(u -> u.getLeetcodeUsername() != null || u.getCodeforcesUsername() != null
                || u.getGithubUsername() != null || u.getHackerrankUsername() != null
                || u.getAtcoderUsername() != null || u.getSpojUsername() != null)
            .map(this::mapToResponse)
            .toList();
        return ResponseEntity.ok(new ApiResponse<>(true, "Coding leaderboard fetched", profiles));
    }

    @GetMapping("/stats/leetcode/{username}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLeetCodeStats(@PathVariable String username) {
        Map<String, Object> stats = codingStatsService.fetchLeetCodeStats(username);
        if (stats == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Failed to fetch LeetCode stats", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "LeetCode stats fetched", stats));
    }

    @GetMapping("/stats/codeforces/{username}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCodeforcesStats(@PathVariable String username) {
        Map<String, Object> stats = codingStatsService.fetchCodeforcesStats(username);
        if (stats == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Failed to fetch Codeforces stats", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Codeforces stats fetched", stats));
    }

    @GetMapping("/stats/github/{username}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGitHubStats(@PathVariable String username) {
        Map<String, Object> stats = codingStatsService.fetchGitHubStats(username);
        if (stats == null) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Failed to fetch GitHub stats", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "GitHub stats fetched", stats));
    }

    private CodingProfileResponse mapToResponse(User u) {
        return new CodingProfileResponse(
            u.getId(), u.getName(),
            u.getLeetcodeUsername(), u.getCodeforcesUsername(), u.getGithubUsername(),
            u.getHackerrankUsername(), u.getAtcoderUsername(), u.getSpojUsername()
        );
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}