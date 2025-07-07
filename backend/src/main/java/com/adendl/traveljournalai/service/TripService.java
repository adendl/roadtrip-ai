package com.adendl.traveljournalai.service;

import com.adendl.traveljournalai.model.*;
import com.adendl.traveljournalai.repository.TripPlanRepository;
import com.adendl.traveljournalai.repository.TripRepository;
import com.adendl.traveljournalai.repository.UserRepository;
import com.adendl.traveljournalai.utils.LoggingUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.apache.logging.log4j.Logger;
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

    private static final Logger logger = LoggingUtils.getLogger(TripService.class);

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
        LoggingUtils.logMethodEntry(logger, "createTrip", "fromCity", fromCity, "toCity", toCity, "roundtrip", roundtrip, "days", days, "interests", interests, "distanceKm", distanceKm);
        long startTime = System.currentTimeMillis();

        try {
            logger.info("Starting createTrip process for fromCity: {} to toCity: {}", fromCity, toCity);

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
            logger.info("Trip saved with ID: {}", trip.getTripId());

            TripPlan tripPlan = generateTripPlan(trip);
            tripPlanRepository.save(tripPlan);
            logger.info("TripPlan generated and saved with ID: {}", tripPlan.getId());

            List<TripPlan> tripPlans = trip.getTripPlans();
            if (tripPlans == null) {
                tripPlans = new ArrayList<>();
            }
            tripPlans.add(tripPlan);
            trip.setTripPlans(tripPlans);
            Trip savedTrip = tripRepository.save(trip);
            logger.info("Trip updated with tripPlans and saved: {}", savedTrip.getTripId());

            // BREAK CIRCULAR REFERENCES FOR JSON SERIALIZATION (same as getTripsByUser)
            if (savedTrip.getTripPlans() != null) {
                for (TripPlan plan : savedTrip.getTripPlans()) {
                    plan.setTrip(null);
                    if (plan.getDays() != null) {
                        for (DayPlan day : plan.getDays()) {
                            day.setTripPlan(null);
                            if (day.getPlacesOfInterest() != null) {
                                for (PlaceOfInterest poi : day.getPlacesOfInterest()) {
                                    poi.setDayPlan(null);
                                }
                            }
                        }
                    }
                }
            }

            LoggingUtils.logMethodExit(logger, "createTrip", savedTrip);
            LoggingUtils.logPerformance(logger, "createTrip", startTime);
            return savedTrip;
        } catch (Exception e) {
            LoggingUtils.logMethodExitWithException(logger, "createTrip", e);
            throw e;
        }
    }

    private User validateAndGetUserFromJwt(String jwtToken) {
        LoggingUtils.logMethodEntry(logger, "validateAndGetUserFromJwt", "jwtToken", jwtToken.substring(0, Math.min(20, jwtToken.length())) + "...");
        
        logger.debug("Validating JWT token...");
        SecretKey key = Keys.hmacShaKeyFor(jwtConfig.getSecretKey().getBytes(StandardCharsets.UTF_8));
        Claims claims;
        try {
            claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(jwtToken).getPayload();
            logger.debug("JWT validated successfully. Claims: {}", claims);
        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Invalid JWT token", e);
        }
        String username = claims.getSubject();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        logger.debug("User retrieved from JWT: {}", username);
        
        LoggingUtils.logMethodExit(logger, "validateAndGetUserFromJwt", user);
        return user;
    }

    private TripPlan generateTripPlan(Trip trip) {
        LoggingUtils.logMethodEntry(logger, "generateTripPlan", "tripId", trip.getTripId());
        long startTime = System.currentTimeMillis();
        
        try {
            logger.info("Generating trip plan for trip ID: {}", trip.getTripId());
            String prompt = generatePrompt(trip);
            logger.debug("Generated prompt: {}...", prompt.substring(0, Math.min(200, prompt.length())));
            String jsonResponse = callOpenAiApi(prompt);
            logger.debug("Received OpenAI response: {}...", jsonResponse.substring(0, Math.min(200, jsonResponse.length())));
            TripPlan result = parseTripPlan(jsonResponse, trip);
            
            LoggingUtils.logMethodExit(logger, "generateTripPlan", result);
            LoggingUtils.logPerformance(logger, "generateTripPlan", startTime);
            return result;
        } catch (Exception e) {
            LoggingUtils.logMethodExitWithException(logger, "generateTripPlan", e);
            throw e;
        }
    }

    private String generatePrompt(Trip trip) {
        String roundtripStr = trip.isRoundtrip() ? "roundtrip" : "one-way trip";
        String interestsStr = String.join(", ", trip.getInterests());
        return String.format(
                "Generate a detailed trip plan for a %s from %s to %s over %d days, with interests in %s. " +
                        "For each day, provide the start and finish locations with their latitudes and longitudes, " +
                        "the distance between them, an in-depth introduction (roughly 100 words) to the destination, and some places of interest along the way. " +
                        "Return the response in JSON format with the following structure: " +
                        "{\"days\": [{\"day\": 1, \"startLocation\": {\"name\": \"City A\", \"latitude\": 12.34, \"longitude\": 56.78}, " +
                        "\"finishLocation\": {\"name\": \"City B\", \"latitude\": 23.45, \"longitude\": 67.89}, \"distanceKm\": 150, " +
                        "\"introduction\": \"Welcome to City B, known for its...\", \"placesOfInterest\": [{\"name\": \"Museum X\", " +
                        "\"description\": \"A great museum...\", \"latitude\": 23.46, \"longitude\": 67.90}, ...]}]}",
                roundtripStr, trip.getFromCity(), trip.getToCity(), trip.getDays(), interestsStr, trip.getDistanceKm()
        );
    }

    private String callOpenAiApi(String prompt) {
        LoggingUtils.logMethodEntry(logger, "callOpenAiApi", "promptLength", prompt.length());
        long startTime = System.currentTimeMillis();
        
        try {
            logger.debug("Calling OpenAI API with prompt...");
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
            body.put("max_tokens", 10000);
            body.put("response_format", Map.of("type", "json_object"));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("OpenAI API call successful");
                LoggingUtils.logPerformance(logger, "OpenAI API call", startTime);
                LoggingUtils.logMethodExit(logger, "callOpenAiApi", "Response received");
                return response.getBody();
            }
            logger.error("OpenAI API call failed with status: {}", response.getStatusCode());
            throw new RuntimeException("Failed to call OpenAI API");
        } catch (Exception e) {
            LoggingUtils.logMethodExitWithException(logger, "callOpenAiApi", e);
            throw e;
        }
    }

    private TripPlan parseTripPlan(String json, Trip trip) {
        LoggingUtils.logMethodEntry(logger, "parseTripPlan", "tripId", trip.getTripId(), "jsonLength", json.length());
        long startTime = System.currentTimeMillis();
        
        try {
            logger.debug("Parsing trip plan JSON for trip ID: {}", trip.getTripId());
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);
            JsonNode contentNode = root.path("choices").get(0).path("message").path("content");
            JsonNode tripPlanNode = mapper.readTree(contentNode.asText().trim());

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
            logger.info("Trip plan parsed successfully with {} days", days.size());
            
            LoggingUtils.logMethodExit(logger, "parseTripPlan", tripPlan);
            LoggingUtils.logPerformance(logger, "parseTripPlan", startTime);
            return tripPlan;
        } catch (Exception e) {
            logger.error("Failed to parse trip plan JSON: {}", e.getMessage(), e);
            LoggingUtils.logMethodExitWithException(logger, "parseTripPlan", e);
            throw new RuntimeException("Failed to parse trip plan JSON: " + e.getMessage(), e);
        }
    }

    public List<Trip> getTripsByUser(User user) {
        LoggingUtils.logMethodEntry(logger, "getTripsByUser", "userId", user.getId(), "username", user.getUsername());
        long startTime = System.currentTimeMillis();
        
        try {
            logger.debug("Fetching trips for user: {}", user.getUsername());
            List<Trip> trips = tripRepository.findByUser(user);
            logger.info("Found {} trips for user: {}", trips.size(), user.getUsername());
            
            // Break circular references for JSON serialization
            for (Trip trip : trips) {
                if (trip.getTripPlans() != null) {
                    for (TripPlan plan : trip.getTripPlans()) {
                        plan.setTrip(null);
                        if (plan.getDays() != null) {
                            for (DayPlan day : plan.getDays()) {
                                day.setTripPlan(null);
                                if (day.getPlacesOfInterest() != null) {
                                    for (PlaceOfInterest poi : day.getPlacesOfInterest()) {
                                        poi.setDayPlan(null);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            LoggingUtils.logMethodExit(logger, "getTripsByUser", trips.size() + " trips");
            LoggingUtils.logPerformance(logger, "getTripsByUser", startTime);
            return trips;
        } catch (Exception e) {
            LoggingUtils.logMethodExitWithException(logger, "getTripsByUser", e);
            throw e;
        }
    }

    public boolean deleteTrip(String jwtToken, Long tripId) {
        LoggingUtils.logMethodEntry(logger, "deleteTrip", "tripId", tripId);
        long startTime = System.currentTimeMillis();
        
        try {
            logger.info("Attempting to delete trip with ID: {}", tripId);
            User user = validateAndGetUserFromJwt(jwtToken);
            Trip trip = tripRepository.findById(tripId)
                    .orElseThrow(() -> new RuntimeException("Trip not found"));
            
            if (!trip.getUser().getId().equals(user.getId())) {
                logger.warn("Unauthorized delete attempt - User {} tried to delete trip {} owned by user {}", 
                           user.getUsername(), tripId, trip.getUser().getUsername());
                LoggingUtils.logSecurityEvent(logger, "UNAUTHORIZED_DELETE_ATTEMPT", user.getUsername(), 
                                            "Attempted to delete trip " + tripId);
                throw new RuntimeException("Unauthorized to delete this trip");
            }
            
            tripRepository.delete(trip);
            logger.info("Successfully deleted trip with ID: {} for user: {}", tripId, user.getUsername());
            
            LoggingUtils.logMethodExit(logger, "deleteTrip", true);
            LoggingUtils.logPerformance(logger, "deleteTrip", startTime);
            return true;
        } catch (Exception e) {
            LoggingUtils.logMethodExitWithException(logger, "deleteTrip", e);
            throw e;
        }
    }
}