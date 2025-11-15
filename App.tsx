import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { type SearchCriteria, type Accommodation, type MapSource, type GeolocationState } from './types';
import { searchAccommodations } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsView from './components/ResultsView';

const App: React.FC = () => {
  const [geolocation, setGeolocation] = useState<GeolocationState>({ status: 'loading' });
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [sources, setSources] = useState<MapSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    setGeolocation({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocation({
          status: 'success',
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (err) => {
        setGeolocation({ status: 'error', message: err.message });
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleSearch = async (criteria: SearchCriteria) => {
    if (geolocation.status !== 'success') {
      setError('Location is not available. Please grant permission and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAccommodations([]);
    setSources([]);

    try {
      const response = await searchAccommodations(criteria, geolocation.coords);
      
      const textResponse = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      // Extract JSON from the text response
      const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```|(\[[\s\S]*\])/);
      let parsedAccommodations: Accommodation[] = [];
      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[2];
        try {
          parsedAccommodations = JSON.parse(jsonString);
        } catch (e) {
          console.error("Failed to parse JSON from response:", e);
          setError("Could not read the results from the AI. Please try a different search.");
        }
      } else {
         setError("The AI returned an unexpected format. Please try again.");
      }

      setAccommodations(parsedAccommodations);
      
      const mapSources = groundingChunks
        .filter(chunk => chunk.maps)
        .map(chunk => chunk.maps) as MapSource[];
      setSources(mapSources);

    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data. Please check your connection or API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (geolocation.status) {
      case 'loading':
        return <div className="text-center p-8">Getting your location...</div>;
      case 'error':
        return (
          <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-bold">Location Error</p>
            <p>{geolocation.message}</p>
            <button
              onClick={requestLocation}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        );
      case 'success':
        return (
          <>
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            <ResultsView
              isLoading={isLoading}
              error={error}
              accommodations={accommodations}
              sources={sources}
              userLocation={geolocation.coords}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;