import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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

interface TripDetailsProps {
  selectedTrip: Trip;
  selectedDay: DayPlan | null;
  setSelectedDay: (day: DayPlan | null) => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({ selectedTrip, selectedDay, setSelectedDay }) => {
  const days: DayPlan[] = selectedTrip.tripPlans.length > 0 ? selectedTrip.tripPlans[0].days : [];

  return (
    <div className="md:w-1/2 p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-2">{selectedTrip.from} to {selectedTrip.to}</h3>
      <div className="space-y-4">
        {days.map((day: DayPlan) => (
          <div
            key={day.id}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => {
              console.log('Clicked day:', day); // Debug click event
              setSelectedDay(day.id === (selectedDay?.id || -1) ? null : day); // Use -1 as default if selectedDay is null
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">
                Day {day.dayNumber}: {day.startLocation.name} to {day.finishLocation.name} ({day.distanceKm.toFixed(1)} km)
              </h4>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${selectedDay && selectedDay.id === day.id ? 'rotate-180' : ''}`}
              />
            </div>
            {selectedDay && selectedDay.id === day.id && (
              <div className="mt-2 space-y-2">
                <p>Introduction: {day.introduction}</p>
                <div>
                  <h5 className="font-medium">Places of Interest:</h5>
                  <ul className="list-disc list-inside">
                    {day.placesOfInterest.map((poi: PlaceOfInterest, index: number) => (
                      <li key={index}>
                        {poi.name}: {poi.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetails;