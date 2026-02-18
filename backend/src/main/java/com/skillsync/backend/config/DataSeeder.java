package com.skillsync.backend.config;

import com.skillsync.backend.model.*;
import com.skillsync.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            SkillRepository skillRepository,
            LearningSessionRepository sessionRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() == 0) {
                // Create user
                User user = new User();
                user.setName("Test User");
                user.setEmail("user@example.com");
                user.setPassword(passwordEncoder.encode("password"));
                user.setRole(Role.USER);
                userRepository.save(user);

                // Create Skills
                Skill tempSkill = new Skill();
                tempSkill.setName("Java Programming");
                tempSkill.setUser(user);
                tempSkill.setStatus(SkillStatus.ACTIVE);
                tempSkill.setLevel(SkillLevel.INTERMEDIATE);
                tempSkill.setProgress(45);
                Skill javaSkill = skillRepository.save(tempSkill);

                Skill tempSkill2 = new Skill();
                tempSkill2.setName("React Development");
                tempSkill2.setUser(user);
                tempSkill2.setStatus(SkillStatus.ACTIVE);
                tempSkill2.setLevel(SkillLevel.BEGINNER);
                tempSkill2.setProgress(20);
                Skill reactSkill = skillRepository.save(tempSkill2);

                // Create Sessions
                LearningSession session1 = new LearningSession();
                session1.setSkill(javaSkill);
                session1.setDurationMinutes(60);
                session1.setNotes("Learned about streams");
                session1.setSessionDate(java.time.LocalDate.now().minusDays(1));
                sessionRepository.save(session1);

                LearningSession session2 = new LearningSession();
                session2.setSkill(javaSkill);
                session2.setDurationMinutes(45);
                session2.setNotes("Practice coding");
                session2.setSessionDate(java.time.LocalDate.now().minusDays(2));
                sessionRepository.save(session2);

                LearningSession session3 = new LearningSession();
                session3.setSkill(reactSkill);
                session3.setDurationMinutes(120);
                session3.setNotes("Built a todo app");
                session3.setSessionDate(java.time.LocalDate.now());
                sessionRepository.save(session3);

                System.out.println("✅ Data seeded successfully!");
            }
        };
    }
}
