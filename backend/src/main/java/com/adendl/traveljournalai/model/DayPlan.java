package com.adendl.traveljournalai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "day_plans")
@Data
@EqualsAndHashCode(exclude = {"tripPlan", "placesOfInterest"})
public class DayPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_plan_id", nullable = false)
    private TripPlan tripPlan;

    private int dayNumber;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "start_name")),
            @AttributeOverride(name = "latitude", column = @Column(name = "start_latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "start_longitude"))
    })
    private Location startLocation;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "finish_name")),
            @AttributeOverride(name = "latitude", column = @Column(name = "finish_latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "finish_longitude"))
    })
    private Location finishLocation;

    private double distanceKm;

    @Column(length = 1000)
    private String introduction;

    @OneToMany(mappedBy = "dayPlan", cascade = CascadeType.ALL)
    private List<PlaceOfInterest> placesOfInterest;
}