import React from 'react';
import { ChevronDownIcon, MapPinIcon, InformationCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { generateGoogleSearchUrl } from '../utils/googleSearch';
import PDFDownloadButton from './PDFDownloadButton';

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">{selectedTrip.from} to {selectedTrip.to}</h3>
        <PDFDownloadButton 
          trip={{
            id: selectedTrip.id,
            title: `${selectedTrip.from} to ${selectedTrip.to}`,
            description: `A ${selectedTrip.days}-day trip from ${selectedTrip.from} to ${selectedTrip.to} covering ${selectedTrip.distanceKm.toFixed(1)} km.`,
            startDate: selectedTrip.createdAt,
            endDate: selectedTrip.createdAt, // You might want to calculate this based on days
            dayPlans: days
          }}
        />
      </div>
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
              <div className="mt-4 space-y-4">
                <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h6 className="font-semibold text-gray-800 mb-2">Day Overview</h6>
                      <p className="text-gray-700 leading-relaxed">{day.introduction}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Places of Interest
                  </h5>
                  <div className="grid gap-3">
                    {day.placesOfInterest.map((poi: PlaceOfInterest, index: number) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <a
                              href={generateGoogleSearchUrl(poi.name, `${day.startLocation.name} ${day.finishLocation.name}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:text-blue-900 font-semibold text-lg hover:underline transition-colors duration-200 flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MapPinIcon className="h-4 w-4 mr-2 text-blue-600" />
                              {poi.name}
                            </a>
                            <div className="mt-2 flex items-start">
                              <InformationCircleIcon className="h-4 w-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700 text-sm leading-relaxed">{poi.description}</p>
                            </div>
                          </div>
                          <div className="ml-3">
                            <a
                              href={generateGoogleSearchUrl(poi.name, `${day.startLocation.name} ${day.finishLocation.name}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Search
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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