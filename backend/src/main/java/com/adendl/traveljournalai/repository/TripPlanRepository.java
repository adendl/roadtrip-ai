package com.adendl.traveljournalai.repository;

import com.adendl.traveljournalai.model.TripPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripPlanRepository extends JpaRepository<TripPlan, Long> {
    List<TripPlan> findByTripTripId(Long tripId);
}