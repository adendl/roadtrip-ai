// src/main/java/com/adendl/traveljournalai/controller/TripController.java
package com.adendl.traveljournalai.controller;

import com.adendl.traveljournalai.model.Trip;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.UserRepository;
import com.adendl.traveljournalai.service.TripService;
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

    @Autowired
    private TripService tripService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Trip> createTrip(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody TripRequest tripRequest) {

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
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Trip>> getUserTrips() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(tripService.getTripsByUser(user));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable Long tripId,
            @RequestHeader("Authorization") String authorizationHeader) {

        String jwtToken = authorizationHeader.replace("Bearer ", "");
        try {
            boolean success = tripService.deleteTrip(jwtToken, tripId);
            return success ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
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