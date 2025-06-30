package com.adendl.traveljournalai.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Hashed password (e.g., using BCrypt)

    @Column(nullable = false)
    private String createdAt; // ISO 8601 timestamp (e.g., "2025-06-29T20:15:00Z")
}