import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  location: { type: string; coordinates: [number, number] };
  photoUrl: string;
  aiSummary: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !token) {
      navigate('/login');
    }
  }, [isLoggedIn, token, navigate]);

  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const dummyEntries: JournalEntry[] = [
    {
      id: 1,
      title: 'Paris Adventure',
      content: 'Explored the Eiffel Tower and enjoyed croissants by the Seine.',
      location: { type: 'Point', coordinates: [48.8584, 2.2945] }, // Lat, Long for Paris
      photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      aiSummary: 'A delightful trip with iconic landmarks and French cuisine.',
      createdAt: '2025-06-15T10:00:00Z',
    },
    {
      id: 2,
      title: 'Tokyo Journey',
      content: 'Visited Shibuya Crossing and tasted authentic sushi.',
      location: { type: 'Point', coordinates: [35.6762, 139.6503] }, // Lat, Long for Tokyo
      photoUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      aiSummary: 'A vibrant urban experience with cultural highlights.',
      createdAt: '2025-06-20T14:30:00Z',
    },
    {
      id: 3,
      title: 'New York City Trip',
      content: 'Saw the Statue of Liberty and walked through Central Park.',
      location: { type: 'Point', coordinates: [40.7128, -74.0060] }, // Lat, Long for NYC
      photoUrl: 'https://plus.unsplash.com/premium_photo-1714051660720-888e8454a021?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fit=crop&w=300&q=80',
      aiSummary: 'A bustling city tour with iconic sights.',
      createdAt: '2025-06-25T09:15:00Z',
    },
    {
      id: 4,
      title: 'Sydney Exploration',
      content: 'Visited the Sydney Opera House and surfed at Bondi Beach.',
      location: { type: 'Point', coordinates: [-33.8688, 151.2093] }, // Lat, Long for Sydney
      photoUrl: 'https://images.unsplash.com/photo-1519771356169-4e38ac5e8a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      aiSummary: 'A coastal adventure with architectural marvels.',
      createdAt: '2025-06-28T11:00:00Z',
    },
    {
      id: 5,
      title: 'Rome Getaway',
      content: 'Toured the Colosseum and savored authentic Italian pasta.',
      location: { type: 'Point', coordinates: [41.9028, 12.4964] }, // Lat, Long for Rome
      photoUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      aiSummary: 'A historical journey with delicious cuisine.',
      createdAt: '2025-06-29T13:30:00Z',
    },
    {
      id: 6,
      title: 'London Excursion',
      content: 'Saw Big Ben and explored the British Museum.',
      location: { type: 'Point', coordinates: [51.5074, -0.1278] }, // Lat, Long for London
      photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      aiSummary: 'A cultural trip with iconic landmarks.',
      createdAt: '2025-06-30T09:45:00Z',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              text="Create Journal Entry"
              onClick={() => console.log('Create Journal Entry clicked')}
              variant="primary"
              icon={<PlusIcon className="h-5 w-5" />}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dummyEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                <h3 className="text-xl font-semibold">{entry.title}</h3>
                <p className="text-gray-300 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          {selectedEntry && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">{selectedEntry.title}</h3>
              <p className="text-gray-300 mb-2">Created: {new Date(selectedEntry.createdAt).toLocaleDateString()}</p>
              <p className="mb-2">{selectedEntry.content}</p>
              <p className="text-sm text-gray-400">Location: {selectedEntry.location.coordinates.join(', ')}</p>
              <p className="text-sm text-gray-400">AI Summary: {selectedEntry.aiSummary}</p>
              <img src={selectedEntry.photoUrl} alt={selectedEntry.title} className="mt-4 w-full object-contain max-h-64 rounded" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;