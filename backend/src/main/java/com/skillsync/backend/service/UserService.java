package com.skillsync.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.skillsync.backend.dto.AddSkillRequest;
import com.skillsync.backend.dto.AdminUserResponse;
import com.skillsync.backend.dto.CategoryResponse;
import com.skillsync.backend.dto.CreateCategoryRequest;
import com.skillsync.backend.dto.CreateUserRequest;
import com.skillsync.backend.dto.LoginRequest;
import com.skillsync.backend.dto.LoginResponse;
import com.skillsync.backend.dto.NotificationPreferencesDTO;
import com.skillsync.backend.dto.PlatformStatsResponse;
import com.skillsync.backend.dto.RegisterRequest;
import com.skillsync.backend.dto.SkillResponse;
import com.skillsync.backend.dto.UpdateProfileRequest;
import com.skillsync.backend.dto.UpdateSkillProgressRequest;
import com.skillsync.backend.dto.UpdateSkillRequest;
import com.skillsync.backend.dto.UserProfileResponse;
import com.skillsync.backend.dto.UserResponse;
import com.skillsync.backend.dto.audit.AuditLogResponse;
import com.skillsync.backend.dto.goal.CreateGoalRequest;
import com.skillsync.backend.dto.goal.GoalAnalyticsResponse;
import com.skillsync.backend.dto.goal.GoalResponse;
import com.skillsync.backend.dto.goal.UpdateGoalRequest;
import com.skillsync.backend.dto.recommendation.RecommendationHistoryResponse;
import com.skillsync.backend.dto.recommendation.SkillRecommendationResponse;
import com.skillsync.backend.dto.recommendation.UserRecommendationResponse;
import com.skillsync.backend.dto.session.AddSessionRequest;
import com.skillsync.backend.dto.session.SessionResponse;
import com.skillsync.backend.dto.session.SessionStatsResponse;
import com.skillsync.backend.dto.stats.AchievementResponse;
import com.skillsync.backend.dto.stats.AdminStatsResponse;
import com.skillsync.backend.dto.stats.BurnoutRiskResponse;
import com.skillsync.backend.dto.stats.CategoryAnalyticsResponse;
import com.skillsync.backend.dto.stats.CompletionProbabilityResponse;
import com.skillsync.backend.dto.stats.DailyActivityResponse;
import com.skillsync.backend.dto.stats.DomainFocusResponse;
import com.skillsync.backend.dto.stats.SkillDifficultyResponse;
import com.skillsync.backend.dto.stats.SkillEtaResponse;
import com.skillsync.backend.dto.stats.SkillVelocityResponse;
import com.skillsync.backend.dto.stats.TimeWindowStatsResponse;
import com.skillsync.backend.dto.stats.UserAchievementsResponse;
import com.skillsync.backend.dto.stats.UserLearningStatsResponse;
import com.skillsync.backend.dto.stats.UserStatsResponse;
import com.skillsync.backend.dto.stats.UserStreakResponse;
import com.skillsync.backend.exception.EmailAlreadyExistsException;
import com.skillsync.backend.exception.InvalidCredentialsException;
import com.skillsync.backend.exception.skill.SkillNotFoundException;
import com.skillsync.backend.exception.user.UserNotFoundException;
import com.skillsync.backend.model.AuditLog;
import com.skillsync.backend.model.LearningGoal;
import com.skillsync.backend.model.LearningSession;
import com.skillsync.backend.model.Notification;
import com.skillsync.backend.model.RecommendationHistory;
import com.skillsync.backend.model.Role;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.SkillCategory;
import com.skillsync.backend.model.SkillLevel;
import com.skillsync.backend.model.SkillStatus;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.AuditLogRepository;
import com.skillsync.backend.repository.LearningGoalRepository;
import com.skillsync.backend.repository.LearningSessionRepository;
import com.skillsync.backend.repository.NotificationRepository;
import com.skillsync.backend.repository.RecommendationHistoryRepository;
import com.skillsync.backend.repository.SkillCategoryRepository;
import com.skillsync.backend.repository.SkillRepository;
import com.skillsync.backend.repository.UserRepository;
import com.skillsync.backend.security.JwtUtil;

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
    private final NotificationRepository notificationRepository;

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
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository
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
        this.notificationRepository = notificationRepository;
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

        // Set createdAt to current time if it's null (for existing users)
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getAbout(),
                user.getCreatedAt()
        );
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        user.setName(request.getName());
        
        // Handle about field - set to null if empty or whitespace only
        if (request.getAbout() != null && !request.getAbout().trim().isEmpty()) {
            user.setAbout(request.getAbout().trim());
        } else {
            user.setAbout(null);
        }

        User updatedUser = userRepository.save(user);

        return new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole().name(),
                updatedUser.getAbout(),
                updatedUser.getCreatedAt()
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

        // Check if this is the 5th skill to unlock achievement
        long totalSkills = skillRepository.countByUser(user);
        if (totalSkills == 5) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.ACHIEVEMENT_NOTIFICATIONS,
                    "🏆 Achievement Unlocked! Skill Collector - You've added 5 skills to your learning path!"
            );
        }

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

        // Send notification if skill was just completed
        if (request.getProgress() == 100) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.SKILL_COMPLETIONS,
                    "Congratulations! You've successfully completed the skill \"" + skill.getName() + "\". Great achievement!"
            );
            
            // Check if this is the first completed skill  
            long completedCount = skillRepository.countByUserAndStatus(user, SkillStatus.COMPLETED);
            if (completedCount == 1) {
                notificationService.createNotificationIfPreferenceEnabled(
                        user,
                        NotificationService.NotificationType.ACHIEVEMENT_NOTIFICATIONS,
                        "🏆 Achievement Unlocked! Completion Master - You've successfully completed your first skill!"
                );
            }
            
            // Check for category milestone
            checkAndNotifyForCategoryMilestone(user, skill);
        }

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

    public SkillResponse updateSkill(Long skillId, UpdateSkillRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        skill.setName(request.getName());

        Skill updatedSkill = skillRepository.save(skill);

        auditService.log(
                user,
                "UPDATE",
                "SKILL",
                skill.getId()
        );

        return mapSkill(updatedSkill);
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

        return userPage.map(user -> {
            long skillCount = skillRepository.countByUser(user);
            long sessionCount = learningSessionRepository.countBySkill_User(user);
            
            return new AdminUserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().name() : "USER",
                    (int) skillCount,
                    (int) sessionCount,
                    user.getCreatedAt()
            );
        });
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
        // Calculate total minutes from all sessions
        int totalMinutes = skill.getSessions() != null 
            ? skill.getSessions().stream()
                .mapToInt(session -> session.getDurationMinutes())
                .sum()
            : 0;

        String categoryName = skill.getCategory() != null ? skill.getCategory().getName() : null;

        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getLevel().name(),
                skill.getProgress(),
                skill.getStatus().name(),
                totalMinutes,
                categoryName
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

        // Send notification for session logged
        notificationService.createNotificationIfPreferenceEnabled(
                user,
                NotificationService.NotificationType.SESSION_REMINDERS,
                "Great job! You've logged a learning session of " + request.getDurationMinutes() + " minutes for " + skill.getName() + "."
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

    public SessionResponse updateSession(
            Long skillId,
            Long sessionId,
            AddSessionRequest request
    ) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        LearningSession session = learningSessionRepository
                .findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Verify session belongs to the skill
        if (!session.getSkill().getId().equals(skillId)) {
            throw new RuntimeException("Session does not belong to this skill");
        }

        session.setDurationMinutes(request.getDurationMinutes());
        session.setSessionDate(request.getSessionDate());
        session.setNotes(request.getNotes());

        LearningSession updated = learningSessionRepository.save(session);

        auditService.log(
                user,
                "UPDATE",
                "SESSION",
                session.getId()
        );

        return new SessionResponse(
                updated.getId(),
                updated.getDurationMinutes(),
                updated.getSessionDate(),
                updated.getNotes()
        );
    }

    public void deleteSession(Long skillId, Long sessionId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new SkillNotFoundException(skillId));

        LearningSession session = learningSessionRepository
                .findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Verify session belongs to the skill
        if (!session.getSkill().getId().equals(skillId)) {
            throw new RuntimeException("Session does not belong to this skill");
        }

        learningSessionRepository.delete(session);

        auditService.log(
                user,
                "DELETE",
                "SESSION",
                sessionId
        );
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

        // Check for achievement unlocks
        if (streak == 7) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.ACHIEVEMENT_NOTIFICATIONS,
                    "🏆 Achievement Unlocked! Fire Starter - You've maintained a 7-day learning streak!"
            );
        } else if (streak == 30) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.ACHIEVEMENT_NOTIFICATIONS,
                    "🏆 Achievement Unlocked! Unstoppable - You've maintained an impressive 30-day learning streak!"
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

    public CategoryResponse updateCategory(Long categoryId, CreateCategoryRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        SkillCategory category = skillCategoryRepository
                .findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.getName());

        SkillCategory updated = skillCategoryRepository.save(category);

        return mapToCategoryResponse(updated);
    }

    public void deleteCategory(Long categoryId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        SkillCategory category = skillCategoryRepository
                .findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Remove category reference from all skills in this category
        List<Skill> skillsInCategory = skillRepository.findAllByCategory(category);
        for (Skill skill : skillsInCategory) {
            skill.setCategory(null);
        }
        skillRepository.saveAll(skillsInCategory);

        // Now delete the category
        skillCategoryRepository.delete(category);
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

    public GoalResponse updateGoal(Long goalId, UpdateGoalRequest request) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        LearningGoal goal = learningGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Verify the goal belongs to the current user
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this goal");
        }

        goal.setTargetDate(request.getTargetDate());

        LearningGoal updated = learningGoalRepository.save(goal);

        auditService.log(
                user,
                "UPDATE",
                "GOAL",
                goal.getId()
        );

        return mapToGoalResponse(updated);
    }

    public void deleteGoal(Long goalId) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(null));

        LearningGoal goal = learningGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Verify the goal belongs to the current user
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this goal");
        }

        learningGoalRepository.deleteById(goalId);

        auditService.log(
                user,
                "DELETE",
                "GOAL",
                goalId
        );
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

    private void checkAndNotifyForCategoryMilestone(User user, Skill completedSkill) {
        if (completedSkill.getCategory() == null) return;
        
        // Count completed skills in this category
        int completedInCategory = (int) skillRepository.findAllByUser(user).stream()
                .filter(s -> s.getCategory() != null && 
                           s.getCategory().getId().equals(completedSkill.getCategory().getId()) &&
                           s.getStatus() == SkillStatus.COMPLETED)
                .count();
        
        // Send milestone notification at 5, 10, 15 skills
        if (completedInCategory == 5 || completedInCategory == 10 || completedInCategory == 15) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.CATEGORY_MILESTONES,
                    "🎯 Milestone achieved! You've completed " + completedInCategory + " skills in the \"" + 
                    completedSkill.getCategory().getName() + "\" category!"
            );
        }
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
        // High risk if working significantly more than average (ratio > 2.0)
        // Medium risk if working moderately more than average (ratio > 1.25)
        // Low risk otherwise
        if (ratio > 2.0) {
            risk = "HIGH";
        } else if (ratio > 1.25) {
            risk = "MEDIUM";
        } else {
            risk = "LOW";
        }

        if ("HIGH".equals(risk)) {
            notificationService.createNotificationIfPreferenceEnabled(
                    user,
                    NotificationService.NotificationType.BURNOUT_WARNINGS,
                    "Your learning pace is intense this week. You're working significantly more than your average. Consider taking a break to avoid burnout."
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
        // Calculate total minutes from all sessions
        int totalMinutes = skill.getSessions() != null 
            ? skill.getSessions().stream()
                .mapToInt(session -> session.getDurationMinutes())
                .sum()
            : 0;

        String categoryName = skill.getCategory() != null ? skill.getCategory().getName() : null;

        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getLevel().name(),
                skill.getProgress(),
                skill.getStatus().name(),
                totalMinutes,
                categoryName
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
        SkillCategory category = skillCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Remove category reference from all skills in this category
        List<Skill> skillsInCategory = skillRepository.findAllByCategory(category);
        for (Skill skill : skillsInCategory) {
            skill.setCategory(null);
        }
        skillRepository.saveAll(skillsInCategory);

        // Now delete the category
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

    public UserAchievementsResponse getUserAchievements() {
        User user = getCurrentUser();
        UserStatsResponse stats = getMyStats();
        UserLearningStatsResponse learningStats = getMyLearningStats();
        UserStreakResponse streak = getMyStreak();
        
        // Debug logging
        System.out.println("=== Achievement Calculation Debug ===");
        System.out.println("Streak: " + streak.getCurrentStreak());
        System.out.println("Total Skills: " + stats.getTotalSkills());
        System.out.println("Completed Skills: " + stats.getCompletedSkills());
        System.out.println("Total Minutes: " + learningStats.getTotalMinutes());
        System.out.println("===================================");
        
        List<AchievementResponse> achievements = new java.util.ArrayList<>();
        int unlockedCount = 0;
        
        // Fire Starter - 7-day streak
        AchievementResponse fireStarter = new AchievementResponse(
                "fire-starter",
                "Fire Starter",
                "Maintained a learning streak for 7 consecutive days",
                "Flame",
                "from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10",
                "border-yellow-200 dark:border-yellow-500/20",
                streak.getCurrentStreak() >= 7,
                "7-day streak",
                streak.getCurrentStreak() + "/7 days"
        );
        achievements.add(fireStarter);
        if (fireStarter.getUnlocked()) unlockedCount++;
        
        // Skill Collector - 5 skills
        AchievementResponse skillCollector = new AchievementResponse(
                "skill-collector",
                "Skill Collector",
                "Added 5 or more skills to your learning path",
                "Lightbulb",
                "from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10",
                "border-indigo-200 dark:border-indigo-500/20",
                stats.getTotalSkills() >= 5,
                "5 skills tracked",
                stats.getTotalSkills() + "/5 skills"
        );
        achievements.add(skillCollector);
        if (skillCollector.getUnlocked()) unlockedCount++;
        
        // Century Club - 100+ hours
        long totalHours = learningStats.getTotalMinutes() / 60;
        AchievementResponse centuryClub = new AchievementResponse(
                "century-club",
                "Century Club",
                "Logged over 100 hours of learning time",
                "Clock",
                "from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10",
                "border-green-200 dark:border-green-500/20",
                totalHours >= 100,
                "100+ hours",
                totalHours + "/100 hours"
        );
        achievements.add(centuryClub);
        if (centuryClub.getUnlocked()) unlockedCount++;
        
        // Goal Getter - Create first goal
        List<LearningGoal> goals = learningGoalRepository.findByUser(user);
        AchievementResponse goalGetter = new AchievementResponse(
                "goal-getter",
                "Goal Getter",
                "Created your first learning goal",
                "Target",
                "from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10",
                "border-purple-200 dark:border-purple-500/20",
                !goals.isEmpty(),
                "First goal",
                (goals.isEmpty() ? "0" : "1") + "/1 goal"
        );
        achievements.add(goalGetter);
        if (goalGetter.getUnlocked()) unlockedCount++;
        
        // Completion Master - Complete first skill
        AchievementResponse completionMaster = new AchievementResponse(
                "completion-master",
                "Completion Master",
                "Successfully completed your first skill",
                "Award",
                "from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10",
                "border-blue-200 dark:border-blue-500/20",
                stats.getCompletedSkills() >= 1,
                "Skill completed",
                stats.getCompletedSkills() + "/1 completed"
        );
        achievements.add(completionMaster);
        if (completionMaster.getUnlocked()) unlockedCount++;
        
        // Unstoppable - 30-day streak
        AchievementResponse unstoppable = new AchievementResponse(
                "unstoppable",
                "Unstoppable",
                "Maintain a 30-day learning streak",
                "Flame",
                "from-red-50 to-pink-50 dark:from-red-500/10 dark:to-pink-500/10",
                "border-red-200 dark:border-red-500/20",
                streak.getCurrentStreak() >= 30,
                "30-day streak",
                streak.getCurrentStreak() + "/30 days"
        );
        achievements.add(unstoppable);
        if (unstoppable.getUnlocked()) unlockedCount++;
        
        return new UserAchievementsResponse(
                unlockedCount,
                achievements.size(),
                achievements
        );
    }

    public void deleteMyAccount() {
        User user = getCurrentUser();
        
        // Audit log the deletion
        auditService.log(
                user,
                "DELETE_ACCOUNT",
                "USER",
                user.getId()
        );
        
        // Delete user (cascade should handle related entities)
        userRepository.deleteById(user.getId());
    }

    public void changePassword(String oldPassword, String newPassword) {
        User user = getCurrentUser();
        
        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Encode and set new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Audit log the password change
        auditService.log(
                user,
                "CHANGE_PASSWORD",
                "USER",
                user.getId()
        );
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
        // Calculate total minutes from all sessions
        int totalMinutes = skill.getSessions() != null 
            ? skill.getSessions().stream()
                .mapToInt(session -> session.getDurationMinutes())
                .sum()
            : 0;

        String categoryName = skill.getCategory() != null ? skill.getCategory().getName() : null;

        return new SkillResponse(
                skill.getId(),
                skill.getName(),
                skill.getLevel().name(),
                skill.getProgress(),
                skill.getStatus().name(),
                totalMinutes,
                categoryName
        );
    }

    private AdminUserResponse mapToAdminUserResponse(User user) {
        long skillCount = skillRepository.countByUser(user);
        long sessionCount = learningSessionRepository.countBySkill_User(user);
        
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().name() : "USER",
                (int) skillCount,
                (int) sessionCount,
                user.getCreatedAt()
        );
    }

    public void toggleAccountStatus(Long userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    public void resetUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(newPassword));
        user.setLastPasswordChangeAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public List<UserResponse> getInactiveUsers(int days) {
        LocalDate cutoffDate = LocalDate.now().minusDays(days);
        return userRepository.findAll().stream()
                .filter(user -> {
                    List<LearningSession> userSessions = learningSessionRepository.findAll().stream()
                            .filter(s -> s.getSkill().getUser().equals(user))
                            .collect(Collectors.toList());
                    return userSessions.isEmpty() || userSessions.stream()
                            .allMatch(session -> session.getSessionDate().isBefore(cutoffDate));
                })
                .map(user -> new UserResponse(user.getId(), user.getName(), user.getEmail()))
                .collect(Collectors.toList());
    }

    public Map<String, Object> getUserActivityReport(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<LearningGoal> goals = learningGoalRepository.findByUser(user);
        long skillCount = skillRepository.countByUser(user);
        long sessionCount = learningSessionRepository.countBySkill_User(user);

        Map<String, Object> report = new HashMap<>();
        report.put("userId", user.getId());
        report.put("userName", user.getName());
        report.put("email", user.getEmail());
        report.put("totalSkills", skillCount);
        report.put("totalSessions", sessionCount);
        report.put("totalGoals", goals.size());
        report.put("createdAt", user.getCreatedAt());
        report.put("lastPasswordChange", user.getLastPasswordChangeAt());
        report.put("isActive", user.getIsActive());

        return report;
    }

    private UserResponse mapUserToResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }

    public void broadcastNotification(String title, String message, List<Long> userIds) {
        List<User> users;
        if (userIds == null || userIds.isEmpty()) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findAllById(userIds);
        }

        for (User user : users) {
            Notification notification = new Notification(title, message, user);
            notificationRepository.save(notification);
        }
    }

    public List<AdminUserResponse> searchUsersByEmail(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email).stream()
                .map(user -> {
                    long skillCount = skillRepository.countByUser(user);
                    long sessionCount = learningSessionRepository.countBySkill_User(user);
                    return new AdminUserResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole() != null ? user.getRole().name() : "USER",
                            (int) skillCount,
                            (int) sessionCount,
                            user.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }
}