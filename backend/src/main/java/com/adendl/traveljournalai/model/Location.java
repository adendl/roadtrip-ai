package com.adendl.traveljournalai.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Location {
    private String name;
    private double latitude;
    private double longitude;
}