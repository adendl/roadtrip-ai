import React, { useState, useCallback } from 'react';
import { PlusIcon, MinusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { validateTripForm } from '../utils/TripFormValidation';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { INTEREST_TYPES, formatInterestName } from '../utils/constants';

interface Trip {
  id: number;
  from: string;
  to: string;
  roundtrip: boolean;
  days: number;
  interests: string[];
  distanceKm: number;
  createdAt: string;
  tripPlans: any[];
}

interface HomeTripFormProps {
  onTripData: (tripData: Trip) => void;
}

const HomeTripForm: React.FC<HomeTripFormProps> = ({ onTripData }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [roundtrip, setRoundtrip] = useState(false);
  
 
  
  const [tripData, setTripData] = useState<Trip>({
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setTripData((prev) => {
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
    setTripData((prev) => ({
      ...prev,
      days: Math.max(1, prev.days + (increment ? 1 : -1)),
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Create the final trip data with the current roundtrip state
    const finalTripData = { ...tripData, roundtrip };

    const { isValid, errors } = validateTripForm(finalTripData);
    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    // Always pass the trip data to parent component
    // The parent component will handle the flow based on login status
    onTripData(finalTripData);
  }, [tripData, roundtrip, onTripData]);

  const isFormValid = useCallback(() => {
    return tripData.from.trim().length > 0 && tripData.to.trim().length > 0 && tripData.from.length <= 20 && tripData.to.length <= 20;
  }, [tripData]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white border-opacity-30 max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="from"
          value={tripData.from}
          onChange={handleInputChange}
          placeholder="From"
          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-white border-opacity-50 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto shadow-sm backdrop-blur-sm"
        />
        <input
          type="text"
          name="to"
          value={tripData.to}
          onChange={handleInputChange}
          placeholder="To"
          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-white border-opacity-50 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto shadow-sm backdrop-blur-sm"
        />
      </div>

      {validationErrors.length > 0 && (
        <div className="text-red-200 text-sm mb-4 text-center bg-red-900 bg-opacity-50 p-3 rounded-lg">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => {
            console.log('Round trip button clicked, current state:', roundtrip);
            setRoundtrip(!roundtrip);
          }}
          className="flex items-center bg-transparent border-none cursor-pointer"
        >
          <div 
            className={`h-6 w-6 flex items-center justify-center border rounded-full transition-all duration-200 ${
              roundtrip 
                ? 'bg-blue-600 border-blue-600' 
                : 'bg-white bg-opacity-90 border-white border-opacity-50'
            }`}
            style={{ 
              minWidth: '24px', 
              minHeight: '24px',
              backgroundColor: roundtrip ? '#2563eb' : 'rgba(255, 255, 255, 0.9)',
              borderColor: roundtrip ? '#2563eb' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            {roundtrip && <CheckIcon className="h-4 w-4 text-white" />}
          </div>
          <span className="ml-2 text-white font-medium drop-shadow-sm hover:text-blue-200 transition-colors duration-200">
            Round Trip
          </span>
        </button>
      </div>

      <div className="mb-6">
        <label className="block mb-3 text-white font-medium drop-shadow-sm text-left">Number of Days</label>
        <div className="flex items-center bg-white bg-opacity-90 border border-white border-opacity-50 rounded-full p-2 w-40">
          <button
            type="button"
            onClick={() => handleDaysChange(false)}
            className="px-3 py-1 text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            <MinusIcon className="h-5 w-5" />
          </button>
          <span className="flex-1 text-center text-gray-800 font-medium">{tripData.days}</span>
          <button
            type="button"
            onClick={() => handleDaysChange(true)}
            className="px-3 py-1 text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <label className="block mb-3 text-white font-medium drop-shadow-sm text-left">Interests</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INTEREST_TYPES.map((interest) => (
            <label key={interest} className="flex items-center bg-white bg-opacity-20 rounded-lg p-2 hover:bg-opacity-30 transition-all duration-200">
              <input
                type="checkbox"
                name="interests"
                value={interest}
                checked={tripData.interests.includes(interest)}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-white font-medium drop-shadow-sm text-sm">
                {formatInterestName(interest)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={!isFormValid()}
          className="px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-roboto"
        >
          {isLoggedIn ? 'Generate Your Trip Plan' : 'Get Started'}
        </button>
        {!isLoggedIn && (
          <p className="text-sm text-white text-opacity-80 mt-3 drop-shadow-sm">
            You'll be redirected to sign up to complete your trip planning
          </p>
        )}
      </div>
    </form>
  );
};

export default HomeTripForm; 