import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  location: { type: string; coordinates: [number, number] };
  photoUrls: string[];
  aiSummary?: string; // Optional for now
  createdAt: string;
}

const CreateJournalEntry: React.FC = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !token) {
      navigate('/login');
    }
  }, [isLoggedIn, token, navigate]);

  const [entry, setEntry] = useState<JournalEntry>({
    id: Date.now(), // Temporary ID
    title: '',
    content: '',
    location: { type: 'Point', coordinates: [0, 0] },
    photoUrls: [],
    createdAt: new Date().toISOString(),
  });
  const [locationSearch, setLocationSearch] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({ ...entry, title: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationSearch(e.target.value);
    if (e.target.value.toLowerCase().includes('paris')) {
      setEntry({ ...entry, location: { type: 'Point', coordinates: [48.8584, 2.2945] } });
    } else if (e.target.value.toLowerCase().includes('tokyo')) {
      setEntry({ ...entry, location: { type: 'Point', coordinates: [35.6762, 139.6503] } });
    } else {
      setEntry({ ...entry, location: { type: 'Point', coordinates: [0, 0] } });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry({ ...entry, content: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      const newPreviewUrls = newPhotos.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newPhotos = Array.from(e.dataTransfer.files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      const newPreviewUrls = newPhotos.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('New Journal Entry:', entry);
    setEntry({
      id: Date.now(),
      title: '',
      content: '',
      location: { type: 'Point', coordinates: [0, 0] },
      photoUrls: [],
      createdAt: new Date().toISOString(),
    });
    setPhotos([]);
    setPreviewUrls([]);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Create Journal Entry</h2>
            <div className="space-y-6">
              <input
                type="text"
                value={entry.title}
                onChange={handleTitleChange}
                placeholder="Title"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={locationSearch}
                onChange={handleLocationChange}
                placeholder="Search Location (e.g., Paris, Tokyo)"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={entry.content}
                onChange={handleContentChange}
                placeholder="Describe your trip (rich text placeholder)"
                className="w-full h-32 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
                <label className="block text-white mb-4 font-semibold">Upload Photos</label>
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-600 p-6 text-center text-gray-300 hover:border-indigo-500 transition-colors"
                >
                  <p>Drag and drop photos here, or click to select</p>
                  <input
                    type="file"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <button
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    Select Files
                  </button>
                </div>
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="h-24 w-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          onClick={() => {
                            setPhotos(photos.filter((_, i) => i !== index));
                            setPreviewUrls(previewUrls.filter((_, i) => i !== index));
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 focus:outline-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                text="Save Entry"
                onClick={handleSubmit}
                variant="primary"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJournalEntry;