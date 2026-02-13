package com.skillsync.backend.service;

import com.skillsync.backend.dto.*;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;
import com.skillsync.backend.security.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.skillsync.backend.exception.EmailAlreadyExistsException;
import com.skillsync.backend.exception.InvalidCredentialsException;
import com.skillsync.backend.model.Role;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.skillsync.backend.model.Skill;
import com.skillsync.backend.model.SkillStatus;
import com.skillsync.backend.repository.SkillRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SkillRepository skillRepository;

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            SkillRepository skillRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.skillRepository = skillRepository;
    }

    public UserResponse registerUser(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser=userRepository.save(user);
        return new UserResponse(savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public LoginResponse authenticate(LoginRequest request){
        User user=userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new InvalidCredentialsException("Invalid Email or Password"));

        boolean passwordMatches= passwordEncoder.matches(request.getPassword(),user.getPassword());
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        if(!passwordMatches){
            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    public UserProfileResponse getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public UserProfileResponse updateMyProfile(UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = new Skill();
        skill.setName(request.getName());
        skill.setLevel(request.getLevel());
        skill.setProgress(0);
        skill.setStatus(SkillStatus.ACTIVE);
        skill.setUser(user);

        Skill savedSkill = skillRepository.save(skill);

        return new SkillResponse(
                savedSkill.getId(),
                savedSkill.getName(),
                savedSkill.getLevel().name(),
                savedSkill.getProgress(),
                savedSkill.getStatus().name()
        );
    }

    public List<SkillResponse> getMySkills() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Skill> skills = skillRepository.findAllByUser(user);

        return skills.stream()
                .map(skill -> new SkillResponse(
                        skill.getId(),
                        skill.getName(),
                        skill.getLevel().name(),
                        skill.getProgress(),
                        skill.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    public SkillResponse updateSkillProgress(
            Long skillId,
            UpdateSkillProgressRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        skill.setProgress(request.getProgress());

        if (request.getProgress() == 100) {
            skill.setStatus(SkillStatus.COMPLETED);
        } else {
            skill.setStatus(SkillStatus.ACTIVE);
        }

        Skill updatedSkill = skillRepository.save(skill);

        return new SkillResponse(
                updatedSkill.getId(),
                updatedSkill.getName(),
                updatedSkill.getLevel().name(),
                updatedSkill.getProgress(),
                updatedSkill.getStatus().name()
        );
    }

    public void deleteSkill(Long skillId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository
                .findByIdAndUser(skillId, user)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        skillRepository.delete(skill);
    }

    public List<AdminUserResponse> getAllUsersForAdmin() {

        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ))
                .collect(Collectors.toList());
    }

    public List<SkillResponse> getSkillsOfUserForAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Skill> skills = skillRepository.findAllByUser(user);

        return skills.stream()
                .map(skill -> new SkillResponse(
                        skill.getId(),
                        skill.getName(),
                        skill.getLevel().name(),
                        skill.getProgress(),
                        skill.getStatus().name()
                ))
                .toList();
    }
}