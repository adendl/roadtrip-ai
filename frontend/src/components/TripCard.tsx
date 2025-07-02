// src/components/TripCard.tsx
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

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

interface TripCardProps {
  trip: Trip;
  onSelect: () => void;
  onDelete: (id: number) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onSelect, onDelete }) => {
  return (
    <div
      className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-transform transition-shadow duration-300 cursor-pointer relative"
    >
      <div
        className="flex justify-between items-start"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) {
            onSelect();
          }
        }}
      >
        <div>
          <h3 className="text-xl font-semibold">{trip.from} to {trip.to}</h3>
          <p className="text-gray-300 text-sm">{new Date(trip.createdAt).toLocaleDateString()}</p>
          <p className="text-gray-400 text-sm">Days: {trip.days}, Distance: {trip.distanceKm} km</p>
          <p className="text-gray-400 text-sm">Interests: {trip.interests.join(', ')}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(trip.id);
          }}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TripCard;