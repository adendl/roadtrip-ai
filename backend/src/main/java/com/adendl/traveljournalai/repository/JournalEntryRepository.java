package com.adendl.traveljournalai.repository;

import com.adendl.traveljournalai.model.JournalEntry;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByUserId(Long userId);
    List<JournalEntry> findByIsPublicTrue();

    @Query(value = "SELECT * FROM journal_entries WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :distance)", nativeQuery = true)
    List<JournalEntry> findWithinDistance(double lat, double lng, double distance);
}