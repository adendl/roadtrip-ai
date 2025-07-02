import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TripForm from '../components/TripForm';
import TripCard from '../components/TripCard';
import TripDetails from '../components/TripDetails';
import DayDetails from '../components/DayDetails'; // Import remains unchanged
import { CogIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Renamed interface to IDayDetails to avoid conflict
interface Trip {
  id: number;
  from: string;
  to: string;
  roundtrip: boolean;
  days: number;
  interests: string[];
  distanceKm: number;
  createdAt: string;
}

interface IDayDetails { // Renamed from DayDetails
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
  const [selectedDay, setSelectedDay] = useState<IDayDetails | null>(null); // Updated to IDayDetails
  const [newTrip, setNewTrip] = useState<Trip>({
    id: Date.now(),
    from: '',
    to: '',
    roundtrip: false,
    days: 1,
    interests: [],
    distanceKm: 0,
    createdAt: new Date().toISOString(),
  });
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 1,
      from: 'Sydney, Australia',
      to: 'Melbourne, Australia',
      roundtrip: false,
      days: 3,
      interests: ['adventure', 'food'],
      distanceKm: 878,
      createdAt: '2025-07-01T09:00:00Z',
    },
    {
      id: 2,
      from: 'Tokyo, Japan',
      to: 'Osaka, Japan',
      roundtrip: true,
      days: 2,
      interests: ['culture', 'sightseeing'],
      distanceKm: 554,
      createdAt: '2025-07-01T10:00:00Z',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  };

  const handleDaysChange = (increment: boolean) => {
    setNewTrip((prev) => ({
      ...prev,
      days: Math.max(1, prev.days + (increment ? 1 : -1)),
    }));
  };

  const handleRoundTripToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTrip((prev) => ({ ...prev, roundtrip: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setTrips((prev) => [...prev, { ...newTrip, id: Date.now(), distanceKm: 500 }]);
      setNewTrip((prev) => ({
        ...prev,
        id: Date.now(),
        from: '',
        to: '',
        roundtrip: false,
        days: 1,
        interests: [],
        distanceKm: 0,
        createdAt: new Date().toISOString(),
      }));
      setLoading(false);
    }, 1000);
  };

  const handleDeleteTrip = (id: number) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  const getTripDays = (trip: Trip): IDayDetails[] => { // Updated to IDayDetails
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;