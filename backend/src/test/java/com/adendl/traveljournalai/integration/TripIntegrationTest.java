package com.adendl.traveljournalai.integration;

import com.adendl.traveljournalai.model.Trip;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.TripRepository;
import com.adendl.traveljournalai.repository.UserRepository;
import com.adendl.traveljournalai.service.TripService;
import com.adendl.traveljournalai.utils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=true",
    "logging.level.com.adendl.traveljournalai=DEBUG",
    "openai.api.key=test-api-key",
    "jwt.secret=KkhKkw5AOvp4DAMGu2DLEMaXO1z6epEnPgLcY0hzmGk="
})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@Transactional
class TripIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripService tripService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @MockBean
    private RestTemplate restTemplate;

    private User testUser;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        // Clear database before each test
        tripRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        // Create test user
        testUser = TestUtils.createTestUser();
        testUser.setPassword(passwordEncoder.encode(testUser.getPassword()));
        testUser = userRepository.save(testUser);

        // Create JWT token
        jwtToken = TestUtils.createTestJwtToken(testUser.getUsername());

        // Mock OpenAI API response for all tests
        String mockOpenAiResponse = createMockOpenAiResponse();
        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockOpenAiResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenReturn(mockResponseEntity);
    }

    @Test
    void tripService_Integration_Success() {
        // Given
        String fromCity = "Sydney";
        String toCity = "Melbourne";
        boolean roundtrip = true;
        int days = 5;
        List<String> interests = new ArrayList<>(Arrays.asList("Beaches", "Food"));
        double distanceKm = 800.0;

        // When
        Trip result = tripService.createTrip(jwtToken, fromCity, toCity, roundtrip, days, interests, distanceKm);

        // Then
        assertNotNull(result);
        assertEquals(fromCity, result.getFromCity());
        assertEquals(toCity, result.getToCity());
        assertEquals(roundtrip, result.isRoundtrip());
        assertEquals(days, result.getDays());
        assertEquals(interests, result.getInterests());
        assertEquals(distanceKm, result.getDistanceKm());
        assertEquals(testUser.getId(), result.getUser().getId());

        // Verify trip was saved to database
        assertTrue(tripRepository.findById(result.getTripId()).isPresent());

        // Verify OpenAI API was called
        verify(restTemplate).postForEntity(anyString(), any(), eq(String.class));
    }

    @Test
    void tripService_GetTripsByUser_Success() {
        // Given
        Trip testTrip = TestUtils.createTestTrip();
        testTrip.setUser(testUser);
        tripRepository.save(testTrip);

        // When
        List<Trip> result = tripService.getTripsByUser(testUser);

        // Then
        assertNotNull(result);
        assertTrue(result.size() > 0);
        assertTrue(result.stream().anyMatch(trip -> trip.getFromCity().equals("Sydney")));
    }

    @Test
    void tripService_DeleteTrip_Success() {
        // Given
        Trip testTrip = TestUtils.createTestTrip();
        testTrip.setUser(testUser);
        testTrip = tripRepository.save(testTrip);

        // When
        boolean result = tripService.deleteTrip(jwtToken, testTrip.getTripId());

        // Then
        assertTrue(result);
        assertFalse(tripRepository.findById(testTrip.getTripId()).isPresent());
    }

    @Test
    void tripService_DeleteTrip_UnauthorizedUser() {
        // Given
        User differentUser = TestUtils.createTestUser();
        differentUser.setUsername("differentuser");
        differentUser.setEmail("differentuser@test.com");
        differentUser.setPassword(passwordEncoder.encode(differentUser.getPassword()));
        differentUser = userRepository.save(differentUser);

        Trip testTrip = TestUtils.createTestTrip();
        testTrip.setUser(differentUser);
        final Trip savedTrip = tripRepository.save(testTrip);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.deleteTrip(jwtToken, savedTrip.getTripId());
        });

        // Verify trip was not deleted
        assertTrue(tripRepository.findById(savedTrip.getTripId()).isPresent());
    }

    @Test
    void tripService_OpenAiApiFailure() {
        // Given
        String fromCity = "Sydney";
        String toCity = "Melbourne";
        boolean roundtrip = true;
        int days = 5;
        List<String> interests = new ArrayList<>(Arrays.asList("Beaches", "Food"));
        double distanceKm = 800.0;

        // Reset mock to return failure
        reset(restTemplate);
        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            tripService.createTrip(jwtToken, fromCity, toCity, roundtrip, days, interests, distanceKm);
        });

        // Verify OpenAI API was called
        verify(restTemplate).postForEntity(anyString(), any(), eq(String.class));
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