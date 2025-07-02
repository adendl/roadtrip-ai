// src/main/java/com/adendl/traveljournalai/service/TripService.java
package com.adendl.traveljournalai.service;

import com.adendl.traveljournalai.model.Trip;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.TripRepository;
import com.adendl.traveljournalai.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.adendl.traveljournalai.config.JwtConfig;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.List;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtConfig jwtConfig;

    public Trip createTrip(String jwtToken, String fromCity, String toCity, boolean roundtrip, int days, List<String> interests, double distanceKm) {
        System.out.println("JWT Token: " + jwtToken);
        System.out.println("JWT Config Secret: " + jwtConfig.getSecretKey());

        SecretKey key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtConfig.getSecretKey().getBytes());
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();

        String username = claims.getSubject();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = new Trip();
        trip.setFromCity(fromCity);
        trip.setToCity(toCity);
        trip.setRoundtrip(roundtrip);
        trip.setDays(days);
        trip.setInterests(interests);
        trip.setDistanceKm(distanceKm);
        trip.setCreatedAt(Instant.now().toString());
        trip.setUser(user);

        return tripRepository.save(trip);
    }

    public List<Trip> getTripsByUser(User user) {
        return tripRepository.findByUser(user);
    }

    public boolean deleteTrip(String jwtToken, Long tripId) {
        System.out.println("Delete JWT Token: " + jwtToken);
        System.out.println("Delete Trip ID: " + tripId);

        SecretKey key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtConfig.getSecretKey().getBytes());
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();

        String username = claims.getSubject();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this trip");
        }

        tripRepository.delete(trip);
        return true; // Indicate success
    }
}