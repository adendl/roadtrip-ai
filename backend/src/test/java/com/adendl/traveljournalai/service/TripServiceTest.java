package com.adendl.traveljournalai.service;

import com.adendl.traveljournalai.config.JwtConfig;
import com.adendl.traveljournalai.model.*;
import com.adendl.traveljournalai.repository.TripPlanRepository;
import com.adendl.traveljournalai.repository.TripRepository;
import com.adendl.traveljournalai.repository.UserRepository;
import com.adendl.traveljournalai.utils.LoggingUtils;
import com.adendl.traveljournalai.utils.TestUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private TripPlanRepository tripPlanRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private JwtConfig jwtConfig;

    @InjectMocks
    private TripService tripService;

    private User testUser;
    private Trip testTrip;
    private TripPlan testTripPlan;

    @BeforeEach
    void setUp() {
        testUser = TestUtils.createTestUser();
        testUser.setId(1L); // Set ID for test user
        testTrip = TestUtils.createTestTrip();
        testTrip.setUser(testUser); // Ensure trip is owned by testUser
        testTripPlan = TestUtils.createTestTripPlan();
        
        // Set private fields using reflection
        ReflectionTestUtils.setField(tripService, "openAiApiKey", "test-api-key");
    }

    @Test
    void createTrip_Success() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        String fromCity = "Sydney";
        String toCity = "Melbourne";
        boolean roundtrip = true;
        int days = 5;
        List<String> interests = Arrays.asList("Beaches", "Food");
        double distanceKm = 800.0;

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> {
            Trip savedTrip = invocation.getArgument(0);
            savedTrip.setTripId(1L); // Set the ID that would be generated
            return savedTrip;
        });
        when(tripPlanRepository.save(any(TripPlan.class))).thenAnswer(invocation -> {
            TripPlan savedPlan = invocation.getArgument(0);
            savedPlan.setId(1L); // Set the ID that would be generated
            return savedPlan;
        });

        // Mock OpenAI API response
        String mockOpenAiResponse = createMockOpenAiResponse();
        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockOpenAiResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        Trip result = tripService.createTrip(jwtToken, fromCity, toCity, roundtrip, days, interests, distanceKm);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getTripId());
        assertEquals(fromCity, result.getFromCity());
        assertEquals(toCity, result.getToCity());
        assertEquals(roundtrip, result.isRoundtrip());
        assertEquals(days, result.getDays());
        assertEquals(interests, result.getInterests());
        assertEquals(distanceKm, result.getDistanceKm());

        verify(tripRepository, times(2)).save(any(Trip.class));
        verify(tripPlanRepository).save(any(TripPlan.class));
        verify(restTemplate).postForEntity(anyString(), any(), eq(String.class));
    }

    @Test
    void createTrip_InvalidJwtToken() {
        // Given
        String invalidToken = "invalid.jwt.token";

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.createTrip(invalidToken, "Sydney", "Melbourne", true, 5, 
                    Arrays.asList("Beaches"), 800.0);
        });

        verify(tripRepository, never()).save(any(Trip.class));
        verify(restTemplate, never()).postForEntity(anyString(), any(), eq(String.class));
    }

    @Test
    void createTrip_UserNotFound() {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.createTrip(jwtToken, "Sydney", "Melbourne", true, 5, 
                    Arrays.asList("Beaches"), 800.0);
        });

        verify(tripRepository, never()).save(any(Trip.class));
        verify(restTemplate, never()).postForEntity(anyString(), any(), eq(String.class));
    }

    @Test
    void createTrip_OpenAiApiFailure() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> {
            Trip savedTrip = invocation.getArgument(0);
            savedTrip.setTripId(1L);
            return savedTrip;
        });

        // Mock OpenAI API failure
        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.createTrip(jwtToken, "Sydney", "Melbourne", true, 5, 
                    Arrays.asList("Beaches"), 800.0);
        });

        verify(restTemplate).postForEntity(anyString(), any(), eq(String.class));
    }

    @Test
    void createTrip_OpenAiApiException() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> {
            Trip savedTrip = invocation.getArgument(0);
            savedTrip.setTripId(1L);
            return savedTrip;
        });

        // Mock OpenAI API exception
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenThrow(new RuntimeException("Network error"));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.createTrip(jwtToken, "Sydney", "Melbourne", true, 5, 
                    Arrays.asList("Beaches"), 800.0);
        });

        verify(restTemplate).postForEntity(anyString(), any(), eq(String.class));
    }

    @Test
    void getTripsByUser_Success() {
        // Given
        List<Trip> expectedTrips = Arrays.asList(testTrip);
        when(tripRepository.findByUser(testUser)).thenReturn(expectedTrips);

        // When
        List<Trip> result = tripService.getTripsByUser(testUser);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testTrip.getTripId(), result.get(0).getTripId());

        verify(tripRepository).findByUser(testUser);
    }

    @Test
    void getTripsByUser_EmptyList() {
        // Given
        when(tripRepository.findByUser(testUser)).thenReturn(Arrays.asList());

        // When
        List<Trip> result = tripService.getTripsByUser(testUser);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(tripRepository).findByUser(testUser);
    }

    @Test
    void deleteTrip_Success() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        Long tripId = 1L;

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(testTrip));

        // When
        boolean result = tripService.deleteTrip(jwtToken, tripId);

        // Then
        assertTrue(result);
        verify(tripRepository).delete(testTrip);
    }

    @Test
    void deleteTrip_TripNotFound() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        Long tripId = 1L;

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripRepository.findById(tripId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.deleteTrip(jwtToken, tripId);
        });

        verify(tripRepository, never()).delete(any(Trip.class));
    }

    @Test
    void deleteTrip_UnauthorizedUser() throws Exception {
        // Given
        String jwtToken = TestUtils.createTestJwtToken(TestUtils.TEST_USERNAME);
        Long tripId = 1L;
        
        // Create a different user for the trip
        User differentUser = TestUtils.createTestUser();
        differentUser.setId(2L);
        differentUser.setUsername("differentuser");
        Trip tripWithDifferentUser = TestUtils.createTestTrip();
        tripWithDifferentUser.setUser(differentUser);

        when(jwtConfig.getSecretKey()).thenReturn(TestUtils.TEST_JWT_SECRET);
        when(userRepository.findByUsername(TestUtils.TEST_USERNAME))
                .thenReturn(Optional.of(testUser));
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(tripWithDifferentUser));

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.deleteTrip(jwtToken, tripId);
        });

        verify(tripRepository, never()).delete(any(Trip.class));
    }

    private String createMockOpenAiResponse() {
        return """
                {
                    "choices": [
                        {
                            "message": {
                                "content": "{\\"days\\": [{\\"day\\": 1, \\"startLocation\\": {\\"name\\": \\"Sydney\\", \\"latitude\\": -33.8688, \\"longitude\\": 151.2093}, \\"finishLocation\\": {\\"name\\": \\"Melbourne\\", \\"latitude\\": -37.8136, \\"longitude\\": 144.9631}, \\"distanceKm\\": 800, \\"introduction\\": \\"Welcome to Melbourne, the cultural capital of Australia. This vibrant city offers a perfect blend of art, music, food, and sports. From the iconic Federation Square to the hidden laneways filled with street art, Melbourne has something for everyone.\\", \\"placesOfInterest\\": [{\\"name\\": \\"Federation Square\\", \\"description\\": \\"A great place to start your Melbourne adventure\\", \\"latitude\\": -37.8136, \\"longitude\\": 144.9631}, {\\"name\\": \\"Royal Botanic Gardens\\", \\"description\\": \\"Beautiful gardens with native and exotic plants\\", \\"latitude\\": -37.8304, \\"longitude\\": 144.9796}]}]}"
                            }
                        }
                    ]
                }
                """;
    }
} 