package com.adendl.traveljournalai.repository;

import com.adendl.traveljournalai.model.PlaceOfInterest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceOfInterestRepository extends JpaRepository<PlaceOfInterest, Long> {
}