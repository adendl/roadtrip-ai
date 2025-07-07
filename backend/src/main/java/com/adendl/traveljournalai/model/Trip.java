package com.adendl.traveljournalai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "trips")
@Data
@EqualsAndHashCode(exclude = {"tripPlans", "user"}) // Exclude tripPlans and user to break circular references
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

    @Column(nullable = false)
    private String fromCity;

    @Column(nullable = false)
    private String toCity;

    @Column(nullable = false)
    private boolean roundtrip;

    @Column(nullable = false)
    private int days;

    @ElementCollection
    @CollectionTable(name = "trip_interests", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "interest")
    private List<String> interests;

    @Column(nullable = false)
    private double distanceKm;

    @Column(nullable = false)
    private String createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<TripPlan> tripPlans;

    public Long getTripId() { return tripId; }

}