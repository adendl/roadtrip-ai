import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { PlusIcon, MinusIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

interface DayDetails {
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
  const [selectedDay, setSelectedDay] = useState<DayDetails | null>(null);
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

  const handleDaysChange = (e: React.MouseEvent, increment: boolean) => {
    e.preventDefault();
    setNewTrip((prev) => ({
      ...prev,
      days: Math.max(1, prev.days + (increment ? 1 : -1)),
    }));
  };

  const handleRoundTripToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewTrip((prev) => ({ ...prev, roundtrip: !prev.roundtrip }));
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

  const getTripDays = (trip: Trip): DayDetails[] => {
    const totalDistance = trip.distanceKm;
    const distancePerDay = totalDistance / trip.days;
    const days: DayDetails[] = [];
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
          <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Plan a New Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="from"
                value={newTrip.from}
                onChange={handleInputChange}
                placeholder="From"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="to"
                value={newTrip.to}
                onChange={handleInputChange}
                placeholder="To"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="roundtrip"
                  checked={newTrip.roundtrip}
                  className="hidden"
                />
                <span
                  onClick={handleRoundTripToggle}
                  className={`h-6 w-6 flex items-center justify-center bg-gray-800 rounded-full border-2 border-gray-600 cursor-pointer ${newTrip.roundtrip ? 'bg-indigo-600 border-indigo-600' : ''}`}
                >
                  {newTrip.roundtrip && <CheckIcon className="h-4 w-4 text-white" />}
                </span>
                <span className="ml-2 text-white">Round Trip</span>
              </label>
            </div>
            <div className="mt-4">
              <label className="block mb-2">Number of Days</label>
              <div className="flex items-center bg-gray-800 rounded-full p-2 w-32">
                <button
                  onClick={(e) => handleDaysChange(e, false)}
                  className="px-3 py-1 text-white hover:text-indigo-300 focus:outline-none"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                <span className="flex-1 text-center text-white">{newTrip.days}</span>
                <button
                  onClick={(e) => handleDaysChange(e, true)}
                  className="px-3 py-1 text-white hover:text-indigo-300 focus:outline-none"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-2">Interests</label>
              <div className="flex flex-wrap gap-4">
                {['adventure', 'food', 'culture', 'sightseeing'].map((interest) => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      checked={newTrip.interests.includes(interest)}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <Button
              text="Generate Your Trip Plan"
              type="submit"
              variant="primary"
              className="mt-4 rounded-full"
              disabled={loading}
            />
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedTrip(trip);
                  setSelectedDay(null);
                }}
              >
                <h3 className="text-xl font-semibold">{trip.from} to {trip.to}</h3>
                <p className="text-gray-300 text-sm">{new Date(trip.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-400 text-sm">Days: {trip.days}, Distance: {trip.distanceKm} km</p>
                <p className="text-gray-400 text-sm">Interests: {trip.interests.join(', ')}</p>
              </div>
            ))}
          </div>
          {selectedTrip && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-2">{selectedTrip.from} to {selectedTrip.to}</h3>
                <div className="space-y-4">
                  {getTripDays(selectedTrip).map((day) => (
                    <div
                      key={day.dayNumber}
                      className="p-4 bg-gray-800 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30"
                      onClick={() => setSelectedDay(day.dayNumber === selectedDay?.dayNumber ? null : day)}
                    >
                      <h4 className="text-lg font-semibold">Day {day.dayNumber}</h4>
                      {selectedDay && selectedDay.dayNumber === day.dayNumber && (
                        <div className="mt-2 space-y-2">
                          <p>Start: {day.start}</p>
                          <p>End: {day.end}</p>
                          <p>Distance: {day.distanceKm.toFixed(1)} km</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
                {selectedDay && (
                  <div className="h-72 w-full mb-4 rounded overflow-hidden">
                    <MapContainer
                      center={selectedDay.coordinates}
                      zoom={10}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={selectedDay.coordinates}>
                        <Popup>Day {selectedDay.dayNumber} Midpoint</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <CogIcon className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;