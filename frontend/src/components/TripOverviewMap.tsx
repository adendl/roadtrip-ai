import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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

interface TripOverviewMapProps {
  dayPlans: DayPlan[];
  tripTitle: string;
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

const TripOverviewMap: React.FC<TripOverviewMapProps> = ({ dayPlans, tripTitle }) => {
  // Calculate the center point of the entire trip
  const allCoordinates = dayPlans.flatMap(day => [
    [day.startLocation.latitude, day.startLocation.longitude],
    [day.finishLocation.latitude, day.finishLocation.longitude]
  ]);
  
  const avgLat = allCoordinates.reduce((sum, coord) => sum + coord[0], 0) / allCoordinates.length;
  const avgLng = allCoordinates.reduce((sum, coord) => sum + coord[1], 0) / allCoordinates.length;
  const centerCoordinates: [number, number] = [avgLat, avgLng];

  // Create markers for each day
  const dayMarkers = dayPlans.map((day, index) => {
    const startCoordinates: [number, number] = [day.startLocation.latitude, day.startLocation.longitude];
    const finishCoordinates: [number, number] = [day.finishLocation.latitude, day.finishLocation.longitude];
    
    // Different colors for different days
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
    const color = colors[index % colors.length];
    const dayIcon = createCustomIcon(color, 16);

    return (
      <React.Fragment key={day.id}>
        {/* Start location marker */}
        <Marker position={startCoordinates} icon={dayIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">Day {day.dayNumber} - Start</h3>
              <p className="font-semibold text-blue-700">{day.startLocation.name}</p>
              <p className="text-sm text-gray-600 mt-1">Distance: {day.distanceKm} km</p>
            </div>
          </Popup>
        </Marker>
        
        {/* End location marker */}
        <Marker position={finishCoordinates} icon={dayIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">Day {day.dayNumber} - End</h3>
              <p className="font-semibold text-blue-700">{day.finishLocation.name}</p>
              <p className="text-sm text-gray-600 mt-1">Distance: {day.distanceKm} km</p>
            </div>
          </Popup>
        </Marker>
      </React.Fragment>
    );
  });

  return (
    <div className="w-full h-full rounded overflow-hidden relative z-0">
      <MapContainer
        center={centerCoordinates}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Day markers */}
        {dayMarkers}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Trip Overview Map
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm mr-2"></div>
            <span className="text-sm text-gray-600">Day Markers</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Click on markers to see day details
        </div>
      </div>
    </div>
  );
};

export default TripOverviewMap; 