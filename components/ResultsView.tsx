import React from 'react';
import { type Accommodation, type MapSource } from '../types';
import AccommodationCard from './AccommodationCard';
import MapView from './MapView';

interface ResultsViewProps {
  isLoading: boolean;
  error: string | null;
  accommodations: Accommodation[];
  sources: MapSource[];
  userLocation: { latitude: number; longitude: number } | undefined;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
        ))}
    </div>
);


const ResultsView: React.FC<ResultsViewProps> = ({ isLoading, error, accommodations, sources, userLocation }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Oops! Something went wrong.</p>
        <p>{error}</p>
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div className="text-center p-8 bg-blue-100 border border-blue-200 text-blue-800 rounded-lg">
        <p className="font-semibold">Mulai pencarian Anda</p>
        <p>Gunakan formulir di atas untuk menemukan penginapan di area Anda.</p>
      </div>
    );
  }

  return (
    <div>
      {userLocation && (
        <MapView 
            accommodations={accommodations} 
            center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
        />
      )}
      <h2 className="text-xl font-bold mb-4">Hasil Pencarian</h2>
      <div className="space-y-4">
        {accommodations.map((acc, index) => {
           // Simple matching: find a source where the title is a substring of the accommodation name or vice-versa.
           const source = sources.find(s => 
            s.title.toLowerCase().includes(acc.nama.toLowerCase()) || 
            acc.nama.toLowerCase().includes(s.title.toLowerCase())
           );
           return <AccommodationCard key={index} accommodation={acc} sourceUri={source?.uri} />;
        })}
      </div>
      {sources.length > 0 && (
        <div className="mt-8 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-2">Sumber dari Google Maps:</h3>
          <ul className="list-disc list-inside space-y-1">
            {sources.map((source, index) => (
              <li key={index}>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsView;