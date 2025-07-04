package com.adendl.traveljournalai.service;

import com.adendl.traveljournalai.model.*;
import com.adendl.traveljournalai.repository.TripPlanRepository;
import com.adendl.traveljournalai.repository.TripRepository;
import com.adendl.traveljournalai.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.adendl.traveljournalai.config.JwtConfig;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripPlanRepository tripPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JwtConfig jwtConfig;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    public Trip createTrip(String jwtToken, String fromCity, String toCity, boolean roundtrip, int days, List<String> interests, double distanceKm) {
        User user = validateAndGetUserFromJwt(jwtToken);

        Trip trip = new Trip();
        trip.setFromCity(fromCity);
        trip.setToCity(toCity);
        trip.setRoundtrip(roundtrip);
        trip.setDays(days);
        trip.setInterests(interests);
        trip.setDistanceKm(distanceKm);
        trip.setCreatedAt(Instant.now().toString());
        trip.setUser(user);

        trip = tripRepository.save(trip);

        // Generate and save trip plan using OpenAI API
        TripPlan tripPlan = generateTripPlan(trip);
        tripPlanRepository.save(tripPlan);

        List<TripPlan> tripPlans = trip.getTripPlans();
        if (tripPlans == null) {
            tripPlans = new ArrayList<>();
        }
        tripPlans.add(tripPlan);
        trip.setTripPlans(tripPlans);
        return tripRepository.save(trip);
    }

    private User validateAndGetUserFromJwt(String jwtToken) {
        System.out.println("JWT Token: " + jwtToken);
        System.out.println("JWT Config Secret: " + jwtConfig.getSecretKey());

        SecretKey key = Keys.hmacShaKeyFor(jwtConfig.getSecretKey().getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();

        String username = claims.getSubject();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TripPlan generateTripPlan(Trip trip) {
        String prompt = generatePrompt(trip);
        String jsonResponse = callOpenAiApi(prompt);
        return parseTripPlan(jsonResponse, trip);
    }

    private String generatePrompt(Trip trip) {
        String roundtripStr = trip.isRoundtrip() ? "roundtrip" : "one-way trip";
        String interestsStr = String.join(", ", trip.getInterests());
        return String.format(
                "Generate a detailed trip plan for a %s from %s to %s over %d days, with interests in %s. " +
                        "The total distance is %.2f km. For each day, provide the start and finish locations with their latitudes and longitudes, " +
                        "the distance between them, an introduction to the destination, and some places of interest along the way. " +
                        "Return the response in JSON format with the following structure: " +
                        "{\"days\": [{\"day\": 1, \"startLocation\": {\"name\": \"City A\", \"latitude\": 12.34, \"longitude\": 56.78}, " +
                        "\"finishLocation\": {\"name\": \"City B\", \"latitude\": 23.45, \"longitude\": 67.89}, \"distanceKm\": 150, " +
                        "\"introduction\": \"Welcome to City B, known for its...\", \"placesOfInterest\": [{\"name\": \"Museum X\", " +
                        "\"description\": \"A great museum...\", \"latitude\": 23.46, \"longitude\": 67.90}, ...]}]}",
                roundtripStr, trip.getFromCity(), trip.getToCity(), trip.getDays(), interestsStr, trip.getDistanceKm()
        );
    }

    private String callOpenAiApi(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + openAiApiKey);
        headers.set("Content-Type", "application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4.1-mini");
        body.put("messages", List.of(
                Map.of("role", "system", "content", "You are a helpful assistant that generates trip plans."),
                Map.of("role", "user", "content", prompt)
        ));
        body.put("max_tokens", 1500);
        body.put("response_format", Map.of("type", "json_object"));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new RuntimeException("Failed to call OpenAI API: " + (response.getBody() != null ? response.getBody() : response.getStatusCode()));
        }
    }

    private TripPlan parseTripPlan(String json, Trip trip) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode root = mapper.readTree(json);
            JsonNode choices = root.path("choices");
            if (choices.isEmpty()) {
                throw new RuntimeException("No choices returned from OpenAI API");
            }
            JsonNode contentNode = choices.get(0).path("message").path("content");
            String tripPlanJson = contentNode.asText().trim();
            JsonNode tripPlanNode = mapper.readTree(tripPlanJson);

            TripPlan tripPlan = new TripPlan();
            tripPlan.setTrip(trip);
            List<DayPlan> days = new ArrayList<>();
            for (JsonNode dayNode : tripPlanNode.get("days")) {
                DayPlan dayPlan = new DayPlan();
                dayPlan.setTripPlan(tripPlan);
                dayPlan.setDayNumber(dayNode.get("day").asInt());

                JsonNode startLocNode = dayNode.get("startLocation");
                Location startLocation = new Location();
                startLocation.setName(startLocNode.get("name").asText());
                startLocation.setLatitude(startLocNode.get("latitude").asDouble());
                startLocation.setLongitude(startLocNode.get("longitude").asDouble());
                dayPlan.setStartLocation(startLocation);

                JsonNode finishLocNode = dayNode.get("finishLocation");
                Location finishLocation = new Location();
                finishLocation.setName(finishLocNode.get("name").asText());
                finishLocation.setLatitude(finishLocNode.get("latitude").asDouble());
                finishLocation.setLongitude(finishLocNode.get("longitude").asDouble());
                dayPlan.setFinishLocation(finishLocation);

                dayPlan.setDistanceKm(dayNode.get("distanceKm").asDouble());
                dayPlan.setIntroduction(dayNode.get("introduction").asText());

                List<PlaceOfInterest> places = new ArrayList<>();
                for (JsonNode poiNode : dayNode.get("placesOfInterest")) {
                    PlaceOfInterest poi = new PlaceOfInterest();
                    poi.setDayPlan(dayPlan);
                    poi.setName(poiNode.get("name").asText());
                    poi.setDescription(poiNode.get("description").asText());
                    poi.setLatitude(poiNode.get("latitude").asDouble());
                    poi.setLongitude(poiNode.get("longitude").asDouble());
                    places.add(poi);
                }
                dayPlan.setPlacesOfInterest(places);
                days.add(dayPlan);
            }
            tripPlan.setDays(days);
            return tripPlan;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse trip plan JSON: " + e.getMessage(), e);
        }
    }

    public List<Trip> getTripsByUser(User user) {
        return tripRepository.findByUser(user);
    }

    public boolean deleteTrip(String jwtToken, Long tripId) {
        System.out.println("Delete JWT Token: " + jwtToken);
        System.out.println("Delete Trip ID: " + tripId);

        User user = validateAndGetUserFromJwt(jwtToken);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this trip");
        }

        tripRepository.delete(trip);
        return true;
    }
}