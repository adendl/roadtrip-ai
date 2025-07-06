package com.adendl.traveljournalai.service;

import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.UserRepository;
import com.adendl.traveljournalai.utils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = TestUtils.createTestUser();
    }

    @Test
    void registerUser_Success() throws Exception {
        // Given
        String username = "newuser";
        String email = "newuser@test.com";
        String password = "newpassword";
        String encodedPassword = "encodedPassword";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(password)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.registerUser(username, email, password);

        // Then
        assertNotNull(result);
        assertEquals(testUser.getUsername(), result.getUsername());

        verify(userRepository).findByUsername(username);
        verify(userRepository).findByEmail(email);
        verify(passwordEncoder).encode(password);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_UsernameAlreadyExists() {
        // Given
        String username = "existinguser";
        String email = "newuser@test.com";
        String password = "newpassword";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // When & Then
        Exception exception = assertThrows(Exception.class, () -> {
            userService.registerUser(username, email, password);
        });

        assertEquals("Username already exists", exception.getMessage());

        verify(userRepository).findByUsername(username);
        verify(userRepository, never()).findByEmail(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_EmailAlreadyExists() {
        // Given
        String username = "newuser";
        String email = "existing@test.com";
        String password = "newpassword";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // When & Then
        Exception exception = assertThrows(Exception.class, () -> {
            userService.registerUser(username, email, password);
        });

        assertEquals("Email already exists", exception.getMessage());

        verify(userRepository).findByUsername(username);
        verify(userRepository).findByEmail(email);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void authenticateUser_Success() throws Exception {
        // Given
        String username = "testuser";
        String password = "testpassword";
        String encodedPassword = "encodedPassword";

        testUser.setPassword(encodedPassword);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(password, encodedPassword)).thenReturn(true);

        // When
        User result = userService.authenticateUser(username, password);

        // Then
        assertNotNull(result);
        assertEquals(username, result.getUsername());

        verify(userRepository).findByUsername(username);
        verify(passwordEncoder).matches(password, encodedPassword);
    }

    @Test
    void authenticateUser_UserNotFound() {
        // Given
        String username = "nonexistentuser";
        String password = "testpassword";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(Exception.class, () -> {
            userService.authenticateUser(username, password);
        });

        assertEquals("User not found", exception.getMessage());

        verify(userRepository).findByUsername(username);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void authenticateUser_InvalidPassword() {
        // Given
        String username = "testuser";
        String password = "wrongpassword";
        String encodedPassword = "encodedPassword";

        testUser.setPassword(encodedPassword);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(password, encodedPassword)).thenReturn(false);

        // When & Then
        Exception exception = assertThrows(Exception.class, () -> {
            userService.authenticateUser(username, password);
        });

        assertEquals("Invalid password", exception.getMessage());

        verify(userRepository).findByUsername(username);
        verify(passwordEncoder).matches(password, encodedPassword);
    }

    @Test
    void findById_Success() {
        // Given
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // When
        User result = userService.findById(userId);

        // Then
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());

        verify(userRepository).findById(userId);
    }

    @Test
    void findById_UserNotFound() {
        // Given
        Long userId = 999L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.findById(userId);
        });

        assertEquals("User not found", exception.getMessage());

        verify(userRepository).findById(userId);
    }

    @Test
    void findByUsername_Success() {
        // Given
        String username = "testuser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // When
        User result = userService.findByUsername(username);

        // Then
        assertNotNull(result);
        assertEquals(username, result.getUsername());

        verify(userRepository).findByUsername(username);
    }

    @Test
    void findByUsername_UserNotFound() {
        // Given
        String username = "nonexistentuser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.findByUsername(username);
        });

        assertEquals("User not found", exception.getMessage());

        verify(userRepository).findByUsername(username);
    }
} 