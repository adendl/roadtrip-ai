import React, { useState, useCallback } from 'react';
import Button from './Button';
import { PlusIcon, MinusIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';
import { validateTripForm } from '../utils/TripFormValidation';

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

interface TripFormProps {
  newTrip: Trip;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDaysChange: (increment: boolean) => void;
  onRoundTripToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent, trip: Trip) => void;
  loading: boolean;
  setError: (error: string | null) => void;
  error: string | null;
}

const TripForm: React.FC<TripFormProps> = ({ newTrip, onInputChange, onDaysChange, onRoundTripToggle, onSubmit, loading, setError, error }) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]); // Clear previous errors on new submission attempt
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No JWT token found. Please log in again.');
      return;
    }

    const { isValid, errors } = validateTripForm(newTrip);
    if (!isValid) {
      setValidationErrors(errors); // Set errors only on submit failure
      return;
    }

    try {
      const response = await fetch('http://localhost:9090/api/trips/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCity: newTrip.from,
          toCity: newTrip.to,
          roundtrip: newTrip.roundtrip,
          days: newTrip.days,
          interests: newTrip.interests,
          distanceKm: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.tripId) {
        onSubmit(e, { ...newTrip, ...data, createdAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      setError('Failed to create trip. Please try again or check your connection.');
    }
  };

  const isFormValid = useCallback(() => {
    return newTrip.from.trim().length > 0 && newTrip.to.trim().length > 0 && newTrip.from.length <= 20 && newTrip.to.length <= 20;
  }, [newTrip]);

  return (
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
  );
};

export default TripForm;