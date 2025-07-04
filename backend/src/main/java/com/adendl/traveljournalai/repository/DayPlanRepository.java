package com.adendl.traveljournalai.repository;

import com.adendl.traveljournalai.model.DayPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayPlanRepository extends JpaRepository<DayPlan, Long> {
}