import React from 'react';
import Button from '../components/Button';
import Hero from '../components/Hero';
import Header from '../components/Header';
import Card from '../components/Card'; // Import the new Card component
import { CommandLineIcon } from '@heroicons/react/24/solid';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <Hero
            title="Welcome to Travel Journal AI"
            description="Capture your travel adventures with ease. Create digital journals, add photos and videos, get AI-powered insights, and share your stories with the world."
          />
          <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:space-x-6">
            <Button
              text="Get Started"
              onClick={() => window.location.href = '/signup'}
              variant="primary"
            />
            <Button
              text="Login"
              onClick={() => window.location.href = '/login'}
              variant="secondary"
            />
          </div>

          {/* Features Cards Section */}
          <section id="features" className="mt-16 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {/* Card 1: User Authentication */}
              <Card
                title="User Authentication"
                description="Secure registration, login, and profile management with JWT-based authentication."
                imageUrl="https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="User Authentication"
              />

              {/* Card 2: Journal Entries */}
              <Card
                title="Journal Entries"
                description="Create, edit, and delete entries with text, photos, and videos tied to locations."
                imageUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="Journal Entries"
              />

              {/* Card 3: AI Insights */}
              <Card
                title="AI Insights"
                description="AI-powered summaries, key moment highlights, and caption suggestions."
                imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="AI Insights"
              />

              {/* Card 4: Map Integration */}
              <Card
                title="Map Integration"
                description="Visualise trips and journal entries on an interactive map."
                imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                altText="Map Integration"
              />

              {/* Card 5: Sharing Options */}
              <Card
                title="Sharing Options"
                description="Share entries publicly or privately with shareable links."
                imageUrl="https://images.unsplash.com/photo-1750801321932-3d3e3fcdfdcd?q=80&w=1740&auto=format&fit=crop&w=300&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                altText="Sharing Options"
              />

              {/* Card 6: Media Uploads */}
              <Card
                title="Media Uploads"
                description="Upload and manage photos and videos for your journal entries."
                imageUrl="https://images.unsplash.com/photo-1629904888780-8de0c7aeed28?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=300&q=80"
                altText="Media Uploads"
              />
            </div>
          </section>
        </div>
      </main>
{/* Footer with GitHub Link */}
      <footer className="w-full py-6 bg-gray-800 bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>Read Source Code on GitHub</p>
          <a
            href="https://github.com/adendl/traveljournal-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent font-semibold text-lg hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 px-4 py-2 rounded-full shadow-md hover:shadow-lg"
          >
            <CommandLineIcon className="h-6 w-6 mr-2 text-black" /> {/* Updated icon */}
            https://github.com/adendl/traveljournal-ai
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;