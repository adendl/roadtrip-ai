// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TripForm from '../components/TripForm';
import TripCard from '../components/TripCard';
import TripDetails from '../components/TripDetails';
import DayDetails from '../components/DayDetails';
import { CogIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Trip {
  id: number; // Updated to match backend tripId
  from: string;
  to: string;
  roundtrip: boolean;
  days: number;
  interests: string[];
  distanceKm: number;
  createdAt: string;
}

interface IDayDetails {
  dayNumber: number;
  start: string;
  end: string;
  distanceKm: number;
  coordinates: [number, number];
}

const Dashboard: React.FC = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !token) {
      navigate('/login');
    }
  }, [isLoggedIn, token, navigate]);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedDay, setSelectedDay] = useState<IDayDetails | null>(null);
  const [newTrip, setNewTrip] = useState<Trip>({
    id: 0, // Initialize with 0, will be set by API
    from: '',
    to: '',
    roundtrip: false,
    days: 1,
    interests: [],
    distanceKm: 0,
    createdAt: new Date().toISOString(),
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user trips on mount
  useEffect(() => {
    const fetchUserTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No JWT token found. Please log in again.');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:9090/api/trips/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Trips Data:', data); // Debug API response
        // Map API response to Trip interface, assuming tripId is returned
        const mappedTrips: Trip[] = data.map((item: any) => ({
          id: item.tripId || item.id || 0, // Fallback to id or 0 if tripId is missing
          from: item.fromCity || item.from || 'Unknown', // Fallback to fromCity or default
          to: item.toCity || item.to || 'Unknown', // Fallback to toCity or default
          roundtrip: item.roundtrip || false,
          days: item.days || 1,
          interests: item.interests || [],
          distanceKm: item.distanceKm || 0,
          createdAt: item.createdAt || new Date().toISOString(),
        }));
        setTrips(mappedTrips);
      } catch (error) {
        console.error('Error fetching user trips:', error);
        setError('Failed to load user trips. Please try again or check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewTrip((prev) => {
      if (name === 'roundtrip') {
        return { ...prev, [name]: checked };
      } else if (type === 'checkbox' && name === 'interests') {
        return {
          ...prev,
          interests: checked
            ? [...prev.interests, value]
            : prev.interests.filter((i) => i !== value),
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
    console.log('Input Changed - New Trip:', newTrip);
  }, []);

  const handleDaysChange = useCallback((increment: boolean) => {
    setNewTrip((prev) => ({
      ...prev,
      days: Math.max(1, prev.days + (increment ? 1 : -1)),
    }));
    console.log('Days Changed - New Trip:', newTrip, 'Trips:', trips);
  }, []);

  const handleRoundTripToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTrip((prev) => ({ ...prev, roundtrip: e.target.checked }));
    console.log('Round Trip Toggled - New Trip:', newTrip);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent, trip: Trip) => {
    e.preventDefault();
    setLoading(false);
    setTrips((prev) => [...prev, trip]);
    setNewTrip((prev) => ({
      ...prev,
      id: 0, // Reset to 0, will be set by API
      from: '',
      to: '',
      roundtrip: false,
      days: 1,
      interests: [],
      distanceKm: 0,
      createdAt: new Date().toISOString(),
    }));
    setError(null);
    console.log('Submit - New Trip Added:', trip, 'Trips:', trips);
  }, []);

  const handleDeleteTrip = useCallback((id: number) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
    console.log('Delete - Trips:', trips);
  }, []);

  const getTripDays = (trip: Trip): IDayDetails[] => {
    const totalDistance = trip.distanceKm;
    const distancePerDay = totalDistance / trip.days;
    const days: IDayDetails[] = [];
    for (let i = 1; i <= trip.days; i++) {
      days.push({
        dayNumber: i,
        start: i === 1 ? trip.from : (trip.roundtrip && i === trip.days ? trip.from : trip.to),
        end: trip.roundtrip && i === trip.days ? trip.from : trip.to,
        distanceKm: distancePerDay,
        coordinates: trip.from === 'Sydney, Australia' && trip.to === 'Melbourne, Australia'
          ? [-34.0 + (i - 1) * (2 / trip.days), 144.0 + (i - 1) * (2 / trip.days)]
          : [35.0 + (i - 1) * (2 / trip.days), 135.0 + (i - 1) * (2 / trip.days)],
      });
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white relative">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TripForm
            newTrip={newTrip}
            onInputChange={handleInputChange}
            onDaysChange={handleDaysChange}
            onRoundTripToggle={handleRoundTripToggle}
            onSubmit={handleSubmit}
            loading={loading}
            setError={setError}
            error={error}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onSelect={() => {
                  setSelectedTrip(trip);
                  setSelectedDay(null);
                }}
                onDelete={handleDeleteTrip}
                setError={setError}
              />
            ))}
          </div>
          {selectedTrip && (
            <div className="flex flex-col md:flex-row gap-6">
              <TripDetails
                selectedTrip={selectedTrip}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                getTripDays={getTripDays}
              />
              <div className="md:w-1/2 p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
                {selectedDay && <DayDetails selectedDay={selectedDay} />}
              </div>
            </div>
          )}
          {loading && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <CogIcon className="h-12 w-12 text-white animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;