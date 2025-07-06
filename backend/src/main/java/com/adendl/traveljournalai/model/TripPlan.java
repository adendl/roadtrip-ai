package com.adendl.traveljournalai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "trip_plans")
@Data
@EqualsAndHashCode(exclude = "trip") // Exclude trip to break circular reference
public class TripPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @OneToMany(mappedBy = "tripPlan", cascade = CascadeType.ALL)
    private List<DayPlan> days;
}