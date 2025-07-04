import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

const DayDetails: React.FC<DayDetailsProps> = ({ selectedDay }) => {
  const midLatitude = (selectedDay.startLocation.latitude + selectedDay.finishLocation.latitude) / 2;
  const midLongitude = (selectedDay.startLocation.longitude + selectedDay.finishLocation.longitude) / 2;
  const midCoordinates: [number, number] = [midLatitude, midLongitude];

  const startCoordinates: [number, number] = [selectedDay.startLocation.latitude, selectedDay.startLocation.longitude];
  const finishCoordinates: [number, number] = [selectedDay.finishLocation.latitude, selectedDay.finishLocation.latitude];

  // Custom icons
  const startIcon = createCustomIcon('green');
  const finishIcon = createCustomIcon('red');
  const poiIcon = createCustomIcon('blue');


  return (
    <div className="h-72 w-full rounded overflow-hidden">
      <MapContainer
        center={midCoordinates}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={startCoordinates} icon={startIcon}>
          <Popup>{selectedDay.startLocation.name}</Popup>
        </Marker>
        <Marker position={finishCoordinates} icon={finishIcon}>
          <Popup>{selectedDay.finishLocation.name}</Popup>
        </Marker>
        {selectedDay.placesOfInterest.map((poi, index) => (
          <Marker key={index} position={[poi.latitude, poi.longitude]} icon={poiIcon}>
            <Popup>{poi.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DayDetails;