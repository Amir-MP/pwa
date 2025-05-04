"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component itself
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex-grow bg-gray-700 flex items-center justify-center">
      Loading map...
    </div>
  ),
});

// Default fallback coordinates (can be used when geolocation fails)
const DEFAULT_LOCATION: [number, number] = [51.5074, -0.1278]; // London coordinates as fallback

// Iran coordinates - may be more relevant based on your UI language
const IRAN_LOCATION: [number, number] = [35.6892, 51.389]; // Tehran coordinates

export default function LocationContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
  const [useDefaultLocation, setUseDefaultLocation] = useState<boolean>(false);
  const [geoPermissionStatus, setGeoPermissionStatus] =
    useState<string>("unknown");
  const [retryCount, setRetryCount] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<string>("");

  // Get basic device and browser information for debugging
  useEffect(() => {
    if (typeof window !== "undefined") {
      const browser = detectBrowser();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setDeviceInfo(`${browser} on ${isMobile ? "Mobile" : "Desktop"}`);
    }
  }, []);

  // Detect browser type for debugging
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Safari") > -1) return "Safari";
    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1)
      return "IE";
    if (userAgent.indexOf("Edge") > -1) return "Edge";
    return "Unknown";
  };

  // Try to get location via IP (fallback method)
  const getLocationViaIP = async () => {
    try {
      setDebugInfo("Trying to get location via IP...");

      // Use a free IP geolocation API
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data && data.longitude && data.latitude) {
        setUserLocation([data.longitude, data.latitude]);
        setDebugInfo(
          `IP-based location: ${data.longitude.toFixed(
            6
          )}, ${data.latitude.toFixed(6)}`
        );
        setLoading(false);
        return true;
      }

      setDebugInfo("IP-based location failed");
      return false;
    } catch (err) {
      console.error("Error getting location via IP:", err);
      setDebugInfo(`IP location error: ${err.message}`);
      return false;
    }
  };

  // Check for geolocation permissions
  const checkGeoPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        setGeoPermissionStatus(result.state);
        setDebugInfo(`Geolocation permission status: ${result.state}`);

        // Listen for changes to permission
        result.addEventListener("change", () => {
          setGeoPermissionStatus(result.state);
          setDebugInfo(`Geolocation permission changed to: ${result.state}`);
          if (result.state === "granted") {
            getUserLocation();
          }
        });

        return result.state;
      }
      return "unknown";
    } catch (err) {
      console.error("Error checking geolocation permission:", err);
      setDebugInfo(`Error checking permission: ${err.message}`);
      return "unknown";
    }
  };

  // Get user's location using different methods
  const getUserLocation = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo("Checking for geolocation support");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setDebugInfo("Geolocation not supported");
      setLoading(false);

      // Try IP-based location as fallback
      const gotIPLocation = await getLocationViaIP();
      if (!gotIPLocation) {
        setUseDefaultLocation(true);
      }
      return;
    }

    setDebugInfo(`Requesting user location (attempt: ${retryCount + 1})...`);
    setRetryCount((prev) => prev + 1);

    // Try to get high accuracy location first with a shorter timeout
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setDebugInfo(`${longitude.toFixed(6)}, ${latitude.toFixed(6)}`);
        setLoading(false);
      },
      // Error callback - we'll handle specific error types
      (error) => {
        handleGeolocationError(error);
      },
      // Options - try high accuracy first with shorter timeout
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle different geolocation errors
  const handleGeolocationError = async (error) => {
    let errorMessage = "Unknown error";
    let shouldTryLowAccuracy = false;

    // Handle specific geolocation errors
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        errorMessage = "Location permission denied";
        break;
      case 2: // POSITION_UNAVAILABLE
        errorMessage = "Location information unavailable";
        shouldTryLowAccuracy = true;
        break;
      case 3: // TIMEOUT
        errorMessage = "Location request timed out";
        shouldTryLowAccuracy = true;
        break;
    }

    setDebugInfo(
      `Geolocation error: (${error.code}) ${errorMessage} - ${error.message}`
    );

    // Add more technical details for debugging
    const technicalDetails = [];
    if (error.code === 2) {
      // POSITION_UNAVAILABLE
      if (typeof window !== "undefined") {
        technicalDetails.push(`Browser: ${navigator.userAgent}`);
        technicalDetails.push(`Platform: ${navigator.platform}`);

        if ("connection" in navigator) {
          // @ts-ignore
          const connectionType =
          // @ts-ignore
            navigator.connection?.effectiveType || "unknown";
          // @ts-ignore
          const isOnline = navigator.onLine;
          technicalDetails.push(
            `Network: ${connectionType}, Online: ${isOnline}`
          );
        }
      }

      console.log("Technical details:", technicalDetails.join("; "));
    }

    // Try again with low accuracy if it was a timeout or unavailable error
    if (shouldTryLowAccuracy && retryCount < 2) {
      setDebugInfo("Trying again with low accuracy...");

      // Try with low accuracy and longer timeout as fallback
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setDebugInfo(
            `Low accuracy location: ${longitude.toFixed(6)}, ${latitude.toFixed(
              6
            )}`
          );
          setLoading(false);
        },
        async (lowAccError) => {
          // If this fails too, try IP-based location
          setDebugInfo(`Low accuracy also failed: (${lowAccError.code})`);

          // Try IP-based location as a last resort
          const gotIPLocation = await getLocationViaIP();

          if (!gotIPLocation) {
            // If IP-based location fails, show the error and suggest default location
            setError(`Error getting location: ${errorMessage}`);
            setLoading(false);
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 60000, // Accept a cached position up to 1 minute old
        }
      );
    } else {
      // If we've already retried or it's a permission error, try IP geolocation
      const gotIPLocation = await getLocationViaIP();

      if (!gotIPLocation) {
        // If IP-based location fails, show the error
        setError(`Error getting location: ${errorMessage}`);
        setLoading(false);
      }
    }
  };

  // Initialize on mount
  useEffect(() => {
    const initGeolocation = async () => {
      const permissionStatus = await checkGeoPermission();
      if (permissionStatus !== "denied") {
        getUserLocation();
      }
    };

    initGeolocation();
  }, []);

  const handleRefreshLocation = () => {
    setUseDefaultLocation(false);
    setRetryCount(0);
    getUserLocation();
  };

  const handleUseDefaultLocation = () => {
    // Use Iranian location instead of London if that's more relevant
    setUserLocation(IRAN_LOCATION);
    setUseDefaultLocation(true);
    setDebugInfo("Using default location (Tehran, Iran)");
  };

  const displayedLocation =
    userLocation || (useDefaultLocation ? IRAN_LOCATION : null);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">موقعیت مکانی</h1>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <div className="text-gray-400 text-sm mb-2 text-center">
          {debugInfo}
        </div>
        <div className="flex space-x-2 flex-row-reverse">
          <button
            onClick={handleRefreshLocation}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? "در حال بارگذاری..." : "بروزرسانی موقعیت"}
          </button>

          {(!userLocation || error) && !loading && (
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
        <MapComponent
          userLocation={displayedLocation}
          isDefaultLocation={useDefaultLocation}
        />
      ) : (
        <div className="flex-grow bg-gray-700 flex flex-col items-center justify-center p-4">
          <div className="text-white text-center mb-4 text-lg">
            {loading ? "Getting location..." : "No location data available"}
          </div>
          <div className="text-gray-400 text-sm text-center max-w-md"></div>
        </div>
      )}
    </div>
  );
}
