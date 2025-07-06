import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { generateGoogleSearchUrl, openBookingSearch } from '../utils/googleSearch';
import { fetchDrivingRoute } from '../utils/routeService';

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

interface DayDetailsProps {
  selectedDay: DayPlan;
}

// Custom icons for different marker types
const createCustomIcon = (color: string, size: number = 12) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

const DayDetails: React.FC<DayDetailsProps> = ({ selectedDay }) => {
  const midLatitude = (selectedDay.startLocation.latitude + selectedDay.finishLocation.latitude) / 2;
  const midLongitude = (selectedDay.startLocation.longitude + selectedDay.finishLocation.longitude) / 2;
  const midCoordinates: [number, number] = [midLatitude, midLongitude];

  const startCoordinates: [number, number] = [selectedDay.startLocation.latitude, selectedDay.startLocation.longitude];
  const finishCoordinates: [number, number] = [selectedDay.finishLocation.latitude, selectedDay.finishLocation.longitude];

  // Custom icons - larger for start/end, smaller for places of interest
  const startIcon = createCustomIcon('#10B981', 20); // Green, larger
  const finishIcon = createCustomIcon('#EF4444', 20); // Red, larger
  const poiIcon = createCustomIcon('#3B82F6', 10); // Blue, smaller

  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const route = await fetchDrivingRoute(
          { latitude: selectedDay.startLocation.latitude, longitude: selectedDay.startLocation.longitude },
          { latitude: selectedDay.finishLocation.latitude, longitude: selectedDay.finishLocation.longitude }
        );
        setRouteCoordinates(route);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching route:', error);
        setLoading(false);
      }
    };

    fetchRoute();
  }, [selectedDay.startLocation.latitude, selectedDay.startLocation.longitude, selectedDay.finishLocation.latitude, selectedDay.finishLocation.longitude]);

  return (
    <div className="w-full h-full rounded overflow-hidden relative z-0">
      <MapContainer
        center={midCoordinates}
        zoom={7}
        style={{ height: '50%', width: '100%' }}
        className="w-full"
        id={`map-day-${selectedDay.dayNumber}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Route line between start and end */}
        <Polyline
          positions={routeCoordinates.length > 0 ? routeCoordinates : [startCoordinates, finishCoordinates]}
          color="#3B82F6"
          weight={3}
          opacity={0.8}
          dashArray={routeCoordinates.length > 0 ? undefined : "10, 5"}
        />
        
        <Marker position={startCoordinates} icon={startIcon}>
          <Popup>{selectedDay.startLocation.name}</Popup>
        </Marker>
        <Marker position={finishCoordinates} icon={finishIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">Day {selectedDay.dayNumber} - End</h3>
              <p className="font-semibold text-blue-700 mb-2">{selectedDay.finishLocation.name}</p>
              <p className="text-sm text-gray-600 mb-3">Distance: {selectedDay.distanceKm} km</p>
              <button
                onClick={() => openBookingSearch(selectedDay.finishLocation.name)}
                className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Search Accommodation
              </button>
            </div>
          </Popup>
        </Marker>
        {selectedDay.placesOfInterest.map((poi, index) => (
          <Marker key={index} position={[poi.latitude, poi.longitude]} icon={poiIcon}>
            <Popup>
              <div className="min-w-[200px]">
                <a
                  href={generateGoogleSearchUrl(poi.name, `${selectedDay.startLocation.name} ${selectedDay.finishLocation.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 font-semibold text-base hover:underline transition-colors duration-200 block mb-2"
                >
                  {poi.name}
                </a>
                <p className="text-sm text-gray-600 leading-relaxed">{poi.description}</p>
                <div className="mt-2">
                  <a
                    href={generateGoogleSearchUrl(poi.name, `${selectedDay.startLocation.name} ${selectedDay.finishLocation.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                  >
                    Search on Google
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Map Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm mr-2"></div>
            <span className="text-sm text-gray-600">Start Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-sm mr-2"></div>
            <span className="text-sm text-gray-600">End Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm mr-2"></div>
            <span className="text-sm text-gray-600">Places of Interest</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-blue-500 border-dashed border-blue-500 mr-2" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-sm text-gray-600">Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetails;