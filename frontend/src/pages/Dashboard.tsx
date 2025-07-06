import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TripForm from '../components/TripForm';
import TripCard from '../components/TripCard';
import TripDetails from '../components/TripDetails';
import DayDetails from '../components/DayDetails';
import TripOverviewMap from '../components/TripOverviewMap';
import PDFDownloadButton from '../components/PDFDownloadButton';
import { CogIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import '../styles/leaflet.css';
import { buildApiUrl, getApiHeaders, API_ENDPOINTS } from '../utils/api';

// Define interfaces for new data models
interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface PlaceOfInterest {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface DayPlan {
  id: number;
  dayNumber: number;
  startLocation: Location;
  finishLocation: Location;
  distanceKm: number;
  introduction: string;
  placesOfInterest: PlaceOfInterest[];
}

interface TripPlan {
  id: number;
  days: DayPlan[];
}

interface Trip {
  id: number;
  from: string;
  to: string;
  roundtrip: boolean;
  days: number;
  interests: string[];
  distanceKm: number;
  createdAt: string;
  tripPlans: TripPlan[];
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
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [newTrip, setNewTrip] = useState<Trip>({
    id: 0,
    from: '',
    to: '',
    roundtrip: false,
    days: 1,
    interests: [],
    distanceKm: 0,
    createdAt: new Date().toISOString(),
    tripPlans: [],
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No JWT token found. Please log in again.');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(buildApiUrl(API_ENDPOINTS.TRIPS.GET_USER_TRIPS), {
          method: 'GET',
          headers: getApiHeaders(token),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('HTTP error response:', text);
          throw new Error(`HTTP error! status: ${response.status}, body: ${text.substring(0, 500)}...`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Response is not JSON');
        }

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Raw response:', responseText.substring(0, 2000));
          throw new Error('Failed to parse JSON response');
        }

        const mappedTrips: Trip[] = Array.isArray(data) ? data.map((item: any) => ({
          id: item.tripId || item.id || 0,
          from: item.fromCity || item.from || 'Unknown',
          to: item.toCity || item.to || 'Unknown',
          roundtrip: item.roundtrip || false,
          days: item.days || 1,
          interests: item.interests || [],
          distanceKm: item.distanceKm || 0,
          createdAt: item.createdAt || new Date().toISOString(),
          tripPlans: item.tripPlans || [],
        })) : [];
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
  }, []);

  const handleDaysChange = useCallback((increment: boolean) => {
    setNewTrip((prev) => ({
      ...prev,
      days: Math.max(1, prev.days + (increment ? 1 : -1)),
    }));
  }, []);

  const handleRoundTripToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTrip((prev) => ({ ...prev, roundtrip: e.target.checked }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent, trip: Trip) => {
    setLoading(true); // Set loading to true before submission
    // onSubmit will be called by TripForm after API response
  }, []);

  const handleDeleteTrip = useCallback((id: number) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TripForm
              newTrip={newTrip}
              onInputChange={handleInputChange}
              onDaysChange={handleDaysChange}
              onRoundTripToggle={handleRoundTripToggle}
              onSubmit={handleSubmit}
              loading={loading}
              setLoading={setLoading} // Pass setLoading to TripForm
              setError={setError}
              error={error}
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TripCard
                  trip={trip}
                  onSelect={() => {
                    setSelectedTrip(trip);
                    setSelectedDay(null);
                  }}
                  onDelete={handleDeleteTrip}
                  setError={setError}
                />
              </motion.div>
            ))}
          </div>
          {selectedTrip && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <TripDetails
                  selectedTrip={selectedTrip}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                />
                <div className="md:w-1/2 bg-white rounded-lg shadow-md overflow-hidden min-h-[500px] relative z-0">
                  {selectedDay ? (
                    <DayDetails selectedDay={selectedDay} />
                  ) : (
                    <TripOverviewMap 
                      dayPlans={selectedTrip.tripPlans.length > 0 ? selectedTrip.tripPlans[0].days : []}
                      tripTitle={`${selectedTrip.from} to ${selectedTrip.to}`}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
          {loading && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
              <CogIcon className="h-12 w-12 text-white animate-spin" />
            </div>
          )}
          {error && <p className="text-red-600 text-center mt-6">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;