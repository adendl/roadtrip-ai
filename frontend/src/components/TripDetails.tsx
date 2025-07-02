// src/components/TripDetails.tsx
import React from 'react';

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

interface TripDetailsProps {
  selectedTrip: Trip;
  selectedDay: DayDetails | null;
  setSelectedDay: (day: DayDetails | null) => void;
  getTripDays: (trip: Trip) => DayDetails[];
}

const TripDetails: React.FC<TripDetailsProps> = ({ selectedTrip, selectedDay, setSelectedDay, getTripDays }) => {
  return (
    <div className="md:w-1/2 p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-2">{selectedTrip.from} to {selectedTrip.to}</h3>
      <div className="space-y-4">
        {getTripDays(selectedTrip).map((day) => (
          <div
            key={day.dayNumber}
            className="p-4 bg-gray-800 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30"
            onClick={() => setSelectedDay(day.dayNumber === (selectedDay?.dayNumber || 0) ? null : day)}
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
  );
};

export default TripDetails;