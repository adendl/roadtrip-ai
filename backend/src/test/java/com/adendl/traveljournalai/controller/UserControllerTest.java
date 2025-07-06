package com.adendl.traveljournalai.controller;

import com.adendl.traveljournalai.config.JwtConfig;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.service.UserService;
import com.adendl.traveljournalai.utils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtConfig jwtConfig;

    @BeforeEach
    void setUp() {
        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
    }

    @Test
    @WithMockUser(username = "testuser")
    void login_Success() throws Exception {
        // Given
        String username = "testuser";
        String password = "testpassword";
        User testUser = TestUtils.createTestUser();
        
        when(userService.authenticateUser(username, password))
                .thenReturn(testUser);

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtils.createLoginRequestJson(username, password))
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.emptyString())));

        verify(userService).authenticateUser(username, password);
    }

    @Test
    @WithMockUser(username = "testuser")
    void login_InvalidCredentials() throws Exception {
        // Given
        String username = "testuser";
        String password = "wrongpassword";
        
        when(userService.authenticateUser(username, password))
                .thenThrow(new Exception("Invalid credentials"));

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtils.createLoginRequestJson(username, password))
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isInternalServerError());

        verify(userService).authenticateUser(username, password);
    }

    @Test
    @WithMockUser(username = "testuser")
    void login_EmptyUsername() throws Exception {
        // Given
        when(userService.authenticateUser("", "password"))
                .thenThrow(new IllegalArgumentException("User not found"));

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtils.createLoginRequestJson("", "password"))
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void login_EmptyPassword() throws Exception {
        // Given
        when(userService.authenticateUser("username", ""))
                .thenThrow(new IllegalArgumentException("Invalid password"));

        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtils.createLoginRequestJson("username", ""))
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void login_InvalidJson() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json")
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void register_Success() throws Exception {
        // Given
        String username = "newuser";
        String email = "newuser@test.com";
        String password = "newpassword";
        User testUser = TestUtils.createTestUser();
        testUser.setUsername(username);
        testUser.setEmail(email);
        
        when(userService.registerUser(username, email, password))
                .thenReturn(testUser);

        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + username + "\",\"email\":\"" + email + "\",\"password\":\"" + password + "\"}")
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").value(email));

        verify(userService).registerUser(username, email, password);
    }

    @Test
    @WithMockUser(username = "testuser")
    void register_UserAlreadyExists() throws Exception {
        // Given
        String username = "existinguser";
        String email = "existing@test.com";
        String password = "password";
        
        when(userService.registerUser(username, email, password))
                .thenThrow(new Exception("Username already exists"));

        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + username + "\",\"email\":\"" + email + "\",\"password\":\"" + password + "\"}")
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isInternalServerError());

        verify(userService).registerUser(username, email, password);
    }

    @Test
    @WithMockUser(username = "testuser")
    void register_EmptyUsername() throws Exception {
        // Given
        when(userService.registerUser("", "test@test.com", "password"))
                .thenThrow(new IllegalArgumentException("Username cannot be empty"));

        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"\",\"email\":\"test@test.com\",\"password\":\"password\"}")
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void register_EmptyEmail() throws Exception {
        // Given
        when(userService.registerUser("testuser", "", "password"))
                .thenThrow(new IllegalArgumentException("Email cannot be empty"));

        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"email\":\"\",\"password\":\"password\"}")
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void register_EmptyPassword() throws Exception {
        // Given
        when(userService.registerUser("testuser", "test@test.com", ""))
                .thenThrow(new IllegalArgumentException("Password cannot be empty"));

        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"email\":\"test@test.com\",\"password\":\"\"}")
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void register_InvalidJson() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json")
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }
} 