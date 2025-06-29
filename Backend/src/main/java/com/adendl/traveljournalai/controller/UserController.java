package com.adendl.traveljournalai.controller;

import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserDTO userDTO) throws Exception {
        User user = userService.registerUser(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) throws Exception {
        User user = userService.authenticateUser(loginDTO.getUsername(), loginDTO.getPassword());
        String token = Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                .signWith(SignatureAlgorithm.HS512, "your-secret-key") // Replace with secure key
                .compact();
        return ResponseEntity.ok(token);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findById(Long.valueOf(auth.getName()));
        return ResponseEntity.ok(user);
    }
}

class UserDTO {
    private String username;
    private String email;
    private String password;
    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginDTO {
    private String username;
    private String password;
    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
