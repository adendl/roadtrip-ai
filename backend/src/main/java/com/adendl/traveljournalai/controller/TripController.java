package com.adendl.traveljournalai.controller;

import com.adendl.traveljournalai.model.Trip;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.UserRepository;
import com.adendl.traveljournalai.service.TripService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private static final Logger logger = LogManager.getLogger(TripController.class);

    @Autowired
    private TripService tripService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Trip> createTrip(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody TripRequest tripRequest) {
        logger.info("Creating new trip from {} to {} for {} days", 
                   tripRequest.getFromCity(), tripRequest.getToCity(), tripRequest.getDays());
        
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        try {
            Trip trip = tripService.createTrip(
                    jwtToken,
                    tripRequest.getFromCity(),
                    tripRequest.getToCity(),
                    tripRequest.isRoundtrip(),
                    tripRequest.getDays(),
                    tripRequest.getInterests(),
                    tripRequest.getDistanceKm()
            );
            logger.info("Successfully created trip with ID: {}", trip.getTripId());
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            logger.error("Failed to create trip: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Trip>> getUserTrips() {
        logger.debug("Getting trips for authenticated user");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            logger.warn("Unauthorized access attempt to getUserTrips");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = auth.getName();
        logger.info("Fetching trips for user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Trip> trips = tripService.getTripsByUser(user);
        logger.info("Retrieved {} trips for user: {}", trips.size(), username);
        return ResponseEntity.ok(trips);
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable Long tripId,
            @RequestHeader("Authorization") String authorizationHeader) {
        logger.info("Attempting to delete trip with ID: {}", tripId);
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        try {
            boolean success = tripService.deleteTrip(jwtToken, tripId);
            if (success) {
                logger.info("Successfully deleted trip with ID: {}", tripId);
                return ResponseEntity.ok().build();
            } else {
                logger.error("Failed to delete trip with ID: {}", tripId);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            logger.error("Exception occurred while deleting trip with ID {}: {}", tripId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}

class TripRequest {
    private String fromCity;
    private String toCity;
    private boolean roundtrip;
    private int days;
    private List<String> interests;
    private double distanceKm;

    // Getters and setters
    public String getFromCity() { return fromCity; }
    public void setFromCity(String fromCity) { this.fromCity = fromCity; }
    public String getToCity() { return toCity; }
    public void setToCity(String toCity) { this.toCity = toCity; }
    public boolean isRoundtrip() { return roundtrip; }
    public void setRoundtrip(boolean roundtrip) { this.roundtrip = roundtrip; }
    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
}