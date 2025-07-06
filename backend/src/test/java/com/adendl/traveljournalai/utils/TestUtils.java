package com.adendl.traveljournalai.utils;

import com.adendl.traveljournalai.model.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 * Utility class for test data and helper methods
 */
public class TestUtils {

    public static final String TEST_JWT_SECRET = "KkhKkw5AOvp4DAMGu2DLEMaXO1z6epEnPgLcY0hzmGk=";
    public static final String TEST_USERNAME = "testuser";
    public static final String TEST_PASSWORD = "testpassword";

    /**
     * Create a test JWT token
     */
    public static String createTestJwtToken(String username) {
        SecretKey key = Keys.hmacShaKeyFor(TEST_JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject(username)
                .issuedAt(java.util.Date.from(Instant.now()))
                .expiration(java.util.Date.from(Instant.now().plusSeconds(3600)))
                .signWith(key)
                .compact();
    }

    /**
     * Create a test User
     */
    public static User createTestUser() {
        User user = new User();
        user.setUsername(TEST_USERNAME);
        user.setEmail("testuser@test.com");
        user.setPassword(TEST_PASSWORD);
        user.setCreatedAt("2025-01-01T00:00:00Z");
        return user;
    }

    /**
     * Create a test Trip
     */
    public static Trip createTestTrip() {
        Trip trip = new Trip();
        trip.setFromCity("Sydney");
        trip.setToCity("Melbourne");
        trip.setRoundtrip(true);
        trip.setDays(5);
        trip.setInterests(new ArrayList<>(Arrays.asList("Beaches", "Food", "Culture")));
        trip.setDistanceKm(800.0);
        trip.setCreatedAt(Instant.now().toString());
        return trip;
    }

    /**
     * Create a test Location
     */
    public static Location createTestLocation(String name, double lat, double lng) {
        Location location = new Location();
        location.setName(name);
        location.setLatitude(lat);
        location.setLongitude(lng);
        return location;
    }

    /**
     * Create a test PlaceOfInterest
     */
    public static PlaceOfInterest createTestPlaceOfInterest(String name, String description, double lat, double lng) {
        PlaceOfInterest poi = new PlaceOfInterest();
        poi.setName(name);
        poi.setDescription(description);
        poi.setLatitude(lat);
        poi.setLongitude(lng);
        return poi;
    }

    /**
     * Create a test DayPlan
     */
    public static DayPlan createTestDayPlan(int dayNumber) {
        DayPlan dayPlan = new DayPlan();
        dayPlan.setDayNumber(dayNumber);
        dayPlan.setStartLocation(createTestLocation("Start City", -33.8688, 151.2093));
        dayPlan.setFinishLocation(createTestLocation("End City", -37.8136, 144.9631));
        dayPlan.setDistanceKm(150.0);
        dayPlan.setIntroduction("This is a test introduction for day " + dayNumber);
        dayPlan.setPlacesOfInterest(new ArrayList<>(Arrays.asList(
                createTestPlaceOfInterest("Test Place 1", "Description 1", -33.8688, 151.2093),
                createTestPlaceOfInterest("Test Place 2", "Description 2", -37.8136, 144.9631)
        )));
        return dayPlan;
    }

    /**
     * Create a test TripPlan
     */
    public static TripPlan createTestTripPlan() {
        TripPlan tripPlan = new TripPlan();
        tripPlan.setDays(new ArrayList<>(Arrays.asList(
                createTestDayPlan(1),
                createTestDayPlan(2)
        )));
        return tripPlan;
    }

    /**
     * Helper method to add JWT token to request
     */
    public static MockHttpServletRequestBuilder addJwtToken(MockHttpServletRequestBuilder request, String username) {
        return request.header("Authorization", "Bearer " + createTestJwtToken(username));
    }

    /**
     * Helper method to create JSON request with JWT token
     */
    public static ResultActions performAuthenticatedRequest(MockMvc mockMvc, MockHttpServletRequestBuilder request, String username) throws Exception {
        return mockMvc.perform(addJwtToken(request, username)
                .contentType(MediaType.APPLICATION_JSON));
    }

    /**
     * Create a JSON string for trip creation request
     */
    public static String createTripRequestJson(String fromCity, String toCity, boolean roundtrip, int days, List<String> interests) {
        ObjectMapper mapper = new ObjectMapper();
        String interestsJson;
        try {
            interestsJson = mapper.writeValueAsString(interests);
        } catch (JsonProcessingException e) {
            interestsJson = "[]";
        }
        return String.format("""
                {
                    \"fromCity\": \"%s\",
                    \"toCity\": \"%s\",
                    \"roundtrip\": %s,
                    \"days\": %d,
                    \"interests\": %s,
                    \"distanceKm\": 500.0
                }
                """, fromCity, toCity, roundtrip, days, interestsJson);
    }

    /**
     * Create a JSON string for user login request
     */
    public static String createLoginRequestJson(String username, String password) {
        return String.format("""
                {
                    "username": "%s",
                    "password": "%s"
                }
                """, username, password);
    }
} 