package com.skillsync.backend.service;

import com.skillsync.backend.dto.*;
import com.skillsync.backend.dto.audit.AuditLogResponse;
import com.skillsync.backend.dto.goal.CreateGoalRequest;
import com.skillsync.backend.dto.goal.GoalAnalyticsResponse;
import com.skillsync.backend.dto.goal.GoalResponse;
import com.skillsync.backend.dto.recommendation.RecommendationHistoryResponse;
import com.skillsync.backend.dto.recommendation.SkillRecommendationResponse;
import com.skillsync.backend.dto.recommendation.UserRecommendationResponse;
import com.skillsync.backend.dto.session.AddSessionRequest;
import com.skillsync.backend.dto.session.SessionResponse;
import com.skillsync.backend.dto.session.SessionStatsResponse;
import com.skillsync.backend.dto.stats.*;
import com.skillsync.backend.model.*;
import com.skillsync.backend.repository.*;
import com.skillsync.backend.security.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.skillsync.backend.exception.EmailAlreadyExistsException;
import com.skillsync.backend.exception.InvalidCredentialsException;
import com.skillsync.backend.exception.user.UserNotFoundException;
import com.skillsync.backend.exception.skill.SkillNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SkillRepository skillRepository;
    private final LearningSessionRepository learningSessionRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final LearningGoalRepository learningGoalRepository;
    private final NotificationService notificationService;
    private final RecommendationHistoryRepository recommendationHistoryRepository;
    private final AuditService auditService;
    private final AuditLogRepository auditLogRepository;

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            SkillRepository skillRepository,
            LearningSessionRepository learningSessionRepository,
            SkillCategoryRepository skillCategoryRepository,
            LearningGoalRepository learningGoalRepository,
            NotificationService notificationService,
            RecommendationHistoryRepository recommendationHistoryRepository,
            AuditService auditService,
            AuditLogRepository auditLogRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.skillRepository = skillRepository;
        this.learningSessionRepository = learningSessionRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.learningGoalRepository = learningGoalRepository;
        this.notificationService = notificationService;
        this.recommendationHistoryRepository = recommendationHistoryRepository;
        this.auditService = auditService;
        this.auditLogRepository = auditLogRepository;
    }

    public UserResponse registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        auditService.log(
                savedUser,
                "REGISTER",
                "USER",
                savedUser.getId()
        );

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public LoginResponse authenticate(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid Email or Password")
                );

        boolean passwordMatches =
                passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        String token;
    if (request.isRememberMe()) {
        // 5 days in milliseconds
        long rememberMeExpiration = 5L * 24 * 60 * 60 * 1000;
        token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                rememberMeExpiration
        );
    } else {
        token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
        auditService.log(
                user,
                "LOGIN",
                "USER",
                user.getId()
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public UserProfileResponse getMyProfile() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        user.setName(request.getName());

        User updatedUser = userRepository.save(user);

        return new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole().name()
        );
    }

    public SkillResponse addSkill(AddSkillRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        SkillCategory category = null;

        if (request.getCategoryId() != null) {
            category = skillCategoryRepository
                    .findByIdAndUser(request.getCategoryId(), user)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Skill skill = new Skill();
        skill.setName(request.getName());
        skill.setLevel(request.getLevel());
        skill.setProgress(0);
        skill.setStatus(SkillStatus.ACTIVE);
        skill.setUser(user);
        skill.setCategory(category);

        Skill savedSkill = skillRepository.save(skill);

        auditService.log(
                user,
                "CREATE",
                "SKILL",
                savedSkill.getId()
        );

        return mapSkill(savedSkill);
    }

    public Page<SkillResponse> getMySkills(
            SkillStatus status,
            SkillLevel level,
            String search,
            int page,
            int size
    ) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Pageable pageable = PageRequest.of(page, size);

        Page<Skill> skillPage;

        if (search != null && !search.isBlank()) {
            skillPage = skillRepository
                    .findByUserAndNameContainingIgnoreCase(user, search, pageable);

        } else if (status != null) {
            skillPage = skillRepository
                    .findByUserAndStatus(user, status, pageable);

        } else if (level != null) {
            skillPage = skillRepository
                    .findByUserAndLevel(user, level, pageable);

        } else {
            skillPage = skillRepository
                    .findByUser(user, pageable);
        }
        return skillPage.map(this::mapSkill);
    }

    public SkillResponse updateSkillProgress(
            Long skillId,
            UpdateSkillProgressRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        skill.setProgress(request.getProgress());

        if (request.getProgress() == 100) {
            skill.setStatus(SkillStatus.COMPLETED);
        } else {
            skill.setStatus(SkillStatus.ACTIVE);
        }

        Skill updatedSkill = skillRepository.save(skill);

        auditService.log(
                user,
                "UPDATE",
                "SKILL",
                skill.getId()
        );

        return mapSkill(updatedSkill);
    }

    public void deleteSkill(Long skillId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        skillRepository.delete(skill);

        auditService.log(
                user,
                "DELETE",
                "SKILL",
                skill.getId()
        );
    }

    public Page<AdminUserResponse> getAllUsersForAdmin(
            Role role,
            String search,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<User> userPage;

        if (search != null && !search.isBlank()) {

            userPage = userRepository
                    .findByNameContainingIgnoreCase(search, pageable);

        } else if (role != null) {

            userPage = userRepository
                    .findByRole(role, pageable);

        } else {

            userPage = userRepository.findAll(pageable);
        }

        return userPage.map(user -> new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        ));
    }

    public List<SkillResponse> getSkillsOfUserForAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        List<Skill> skills = skillRepository.findAllByUser(user);

        return skills.stream()
                .map(this::mapSkill)
                .toList();
    }

    private String getCurrentUserEmail() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private SkillResponse mapSkill(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getLevel().name(),
                skill.getProgress(),
                skill.getStatus().name()
        );
    }

    public UserStatsResponse getMyStats() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        long total = skillRepository.countByUser(user);
        long completed = skillRepository.countByUserAndStatus(user, SkillStatus.COMPLETED);
        long active = skillRepository.countByUserAndStatus(user, SkillStatus.ACTIVE);

        double completionRate =
                total == 0 ? 0 : (double) completed / total * 100;

        double avgProgress =
                skillRepository.findAllByUser(user).stream()
                        .mapToInt(Skill::getProgress)
                        .average()
                        .orElse(0);

        String topSkill =
                skillRepository.findTopByUserOrderByProgressDesc(user)
                        .map(Skill::getName)
                        .orElse(null);

        return new UserStatsResponse(
                total,
                active,
                completed,
                completionRate,
                avgProgress,
                topSkill
        );
    }

    public AdminStatsResponse getAdminStats() {

        long totalUsers = userRepository.countBy();
        long totalSkills = skillRepository.count();

        // Count total sessions from all users
        long totalSessions = learningSessionRepository.count();

        // Calculate active users (users who have at least one active skill)
        long activeUsers = userRepository.findAll().stream()
                .filter(user -> skillRepository.countByUserAndStatus(user, SkillStatus.ACTIVE) > 0)
                .count();

        return new AdminStatsResponse(
                totalUsers,
                totalSkills,
                totalSessions,
                activeUsers
        );
    }

    public PlatformStatsResponse getPlatformStats() {
        long totalUsers = userRepository.countBy();
        long totalSessions = learningSessionRepository.count();
        long totalSkills = skillRepository.count();

        return new PlatformStatsResponse(
                totalUsers,
                totalSessions,
                totalSkills
        );
    }

    public SessionResponse addSession(
            Long skillId,
            AddSessionRequest request
    ) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        LearningSession session = new LearningSession();
        session.setDurationMinutes(request.getDurationMinutes());
        session.setSessionDate(request.getSessionDate());
        session.setNotes(request.getNotes());
        session.setSkill(skill);

        LearningSession saved =
                learningSessionRepository.save(session);

        auditService.log(
                user,
                "CREATE",
                "SESSION",
                session.getId()
        );

        return new SessionResponse(
                saved.getId(),
                saved.getDurationMinutes(),
                saved.getSessionDate(),
                saved.getNotes()
        );
    }

    public List<SessionResponse> getSessions(Long skillId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        return learningSessionRepository.findBySkill(skill)
                .stream()
                .map(s -> new SessionResponse(
                        s.getId(),
                        s.getDurationMinutes(),
                        s.getSessionDate(),
                        s.getNotes()
                ))
                .toList();
    }

    public SessionStatsResponse getSessionStats(Long skillId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        long count = learningSessionRepository.countBySkill(skill);
        int totalMinutes = learningSessionRepository.sumDurationMinutesBySkill(skill);

        double avg =
                count == 0 ? 0 : (double) totalMinutes / count;

        return new SessionStatsResponse(
                count,
                totalMinutes,
                avg
        );
    }

    public UserLearningStatsResponse getMyLearningStats() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        long totalSkills = skillRepository.countByUser(user);
        long totalSessions = learningSessionRepository.countBySkill_User(user);
        int totalMinutes = learningSessionRepository.sumDurationMinutesByUser(user);

        double avgPerSkill =
                totalSkills == 0 ? 0 : (double) totalMinutes / totalSkills;

        String mostStudied =
                learningSessionRepository.findMostStudiedSkill(user);

        return new UserLearningStatsResponse(
                totalSkills,
                totalSessions,
                totalMinutes,
                avgPerSkill,
                mostStudied
        );
    }

    public UserStreakResponse getMyStreak() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        List<LocalDate> dates =
                learningSessionRepository.findSessionDatesByUser(user);

        if (dates.isEmpty()) {
            return new UserStreakResponse(0, 0, null);
        }

        int current = 1;
        LocalDate prev = dates.get(0);

        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i).equals(prev.minusDays(1))) {
                current++;
                prev = dates.get(i);
            } else {
                break;
            }
        }

        int longest = 1;
        int temp = 1;

        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i - 1).minusDays(1).equals(dates.get(i))) {
                temp++;
                longest = Math.max(longest, temp);
            } else {
                temp = 1;
            }
        }
        int streak = current;

        if (streak > 0 && !hasLearningToday(user)) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.LEARNING_STREAKS,
                    "Your learning streak is at risk. Study today to keep it alive!"
            );
        }

        return new UserStreakResponse(
                current,
                longest,
                dates.get(0)
        );
    }

    public List<DailyActivityResponse> getMyActivityHeatmap() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        return learningSessionRepository.getDailyActivity(user);
    }

    public SkillVelocityResponse getSkillVelocity(Long skillId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        int totalMinutes =
                learningSessionRepository.sumDurationMinutesBySkill(skill);

        int progress = skill.getProgress();

        double velocity = 0;

        if (totalMinutes > 0) {
            double hours = totalMinutes / 60.0;
            velocity = progress / hours;
        }

        return new SkillVelocityResponse(
                skill.getId(),
                skill.getName(),
                totalMinutes,
                progress,
                velocity
        );
    }

    public SkillEtaResponse getSkillEta(Long skillId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        int progress = skill.getProgress();
        int remaining = 100 - progress;

        int totalMinutes =
                learningSessionRepository.sumDurationMinutesBySkill(skill);

        double velocity = 0;
        Double eta = null;

        if (totalMinutes > 0) {
            double hours = totalMinutes / 60.0;
            velocity = progress / hours;

            if (velocity > 0) {
                eta = remaining / velocity;
            }
        }

        return new SkillEtaResponse(
                skill.getId(),
                skill.getName(),
                progress,
                remaining,
                velocity,
                eta
        );
    }

    public UserRecommendationResponse getMyRecommendations() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        List<Skill> skills = skillRepository.findAllByUser(user);

        String slowSkill = null;
        String strongSkill = null;
        String focusSkill = null;

        double minVelocity = Double.MAX_VALUE;
        double maxVelocity = 0;
        double maxRemaining = 0;

        for (Skill skill : skills) {

            int totalMinutes =
                    learningSessionRepository.sumDurationMinutesBySkill(skill);

            if (totalMinutes == 0) continue;

            double hours = totalMinutes / 60.0;
            double velocity = skill.getProgress() / hours;

            if (velocity < minVelocity) {
                minVelocity = velocity;
                slowSkill = skill.getName();
            }
            if (velocity > maxVelocity) {
                maxVelocity = velocity;
                strongSkill = skill.getName();
            }
            int remaining = 100 - skill.getProgress();
            if (remaining > maxRemaining && skill.getProgress() < 80) {
                maxRemaining = remaining;
                focusSkill = skill.getName();
            }
        }

        UserStreakResponse streak = getMyStreak();

        int suggestedMinutes = 30;
        if (streak.getCurrentStreak() >= 3) suggestedMinutes = 45;
        if (streak.getCurrentStreak() >= 7) suggestedMinutes = 60;

        return new UserRecommendationResponse(
                focusSkill,
                slowSkill,
                strongSkill,
                suggestedMinutes
        );
    }

    public CategoryResponse createCategory(CreateCategoryRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        SkillCategory category = new SkillCategory();
        category.setName(request.getName());
        category.setUser(user);

        SkillCategory saved = skillCategoryRepository.save(category);

        return mapToCategoryResponse(saved);
    }

    public List<SkillResponse> getSkillsByCategory(Long categoryId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        SkillCategory category = skillCategoryRepository
                .findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return skillRepository.findAllByCategory(category)
                .stream()
                .map(this::mapSkillToResponse)
                .toList();
    }

    public List<CategoryAnalyticsResponse> getCategoryAnalytics() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        List<SkillCategory> categories =
                skillCategoryRepository.findAllByUser(user);

        return categories.stream()
                .map(cat -> {

                    long totalSkills =
                            skillRepository.countByCategory(cat);

                    long totalSessions =
                            learningSessionRepository.countByCategory(cat);

                    int totalMinutes =
                            learningSessionRepository.sumMinutesByCategory(cat);

                    double avgProgress =
                            skillRepository.avgProgressByCategory(cat);

                    return new CategoryAnalyticsResponse(
                            cat.getId(),
                            cat.getName(),
                            totalSkills,
                            totalSessions,
                            totalMinutes,
                            avgProgress
                    );
                })
                .toList();
    }

    public DomainFocusResponse getDomainFocus() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        List<SkillCategory> categories =
                skillCategoryRepository.findAllByUser(user);

        SkillCategory focusCategory = null;
        int maxMinutes = 0;

        for (SkillCategory cat : categories) {

            int minutes =
                    learningSessionRepository.sumMinutesByCategory(cat);

            if (minutes > maxMinutes) {
                maxMinutes = minutes;
                focusCategory = cat;
            }
        }

        if (focusCategory == null) {
            return null;
        }

        return new DomainFocusResponse(
                focusCategory.getId(),
                focusCategory.getName(),
                maxMinutes
        );
    }

    public GoalResponse createGoal(CreateGoalRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(request.getSkillId(), user)
                .orElseThrow(() -> new SkillNotFoundException(request.getSkillId()));

        if (learningGoalRepository.findByUserAndSkill(user, skill).isPresent()) {
            throw new RuntimeException("Goal already exists for skill");
        }

        LearningGoal goal = new LearningGoal();
        goal.setUser(user);
        goal.setSkill(skill);
        goal.setTargetDate(request.getTargetDate());

        LearningGoal saved = learningGoalRepository.save(goal);

        auditService.log(
                user,
                "CREATE",
                "GOAL",
                goal.getId()
        );

        return mapToGoalResponse(saved);
    }

    public List<GoalAnalyticsResponse> getGoalAnalytics() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        List<LearningGoal> goals =
                learningGoalRepository.findAllByUser(user);

        return goals.stream()
                .map(goal -> {

                    Skill skill = goal.getSkill();

                    int progress = skill.getProgress();
                    int remaining = 100 - progress;

                    int totalMinutes =
                            learningSessionRepository
                                    .sumDurationMinutesBySkill(skill);

                    double velocity = 0;
                    if (totalMinutes > 0) {
                        double hours = totalMinutes / 60.0;
                        velocity = progress / hours;
                    }

                    long daysLeft =
                            ChronoUnit.DAYS.between(
                                    LocalDate.now(),
                                    goal.getTargetDate()
                            );

                    double requiredVelocity = 0;
                    if (daysLeft > 0) {
                        requiredVelocity =
                                (double) remaining / daysLeft;
                    }

                    String risk;
                    if (velocity == 0 || requiredVelocity > velocity) {
                        risk = "HIGH";
                    } else if (requiredVelocity > velocity * 0.7) {
                        risk = "MEDIUM";
                    } else {
                        risk = "LOW";
                    }

                    if ("HIGH".equals(risk)) {
                        notificationService.createNotificationIfPreferenceEnabled(
                                user,
                                NotificationService.NotificationType.GOAL_ALERTS,
                                "Your goal deadline is at high risk. Increase learning time to stay on track."
                        );
                    }

                    return new GoalAnalyticsResponse(
                            goal.getId(),
                            skill.getName(),
                            progress,
                            remaining,
                            daysLeft,
                            velocity,
                            requiredVelocity,
                            risk
                    );
                })
                .toList();
    }

    public TimeWindowStatsResponse getWeeklyStats() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        LocalDate start = LocalDate.now().minusDays(7);

        int minutes =
                learningSessionRepository.sumMinutesFromDate(user, start);

        long sessions =
                learningSessionRepository.countSessionsFromDate(user, start);

        long days =
                learningSessionRepository.countActiveDaysFromDate(user, start);

        return new TimeWindowStatsResponse(
                minutes,
                sessions,
                days
        );
    }

    public TimeWindowStatsResponse getMonthlyStats() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        LocalDate start = LocalDate.now().minusDays(30);

        int minutes =
                learningSessionRepository.sumMinutesFromDate(user, start);

        long sessions =
                learningSessionRepository.countSessionsFromDate(user, start);

        long days =
                learningSessionRepository.countActiveDaysFromDate(user, start);

        return new TimeWindowStatsResponse(
                minutes,
                sessions,
                days
        );
    }

    public BurnoutRiskResponse getBurnoutRisk() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        LocalDate weekStart = LocalDate.now().minusDays(7);
        LocalDate monthStart = LocalDate.now().minusDays(30);

        int weeklyMinutes =
                learningSessionRepository.sumMinutesFromDate(user, weekStart);

        int monthlyMinutes =
                learningSessionRepository.sumMinutesFromDate(user, monthStart);

        double monthlyAvgWeekly = monthlyMinutes / 4.0;

        double ratio = 1;
        if (monthlyAvgWeekly > 0) {
            ratio = weeklyMinutes / monthlyAvgWeekly;
        }

        String risk;
        if (ratio < 0.5) {
            risk = "HIGH";
        } else if (ratio < 0.75) {
            risk = "MEDIUM";
        } else {
            risk = "LOW";
        }

        if ("HIGH".equals(risk)) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.BURNOUT_WARNINGS,
                    "Your learning activity dropped significantly this week. Consider revisiting your skills."
            );
        }

        return new BurnoutRiskResponse(
                weeklyMinutes,
                monthlyMinutes,
                ratio,
                risk
        );
    }

    public SkillDifficultyResponse getSkillDifficulty(Long skillId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        int totalMinutes =
                learningSessionRepository.sumDurationMinutesBySkill(skill);

        int progress = skill.getProgress();

        double difficulty = 0;
        if (progress > 0) {
            difficulty = (double) totalMinutes / progress;
        }

        return new SkillDifficultyResponse(
                skill.getId(),
                skill.getName(),
                totalMinutes,
                progress,
                difficulty
        );
    }

    public CompletionProbabilityResponse getCompletionProbability(Long skillId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        int progress = skill.getProgress();

        int totalMinutes =
                learningSessionRepository.sumDurationMinutesBySkill(skill);

        double velocity = 0;
        if (totalMinutes > 0) {
            double hours = totalMinutes / 60.0;
            velocity = progress / hours;
        }

        double velocityScore = Math.min(velocity * 2, 30);

        int streak = getMyStreak().getCurrentStreak();
        double streakScore = Math.min(streak * 5, 20);

        String burnout = getBurnoutRisk().getRiskLevel();
        double burnoutPenalty = 0;
        if ("HIGH".equals(burnout)) burnoutPenalty = 25;
        if ("MEDIUM".equals(burnout)) burnoutPenalty = 10;

        double difficulty =
                learningSessionRepository.sumDurationMinutesBySkill(skill)
                        / (double) Math.max(progress, 1);

        double difficultyPenalty = Math.min(difficulty, 20);

        double probability =
                progress
                        + velocityScore
                        + streakScore
                        - burnoutPenalty
                        - difficultyPenalty;

        probability = Math.max(0, Math.min(100, probability));

        return new CompletionProbabilityResponse(
                skill.getId(),
                skill.getName(),
                probability
        );
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(null));
    }

    private boolean hasLearningToday(User user) {
        LocalDate today = LocalDate.now();

        int minutes =
                learningSessionRepository.sumMinutesFromDate(user, today);

        return minutes > 0;
    }

    public SkillRecommendationResponse getNextSkillRecommendation() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        List<Skill> skills = skillRepository.findAllByUser(user);

        if (skills.isEmpty()) {
            throw new RuntimeException("No skills available");
        }

        Skill recommended = skills.stream()
                .filter(s -> s.getStatus() == SkillStatus.ACTIVE)
                .min(Comparator.comparingInt(Skill::getProgress))
                .orElse(skills.get(0));

        notificationService.createNotificationIfPreferenceEnabled(
                user,
                NotificationService.NotificationType.ACHIEVEMENT_NOTIFICATIONS,
                "We recommend focusing on " +
                        recommended.getName() +
                        " to improve your progress."
        );

        recommendationHistoryRepository.save(
                new RecommendationHistory(
                        user,
                        recommended,
                        "Lowest progress active skill"
                )
        );

        auditService.log(
                user,
                "GENERATE",
                "RECOMMENDATION",
                recommended.getId()
        );

        return new SkillRecommendationResponse(
                recommended.getId(),
                recommended.getName(),
                "Lowest progress active skill"
        );
    }

    public List<RecommendationHistoryResponse>
    getRecommendationHistory() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        return recommendationHistoryRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(r -> new RecommendationHistoryResponse(
                        r.getSkill().getId(),
                        r.getSkill().getName(),
                        r.getReason(),
                        r.getCreatedAt().toString()
                ))
                .toList();
    }

    private SkillResponse mapSkillToResponse(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getLevel().name(),
                skill.getProgress(),
                skill.getStatus().name()
        );
    }

    public SkillResponse assignCategoryToSkill(Long skillId, Long categoryId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findByIdAndUser(skillId, user)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        SkillCategory category = skillCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        skill.setCategory(category);

        Skill updated = skillRepository.save(skill);

        return mapToSkillResponse(updated);
    }

    public AdminUserResponse adminCreateUser(CreateUserRequest req) {

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setRole(req.getRole());

        userRepository.save(user);

        return mapToAdminUserResponse(user);
    }

    public void adminDeleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public SkillResponse adminAddSkill(Long userId, AddSkillRequest req) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SkillCategory category = skillCategoryRepository.findById(req.getCategoryId())
                .orElse(null);

        Skill skill = new Skill();
        skill.setName(req.getName());
        skill.setLevel(SkillLevel.valueOf(String.valueOf(req.getLevel())));
        skill.setProgress(0);
        skill.setStatus(SkillStatus.ACTIVE);
        skill.setUser(user);
        skill.setCategory(category);

        skillRepository.save(skill);

        return mapToSkillResponse(skill);
    }

    public void adminDeleteSkill(Long skillId) {
        skillRepository.deleteById(skillId);
    }

    public List<CategoryResponse> adminGetCategories() {
        return skillCategoryRepository.findAll()
                .stream()
                .map(this::mapToCategoryResponse)
                .toList();
    }

    public CategoryResponse adminCreateCategory(CreateCategoryRequest req) {

        SkillCategory cat = new SkillCategory();
        cat.setName(req.getName());

        skillCategoryRepository.save(cat);

        return mapToCategoryResponse(cat);
    }

    public void adminDeleteCategory(Long categoryId) {
        skillCategoryRepository.deleteById(categoryId);
    }

    public void updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setRole(role);
        userRepository.save(user);
    }

    public List<CategoryResponse> getAllCategories() {
        User user = getCurrentUser();
        List<SkillCategory> categories = skillCategoryRepository.findByUser(user);

        return categories.stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public List<GoalResponse> getMyGoals() {
        User user = getCurrentUser();
        List<LearningGoal> goals = learningGoalRepository.findByUser(user);

        return goals.stream()
                .map(this::mapToGoalResponse)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getMyAuditLogs() {
        User user = getCurrentUser();
        List<AuditLog> logs = auditLogRepository.findByUserOrderByCreatedAtDesc(user);

        return logs.stream()
                .map(this::mapToAuditLogResponse)
                .collect(Collectors.toList());
    }

    public NotificationPreferencesDTO getNotificationPreferences() {
        User user = getCurrentUser();
        
        return new NotificationPreferencesDTO(
                user.getNotifSessionReminders(),
                user.getNotifGoalAlerts(),
                user.getNotifSkillCompletions(),
                user.getNotifLearningStreaks(),
                user.getNotifCategoryMilestones(),
                user.getNotifBurnoutWarnings(),
                user.getNotifWeeklySummary(),
                user.getNotifAchievementNotifications()
        );
    }

    public NotificationPreferencesDTO updateNotificationPreferences(NotificationPreferencesDTO preferences) {
        User user = getCurrentUser();
        
        if (preferences.getSessionReminders() != null) {
            user.setNotifSessionReminders(preferences.getSessionReminders());
        }
        if (preferences.getGoalAlerts() != null) {
            user.setNotifGoalAlerts(preferences.getGoalAlerts());
        }
        if (preferences.getSkillCompletions() != null) {
            user.setNotifSkillCompletions(preferences.getSkillCompletions());
        }
        if (preferences.getLearningStreaks() != null) {
            user.setNotifLearningStreaks(preferences.getLearningStreaks());
        }
        if (preferences.getCategoryMilestones() != null) {
            user.setNotifCategoryMilestones(preferences.getCategoryMilestones());
        }
        if (preferences.getBurnoutWarnings() != null) {
            user.setNotifBurnoutWarnings(preferences.getBurnoutWarnings());
        }
        if (preferences.getWeeklySummary() != null) {
            user.setNotifWeeklySummary(preferences.getWeeklySummary());
        }
        if (preferences.getAchievementNotifications() != null) {
            user.setNotifAchievementNotifications(preferences.getAchievementNotifications());
        }
        
        userRepository.save(user);
        
        return getNotificationPreferences();
    }

    // ─── Mapper Methods ──────────────────────────────────────────────────

    private GoalResponse mapToGoalResponse(LearningGoal goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getSkill().getId(),
                goal.getSkill().getName(),
                goal.getTargetDate()
        );
    }

    private CategoryResponse mapToCategoryResponse(SkillCategory c) {
        return new CategoryResponse(
                c.getId(),
                c.getName()
        );
    }

    private AuditLogResponse mapToAuditLogResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getUser().getId(),
                log.getUser().getName(),
                log.getUser().getEmail(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getCreatedAt().toString()
        );
    }

    private SkillResponse mapToSkillResponse(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getLevel().name(),
                skill.getProgress(),
                skill.getStatus().name()
        );
    }

    private AdminUserResponse mapToAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}