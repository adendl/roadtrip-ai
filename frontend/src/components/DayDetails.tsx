// src/components/DayDetails.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface DayDetails {
  dayNumber: number;
  start: string;
  end: string;
  distanceKm: number;
  coordinates: [number, number];
}

interface DayDetailsProps {
  selectedDay: DayDetails;
}

const DayDetails: React.FC<DayDetailsProps> = ({ selectedDay }) => {
  return (
    <div className="h-72 w-full mb-4 rounded overflow-hidden">
      <MapContainer
        center={selectedDay.coordinates}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={selectedDay.coordinates}>
          <Popup>Day {selectedDay.dayNumber} Midpoint</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DayDetails;