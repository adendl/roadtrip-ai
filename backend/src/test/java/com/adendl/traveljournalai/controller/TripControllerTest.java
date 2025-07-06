package com.adendl.traveljournalai.controller;

import com.adendl.traveljournalai.model.Trip;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.UserRepository;
import com.adendl.traveljournalai.service.TripService;
import com.adendl.traveljournalai.utils.TestUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import com.adendl.traveljournalai.config.JwtConfig;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(TripController.class)
class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TripService tripService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtConfig jwtConfig;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        when(jwtConfig.getSecretKey()).thenReturn("test-secret-key-for-jwt-signing");
    }

    @Test
    void createTrip_Success() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        User testUser = TestUtils.createTestUser();
        Trip testTrip = TestUtils.createTestTrip();
        testTrip.setTripId(1L);
        
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripService.createTrip(anyString(), anyString(), anyString(), anyBoolean(), 
                anyInt(), anyList(), anyDouble()))
                .thenReturn(testTrip);

        // When & Then
        mockMvc.perform(post("/api/trips/create")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtils.createTripRequestJson("Sydney", "Melbourne", true, 5, 
                        Arrays.asList("Beaches", "Food")))
                .with(csrf())
                .with(user("testuser")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tripId").value(testTrip.getTripId()))
                .andExpect(jsonPath("$.fromCity").value("Sydney"))
                .andExpect(jsonPath("$.toCity").value("Melbourne"));

        verify(tripService).createTrip(eq(jwtToken), eq("Sydney"), eq("Melbourne"), 
                eq(true), eq(5), anyList(), eq(500.0));
    }

    @Test
    void createTrip_InvalidJwtToken() throws Exception {
        // Given
        String invalidToken = "invalid.jwt.token";

        // When & Then
        mockMvc.perform(post("/api/trips/create")
                .header("Authorization", "Bearer " + invalidToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtils.createTripRequestJson("Sydney", "Melbourne", true, 5, 
                        Arrays.asList("Beaches", "Food")))
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(tripService, never()).createTrip(anyString(), anyString(), anyString(), 
                anyBoolean(), anyInt(), anyList(), anyDouble());
    }

    @Test
    void createTrip_ServiceException() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        User testUser = TestUtils.createTestUser();
        
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripService.createTrip(anyString(), anyString(), anyString(), anyBoolean(), 
                anyInt(), anyList(), anyDouble()))
                .thenThrow(new RuntimeException("Service error"));

        // When & Then
        mockMvc.perform(post("/api/trips/create")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(TestUtils.createTripRequestJson("Sydney", "Melbourne", true, 5, 
                        Arrays.asList("Beaches", "Food")))
                .with(csrf())
                .with(user("testuser")))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "testuser")
    void getUserTrips_Success() throws Exception {
        // Given
        User testUser = TestUtils.createTestUser();
        List<Trip> testTrips = Arrays.asList(TestUtils.createTestTrip());
        
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripService.getTripsByUser(testUser))
                .thenReturn(testTrips);

        // When & Then
        mockMvc.perform(get("/api/trips/user")
                .with(user("testuser")))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser")
    void getUserTrips_UserNotFound() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/trips/user")
                .with(user("testuser")))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void getUserTrips_NoAuthentication() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/trips/user"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void deleteTrip_Success() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        Long tripId = 1L;
        
        when(tripService.deleteTrip(jwtToken, tripId))
                .thenReturn(true);

        // When & Then
        mockMvc.perform(delete("/api/trips/" + tripId)
                .header("Authorization", "Bearer " + jwtToken)
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isOk());

        verify(tripService).deleteTrip(jwtToken, tripId);
    }

    @Test
    @WithMockUser(username = "testuser")
    void deleteTrip_ServiceReturnsFalse() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        Long tripId = 1L;
        
        when(tripService.deleteTrip(jwtToken, tripId))
                .thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/trips/" + tripId)
                .header("Authorization", "Bearer " + jwtToken)
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "testuser")
    void deleteTrip_ServiceException() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        Long tripId = 1L;
        
        when(tripService.deleteTrip(jwtToken, tripId))
                .thenThrow(new RuntimeException("Delete failed"));

        // When & Then
        mockMvc.perform(delete("/api/trips/" + tripId)
                .header("Authorization", "Bearer " + jwtToken)
                .with(user("testuser"))
                .with(csrf()))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void deleteTrip_InvalidJwtToken() throws Exception {
        // Given
        String invalidToken = "invalid.jwt.token";
        Long tripId = 1L;

        // When & Then
        mockMvc.perform(delete("/api/trips/" + tripId)
                .header("Authorization", "Bearer " + invalidToken)
                .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(tripService, never()).deleteTrip(anyString(), anyLong());
    }
} 