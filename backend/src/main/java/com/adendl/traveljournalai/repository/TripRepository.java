package com.adendl.traveljournalai.repository;

import com.adendl.traveljournalai.model.Trip;
import com.adendl.traveljournalai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUser(User user);
}