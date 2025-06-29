package com.adendl.traveljournalai.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "journal_entries")
@Data
public class JournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "geometry(Point, 4326)") // PostGIS Point type (SRID 4326 for lat/long)
    private Point location;

    @Column
    private String photoUrl; // S3 URL for the uploaded photo

    @Column(columnDefinition = "TEXT")
    private String aiSummary; // AI-generated summary

    @Column(nullable = false)
    private boolean isPublic; // Visibility for sharing

    @Column
    private String shareableLink; // Unique URL for public sharing (e.g., UUID)

    @Column(nullable = false)
    private String createdAt; // ISO 8601 timestamp
}
