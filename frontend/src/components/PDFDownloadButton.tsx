import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { generateTripPDF } from '../utils/pdfGenerator';

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

interface Trip {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  dayPlans: DayPlan[];
}

interface PDFDownloadButtonProps {
  trip: Trip;
  className?: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ trip, className = '' }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      await generateTripPDF(trip);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`inline-flex items-center px-6 py-2 text-lg font-medium bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
      {isGenerating ? 'Generating PDF...' : 'Download Trip PDF'}
    </button>
  );
};

export default PDFDownloadButton; 