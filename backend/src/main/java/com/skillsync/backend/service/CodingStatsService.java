package com.skillsync.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CodingStatsService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CodingStatsService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Cacheable(value = "leetcodeStats", key = "#username", unless = "#result == null")
    public Map<String, Object> fetchLeetCodeStats(String username) {
        if (username == null || username.isBlank()) {
            return null;
        }
        try {
            log.info("Fetching LeetCode stats for: {}", username);
            Map<String, Object> solvedRes = restTemplate.getForObject(
                "https://alfa-leetcode-api.onrender.com/" + username + "/solved",
                Map.class
            );
            if (solvedRes == null) {
                log.warn("LeetCode solved API returned null");
                return null;
            }

            Map<String, Object> calendarRes = restTemplate.getForObject(
                "https://alfa-leetcode-api.onrender.com/" + username + "/calendar",
                Map.class
            );

            Map<String, Object> result = new HashMap<>();
            result.put("platform", "leetcode");
            result.put("totalSolved", solvedRes.getOrDefault("solvedProblem", 0));
            result.put("easySolved", solvedRes.getOrDefault("easySolved", 0));
            result.put("mediumSolved", solvedRes.getOrDefault("mediumSolved", 0));
            result.put("hardSolved", solvedRes.getOrDefault("hardSolved", 0));
            result.put("totalEasy", solvedRes.getOrDefault("totalEasy", 0));
            result.put("totalMedium", solvedRes.getOrDefault("totalMedium", 0));
            result.put("totalHard", solvedRes.getOrDefault("totalHard", 0));

            Map<String, Integer> submissionCalendar = new HashMap<>();
            if (calendarRes != null) {
                Object calendarRaw = calendarRes.get("submissionCalendar");
                if (calendarRaw instanceof String) {
                    try {
                        submissionCalendar = objectMapper.readValue((String) calendarRaw, Map.class);
                    } catch (Exception e) {
                        log.warn("Failed to parse submission calendar: {}", e.getMessage());
                    }
                } else if (calendarRaw instanceof Map) {
                    submissionCalendar = (Map<String, Integer>) calendarRaw;
                }
            }
            result.put("submissionCalendar", submissionCalendar);

            try {
                Map<String, Object> contestRes = restTemplate.getForObject(
                    "https://alfa-leetcode-api.onrender.com/" + username + "/contest",
                    Map.class
                );
                if (contestRes != null) {
                    result.put("contestRating", Math.round((Double) contestRes.getOrDefault("contestRating", 0.0)));
                    result.put("contestsAttended", contestRes.getOrDefault("contestAttend", 0));
                }
            } catch (Exception e) {
                log.warn("Failed to fetch contest info: {}", e.getMessage());
            }

            log.info("Successfully fetched LeetCode stats for: {}", username);
            return result;
        } catch (Exception e) {
            log.error("Error fetching LeetCode stats for {}: {}", username, e.getMessage());
            return null;
        }
    }

    @Cacheable(value = "codeforcesStats", key = "#username", unless = "#result == null")
    public Map<String, Object> fetchCodeforcesStats(String username) {
        if (username == null || username.isBlank()) {
            return null;
        }
        try {
            log.info("Fetching Codeforces stats for: {}", username);

            Map<String, Object> infoRes = restTemplate.getForObject(
                "https://codeforces.com/api/user.info?handles=" + username,
                Map.class
            );
            
            if (infoRes == null || !"OK".equals(infoRes.get("status"))) {
                log.warn("Codeforces user info returned error");
                return null;
            }

            List<Map<String, Object>> resultList = (List<Map<String, Object>>) infoRes.get("result");
            if (resultList == null || resultList.isEmpty()) {
                return null;
            }
            
            Map<String, Object> user = resultList.get(0);

            Map<String, Object> statusRes = restTemplate.getForObject(
                "https://codeforces.com/api/user.status?handle=" + username + "&from=1&count=10000",
                Map.class
            );
            
            int solvedCount = 0;
            if (statusRes != null && "OK".equals(statusRes.get("status"))) {
                List<Map<String, Object>> submissions = (List<Map<String, Object>>) statusRes.get("result");
                if (submissions != null) {
                    for (Map<String, Object> sub : submissions) {
                        String verdict = (String) sub.get("verdict");
                        if ("OK".equals(verdict)) {
                            solvedCount++;
                        }
                    }
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("platform", "codeforces");
            result.put("totalSolved", solvedCount);
            result.put("rating", user.getOrDefault("rating", 0));
            result.put("maxRating", user.getOrDefault("maxRating", 0));
            result.put("rank", user.getOrDefault("rank", "unrated"));
            result.put("maxRank", user.getOrDefault("maxRank", "unrated"));
            result.put("handle", user.getOrDefault("handle", username));
            
            log.info("Successfully fetched Codeforces stats for: {} (solved: {})", username, solvedCount);
            return result;
        } catch (Exception e) {
            log.error("Error fetching Codeforces stats for {}: {}", username, e.getMessage());
            return null;
        }
    }

    @Cacheable(value = "githubStats", key = "#username", unless = "#result == null")
    public Map<String, Object> fetchGitHubStats(String username) {
        if (username == null || username.isBlank()) {
            return null;
        }
        try {
            log.info("Fetching GitHub stats for: {}", username);
            
            Map<String, Object> user = restTemplate.getForObject(
                "https://api.github.com/users/" + username,
                Map.class
            );

            if (user == null) {
                log.warn("GitHub API returned null");
                return null;
            }

            Map<String, Object> result = new HashMap<>();
            result.put("platform", "github");
            result.put("login", user.getOrDefault("login", ""));
            result.put("publicRepos", user.getOrDefault("public_repos", 0));
            result.put("followers", user.getOrDefault("followers", 0));
            result.put("totalStars", 0);
            result.put("totalForks", 0);
            result.put("avatarUrl", user.getOrDefault("avatar_url", ""));

            log.info("Successfully fetched GitHub stats for: {}", username);
            return result;
        } catch (Exception e) {
            log.error("Error fetching GitHub stats for {}: {}", username, e.getMessage());
            return null;
        }
    }
}