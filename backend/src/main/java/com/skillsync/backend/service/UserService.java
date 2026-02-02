package com.skillsync.backend.service;
import com.skillsync.backend.dto.RegisterRequest;
import com.skillsync.backend.dto.UserResponse;
import com.skillsync.backend.model.User;
import com.skillsync.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.skillsync.backend.exception.EmailAlreadyExistsException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse registerUser(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser=userRepository.save(user);
        return new UserResponse(savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail());
    }
}
