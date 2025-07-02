// src/components/TripForm.tsx
import React from 'react';
import Button from './Button';
import { PlusIcon, MinusIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';

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
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ newTrip, onInputChange, onDaysChange, onRoundTripToggle, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Plan a New Trip</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="from"
          value={newTrip.from}
          onChange={onInputChange}
          placeholder="From"
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="to"
          value={newTrip.to}
          onChange={onInputChange}
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
            onChange={onRoundTripToggle}
            className="hidden"
          />
          <span
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
            onClick={() => onDaysChange(false)}
            className="px-3 py-1 text-white hover:text-indigo-300 focus:outline-none"
          >
            <MinusIcon className="h-5 w-5" />
          </button>
          <span className="flex-1 text-center text-white">{newTrip.days}</span>
          <button
            onClick={() => onDaysChange(true)}
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
                onChange={onInputChange}
                className="mr-2"
              />
              {interest.charAt(0).toUpperCase() + interest.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <Button
        text={loading ? undefined : 'Generate Your Trip Plan'}
        type="submit"
        variant="primary"
        className="mt-4 rounded-full"
        disabled={loading}
        icon={loading ? <CogIcon className="h-5 w-5 animate-spin" /> : undefined}
      />
    </form>
  );
};

export default TripForm;