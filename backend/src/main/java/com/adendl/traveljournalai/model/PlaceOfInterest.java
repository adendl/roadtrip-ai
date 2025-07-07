package com.adendl.traveljournalai.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "places_of_interest")
@Data
@EqualsAndHashCode(exclude = "dayPlan")
public class PlaceOfInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "day_plan_id", nullable = false)
    private DayPlan dayPlan;

    private String name;
    private String description;
    private double latitude;
    private double longitude;
}