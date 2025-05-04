"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component itself
const MapComponent = dynamic(
  () => import("./MapComponent"),
  { 
    ssr: false, 
    loading: () => <div className="flex-grow bg-gray-700 flex items-center justify-center">Loading map...</div> 
  }
);

// Default fallback coordinates (can be used when geolocation fails)
const DEFAULT_LOCATION: [number, number] = [51.5074, -0.1278]; // London coordinates as fallback

export default function LocationContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
  const [useDefaultLocation, setUseDefaultLocation] = useState<boolean>(false);

  // Get user's location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setDebugInfo("Checking for geolocation support");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setDebugInfo("Geolocation not supported");
      setUseDefaultLocation(true);
      setLoading(false);
      return;
    }

    setDebugInfo("Requesting user location...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setDebugInfo(`Location received: ${longitude.toFixed(6)}, ${latitude.toFixed(6)}`);
        setLoading(false);
      },
      (error) => {
        let errorMessage = "Unknown error";
        
        // Handle specific geolocation errors
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location permission denied";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Location information unavailable";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out";
            break;
        }
        
        setError(`Error getting location: ${errorMessage}`);
        setDebugInfo(`Geolocation error: (${error.code}) ${errorMessage}`);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 0 
      }
    );
  };

  // Initialize on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const handleRefreshLocation = () => {
    setUseDefaultLocation(false);
    getUserLocation();
  };

  const handleUseDefaultLocation = () => {
    setUserLocation(DEFAULT_LOCATION);
    setUseDefaultLocation(true);
    setDebugInfo("Using default location (London, UK)");
  };

  const displayedLocation = userLocation || (useDefaultLocation ? DEFAULT_LOCATION : null);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">موقعیت مکانی</h1>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <div className="text-gray-400 text-sm mb-2 text-center">{debugInfo}</div>
        <div className="flex space-x-2 flex-row-reverse">
          <button
            onClick={handleRefreshLocation}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? "در حال بارگذاری..." : "بروزرسانی موقعیت"}
          </button>
          
          {!userLocation && !loading && (
            <button
              onClick={handleUseDefaultLocation}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              استفاده از مکان پیش‌فرض
            </button>
          )}
        </div>
      </div>
      
      {displayedLocation ? (
        <MapComponent userLocation={displayedLocation} isDefaultLocation={useDefaultLocation} />
      ) : (
        <div className="flex-grow bg-gray-700 flex flex-col items-center justify-center p-4">
          <div className="text-white text-center mb-4">
            {loading ? "Getting location..." : "No location data available"}
          </div>
          <div className="text-gray-400 text-sm text-center max-w-md">
            {!loading && !error && (
              <div>
                <p className="mb-2">Please ensure that:</p>
                <ul className="list-disc list-inside text-left">
                  <li>You've allowed location access in your browser</li>
                  <li>Your device has GPS or network location enabled</li>
                  <li>You're not using a VPN that might mask your location</li>
                </ul>
                <p className="mt-2">Click the "بروزرسانی موقعیت" button to try again, or use the default location.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 