import React, { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import { PlusIcon, MinusIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';
import { validateTripForm } from '../utils/TripFormValidation';
import { buildApiUrl, getApiHeaders, API_ENDPOINTS, fetchWithTimeout } from '../utils/api';

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

interface TripFormProps {
  newTrip: Trip;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDaysChange: (increment: boolean) => void;
  onRoundTripToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent, trip: Trip) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void; // Added setLoading prop
  setError: (error: string | null) => void;
  error: string | null;
}

const TripForm: React.FC<TripFormProps> = ({
  newTrip,
  onInputChange,
  onDaysChange,
  onRoundTripToggle,
  onSubmit,
  loading,
  setLoading,
  setError,
  error,
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [generationMessages, setGenerationMessages] = useState<string[]>([]);

  // Messages to display during AI generation
  const aiMessages = [
    'Generating your trip plan with AI...',
    'Analysing routes and destinations...',
    'Crafting a personalised itinerary...',
    'Finalising details with AI precision...',
  ];

  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (loading && messageIndex < aiMessages.length) {
        setGenerationMessages((prev) => [...prev.slice(-2), aiMessages[messageIndex]]);
        messageIndex++;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]); // Clear previous errors on new submission attempt
    setGenerationMessages([]); // Clear previous messages
    setLoading(true); // Set loading to true at the start of submission
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No JWT token found. Please log in again.');
      setLoading(false); // Reset loading if token is missing
      return;
    }

    const { isValid, errors } = validateTripForm(newTrip);
    if (!isValid) {
      setValidationErrors(errors); // Set errors only on submit failure
      setLoading(false); // Reset loading on validation failure
      return;
    }

    try {
      console.log('Sending request to backend with:', {
        fromCity: newTrip.from,
        toCity: newTrip.to,
        roundtrip: newTrip.roundtrip,
        days: newTrip.days,
        interests: newTrip.interests,
        distanceKm: 500,
      }); // Debug the payload
      const response = await fetchWithTimeout(buildApiUrl(API_ENDPOINTS.TRIPS.CREATE), {
        method: 'POST',
        headers: getApiHeaders(token),
        body: JSON.stringify({
          fromCity: newTrip.from,
          toCity: newTrip.to,
          roundtrip: newTrip.roundtrip,
          days: newTrip.days,
          interests: newTrip.interests,
          distanceKm: 500,
        }),
      }, 600000); // 10 minutes timeout for trip generation

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data); // Debug the response
      if (data && data.tripId) {
        onSubmit(e, { ...newTrip, ...data, createdAt: new Date().toISOString(), tripPlans: data.tripPlans || [] });
      } else {
        setError('Invalid response from server.');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      if (error instanceof Error && error.message.includes('timed out')) {
        setError('Trip generation is taking longer than expected. Please wait a moment and check your trips list - it may have been created successfully.');
      } else {
        setError('Failed to create trip. Please try again or check your connection.');
      }
    } finally {
      setLoading(false); // Reset loading after response or error
    }
  };

  const isFormValid = useCallback(() => {
    return newTrip.from.trim().length > 0 && newTrip.to.trim().length > 0 && newTrip.from.length <= 20 && newTrip.to.length <= 20;
  }, [newTrip]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 font-montserrat">Plan a New Trip</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="from"
            value={newTrip.from}
            onChange={onInputChange}
            placeholder="From"
            className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-roboto"
          />
          <input
            type="text"
            name="to"
            value={newTrip.to}
            onChange={onInputChange}
            placeholder="To"
            className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-roboto"
          />
        </div>
        {validationErrors.length > 0 && (
          <div className="text-red-600 text-sm mt-2">
            {validationErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="roundtrip"
              checked={newTrip.roundtrip}
              onChange={onInputChange}
              className="hidden"
            />
            <span
              className={`h-6 w-6 flex items-center justify-center bg-white border border-gray-300 rounded-full cursor-pointer ${newTrip.roundtrip ? 'bg-indigo-600 border-indigo-600' : ''}`}
            >
              {newTrip.roundtrip && <CheckIcon className="h-4 w-4 text-indigo-600" />}
            </span>
            <span className="ml-2 text-gray-800">Round Trip</span>
          </label>
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-gray-800">Number of Days</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-full p-2 w-32">
            <button
              type="button"
              onClick={() => onDaysChange(false)}
              className="px-3 py-1 text-gray-800 hover:text-indigo-600 focus:outline-none"
            >
              <MinusIcon className="h-5 w-5" />
            </button>
            <span className="flex-1 text-center text-gray-800">{newTrip.days}</span>
            <button
              type="button"
              onClick={() => onDaysChange(true)}
              className="px-3 py-1 text-gray-800 hover:text-indigo-600 focus:outline-none"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-gray-800">Interests</label>
          <div className="flex flex-wrap gap-4">
            {['adventure', 'food', 'culture', 'sightseeing'].map((interest) => (
              <label key={interest} className="flex items-center">
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={newTrip.interests.includes(interest)}
                  onChange={onInputChange}
                  className="mr-2"
                />
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <Button
            text={loading ? undefined : 'Generate Your Trip Plan'}
            type="submit"
            variant="primary"
            className="mt-4 px-6 py-2 text-lg font-roboto bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            disabled={loading || !isFormValid()}
            icon={loading ? <CogIcon className="h-5 w-5 animate-spin" /> : undefined}
          />
        </div>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </form>

      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <CogIcon className="h-16 w-16 animate-spin mx-auto mb-4" />
            {generationMessages.map((msg, index) => (
              <p key={index} className="text-lg">{msg}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripForm;