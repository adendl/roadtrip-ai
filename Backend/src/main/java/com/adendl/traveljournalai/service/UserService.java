package com.adendl.traveljournalai.service;

import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String password) throws Exception {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new Exception("Username already exists");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setCreatedAt(Instant.now().toString());
        return userRepository.save(user);
    }

    public User authenticateUser(String username, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }
        return user;
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}