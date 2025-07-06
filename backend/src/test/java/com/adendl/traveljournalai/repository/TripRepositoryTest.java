package com.adendl.traveljournalai.repository;

import com.adendl.traveljournalai.model.Trip;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.utils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=true"
})
class TripRepositoryTest {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Clear database before each test
        tripRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        testUser = TestUtils.createTestUser();
        testUser = userRepository.save(testUser);
    }

    @Test
    @Transactional
    void save_Success() {
        // Given
        Trip trip = TestUtils.createTestTrip();
        trip.setUser(testUser);

        // When
        Trip savedTrip = tripRepository.save(trip);

        // Then
        assertNotNull(savedTrip);
        assertNotNull(savedTrip.getTripId());
        assertEquals("Sydney", savedTrip.getFromCity());
        assertEquals("Melbourne", savedTrip.getToCity());
        assertEquals(testUser.getId(), savedTrip.getUser().getId());
    }

    @Test
    @Transactional
    void saveAndUpdate_Success() {
        // Given
        Trip trip = TestUtils.createTestTrip();
        trip.setUser(testUser);
        Trip savedTrip = tripRepository.save(trip);

        // When - Update the trip
        savedTrip.setFromCity("Brisbane");
        savedTrip.setToCity("Gold Coast");
        Trip updatedTrip = tripRepository.save(savedTrip);

        // Then
        assertNotNull(updatedTrip);
        assertEquals("Brisbane", updatedTrip.getFromCity());
        assertEquals("Gold Coast", updatedTrip.getToCity());
        assertEquals(savedTrip.getTripId(), updatedTrip.getTripId());
    }

    @Test
    @Transactional
    void findById_Success() {
        // Given
        Trip trip = TestUtils.createTestTrip();
        trip.setUser(testUser);
        Trip savedTrip = tripRepository.save(trip);

        // When
        Optional<Trip> foundTrip = tripRepository.findById(savedTrip.getTripId());

        // Then
        assertTrue(foundTrip.isPresent());
        assertEquals(savedTrip.getTripId(), foundTrip.get().getTripId());
        assertEquals("Sydney", foundTrip.get().getFromCity());
    }

    @Test
    @Transactional
    void findById_NotFound() {
        // When
        Optional<Trip> foundTrip = tripRepository.findById(999L);

        // Then
        assertFalse(foundTrip.isPresent());
    }

    @Test
    @Transactional
    void findAll_Success() {
        // Given
        Trip trip1 = TestUtils.createTestTrip();
        trip1.setUser(testUser);
        tripRepository.save(trip1);

        Trip trip2 = TestUtils.createTestTrip();
        trip2.setUser(testUser);
        trip2.setFromCity("Brisbane");
        trip2.setToCity("Gold Coast");
        tripRepository.save(trip2);

        // When
        List<Trip> allTrips = tripRepository.findAll();

        // Then
        assertEquals(2, allTrips.size());
        assertTrue(allTrips.stream().anyMatch(trip -> trip.getFromCity().equals("Sydney")));
        assertTrue(allTrips.stream().anyMatch(trip -> trip.getFromCity().equals("Brisbane")));
    }

    @Test
    @Transactional
    void findByUser_Success() {
        // Given
        Trip trip1 = TestUtils.createTestTrip();
        trip1.setUser(testUser);
        tripRepository.save(trip1);

        Trip trip2 = TestUtils.createTestTrip();
        trip2.setUser(testUser);
        trip2.setFromCity("Brisbane");
        trip2.setToCity("Gold Coast");
        tripRepository.save(trip2);

        // Create another user and trip
        User otherUser = TestUtils.createTestUser();
        otherUser.setUsername("otheruser");
        otherUser.setEmail("otheruser@test.com");
        otherUser = userRepository.save(otherUser);

        Trip otherTrip = TestUtils.createTestTrip();
        otherTrip.setUser(otherUser);
        otherTrip.setFromCity("Perth");
        tripRepository.save(otherTrip);

        // When
        List<Trip> userTrips = tripRepository.findByUser(testUser);

        // Then
        assertEquals(2, userTrips.size());
        assertTrue(userTrips.stream().allMatch(trip -> trip.getUser().getId().equals(testUser.getId())));
        assertTrue(userTrips.stream().anyMatch(trip -> trip.getFromCity().equals("Sydney")));
        assertTrue(userTrips.stream().anyMatch(trip -> trip.getFromCity().equals("Brisbane")));
    }

    @Test
    @Transactional
    void findByUser_EmptyList() {
        // When
        List<Trip> userTrips = tripRepository.findByUser(testUser);

        // Then
        assertTrue(userTrips.isEmpty());
    }

    @Test
    @Transactional
    void delete_Success() {
        // Given
        Trip trip = TestUtils.createTestTrip();
        trip.setUser(testUser);
        Trip savedTrip = tripRepository.save(trip);

        // When
        tripRepository.delete(savedTrip);

        // Then
        assertFalse(tripRepository.findById(savedTrip.getTripId()).isPresent());
    }
} 