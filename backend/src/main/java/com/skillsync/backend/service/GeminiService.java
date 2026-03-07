package com.skillsync.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillsync.backend.dto.quiz.QuizQuestionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public List<QuizQuestionDTO> generateQuizQuestions(String skillName, String difficulty, int count) {
        String prompt = buildPrompt(skillName, difficulty, count);

        try {
            logger.info("Generating quiz for skill: {}, difficulty: {}, count: {}", skillName, difficulty, count);
            logger.debug("API Key configured: {}", apiKey != null && !apiKey.isEmpty());
            
            String url = GEMINI_URL + "?key=" + apiKey;

            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> contentPart = Map.of("parts", List.of(textPart));
            Map<String, Object> requestBody = Map.of("contents", List.of(contentPart));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            logger.debug("Calling Gemini API...");
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            logger.debug("Gemini API response status: {}", response.getStatusCode());
            List<QuizQuestionDTO> questions = parseResponse(response.getBody());
            logger.info("Generated {} quiz questions successfully", questions.size());
            return questions;
        } catch (Exception e) {
            logger.error("Gemini API error: ", e);
            logger.warn("Falling back to placeholder questions");
            return generateFallbackQuestions(skillName, difficulty, count);
        }
    }

    private String buildPrompt(String skillName, String difficulty, int count) {
        return "Generate exactly " + count + " multiple choice quiz questions about " + skillName +
                " at " + difficulty + " difficulty level.\n\n" +
                "Return ONLY a JSON array with no additional text, markdown, or code blocks. " +
                "Each element must have exactly these fields:\n" +
                "- \"question\": the question text\n" +
                "- \"options\": array of exactly 4 answer strings\n" +
                "- \"correctAnswer\": integer index (0-3) of the correct option\n" +
                "- \"explanation\": brief explanation of why the answer is correct\n\n" +
                "Example format:\n" +
                "[{\"question\":\"What is...?\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctAnswer\":0,\"explanation\":\"Because...\"}]\n\n" +
                "IMPORTANT: Return ONLY the raw JSON array. No markdown formatting, no ```json blocks, no extra text.";
    }

    private List<QuizQuestionDTO> parseResponse(String responseBody) {
        try {
            if (responseBody == null || responseBody.isEmpty()) {
                logger.error("Response body is null or empty");
                return Collections.emptyList();
            }
            
            logger.info("Full Gemini response: {}", responseBody);
            
            JsonNode root = objectMapper.readTree(responseBody);
            
            // Check for error in response
            if (root.has("error")) {
                logger.error("Gemini API error: {}", root.path("error").asText());
                return Collections.emptyList();
            }
            
            JsonNode candidates = root.path("candidates");
            if (candidates.isEmpty()) {
                logger.error("No candidates in response");
                return Collections.emptyList();
            }
            
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            logger.info("Extracted text from Gemini: {}", text);

            // Strip markdown code blocks if present
            text = text.trim();
            if (text.startsWith("```json")) {
                text = text.substring(7);
            } else if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - 3);
            }
            text = text.trim();

            logger.debug("Cleaned JSON text: {}", text);
            List<QuizQuestionDTO> questions = objectMapper.readValue(text, new TypeReference<List<QuizQuestionDTO>>() {});
            logger.info("Successfully parsed {} questions from Gemini", questions.size());
            return questions;
        } catch (Exception e) {
            logger.error("Failed to parse Gemini response - Exception: {}", e.getMessage(), e);
            logger.error("Exception type: {}", e.getClass().getName());
            return Collections.emptyList();
        }
    }

    private List<QuizQuestionDTO> generateFallbackQuestions(String skillName, String difficulty, int count) {
        List<QuizQuestionDTO> fallback = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            QuizQuestionDTO q = new QuizQuestionDTO();
            q.setQuestion("Sample " + difficulty + " question " + i + " about " + skillName + "?");
            q.setOptions(List.of(
                    "Option A", "Option B", "Option C", "Option D"
            ));
            q.setCorrectAnswer(0);
            q.setExplanation("This is a fallback question. Please configure your Gemini API key for real AI-generated questions.");
            fallback.add(q);
        }
        return fallback;
    }
}
