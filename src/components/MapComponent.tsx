"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapComponentProps {
  userLocation: [number, number];
  isDefaultLocation?: boolean;
}

export default function MapComponent({
  userLocation,
  isDefaultLocation = false,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Validate coordinates to ensure they're valid numbers
  const isValidCoordinate = (coord: [number, number]): boolean => {
    if (!coord || coord.length !== 2) return false;
    const [lng, lat] = coord;
    return (
      !isNaN(lng) &&
      !isNaN(lat) &&
      lng >= -180 &&
      lng <= 180 &&
      lat >= -90 &&
      lat <= 90
    );
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Validate coordinates first
    if (!isValidCoordinate(userLocation)) {
      setMapError(
        `Invalid coordinates: ${userLocation}. Using default location.`
      );
      return;
    }

    try {
      // Initialize map with error handling
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap Contributors",
              maxzoom: 19,
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 20,
            },
          ],
        },
        center: userLocation,
        zoom: 14,
        trackResize: true,
        attributionControl: false, // Set to false and add it manually
      });

      // Add map controls
      map.current.addControl(
        new maplibregl.AttributionControl(),
        "bottom-left"
      );
      map.current.addControl(new maplibregl.NavigationControl(), "top-right");
      map.current.addControl(new maplibregl.ScaleControl(), "bottom-right");

      // Handle map errors
      map.current.on("error", (e) => {
        console.error("Map error:", e.error);
        setMapError("Error loading map. Please try refreshing the page.");
      });

      // Add marker for user location when map is ready
      map.current.on("load", () => {
        setMapLoaded(true);
        addMarkerAndCircle();
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(
        "Could not initialize map. Please check if WebGL is enabled in your browser."
      );
    }

    // Cleanup
    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
        map.current = null;
      }
    };
  }, []); // Initialize map only once

  // This effect handles updating the marker when the location changes
  useEffect(() => {
    if (!map.current || !mapContainer.current) return;

    try {
      // Update map center when location changes
      map.current.setCenter(userLocation);

      // Update the marker and circle
      addMarkerAndCircle();
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }, [userLocation]); // Run when location changes

  const addMarkerAndCircle = () => {
    if (!map.current) return;

    try {
      // Remove previous markers and sources if they exist
      const existingMarkers = document.querySelectorAll(".maplibregl-marker");
      existingMarkers.forEach((marker) => marker.remove());

      if (map.current.getSource("accuracy-circle")) {
        map.current.removeLayer("accuracy-circle");
        map.current.removeSource("accuracy-circle");
      }

      // Add new marker
      const markerColor = isDefaultLocation ? "#FFA500" : "#FF0000"; // Orange for default, Red for actual
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.style.backgroundColor = markerColor;
      markerElement.style.width = "20px";
      markerElement.style.height = "20px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.border = "2px solid white";
      markerElement.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

      // Add a popup to the marker
      const popup = new maplibregl.Popup({ closeButton: false })
        .setHTML(`<div style="padding:5px;">
          <strong>${
            isDefaultLocation ? "Default Location" : "Your Location"
          }</strong>
          <br>
          ${userLocation[1].toFixed(6)}, ${userLocation[0].toFixed(6)}
        </div>`);

      new maplibregl.Marker({ element: markerElement })
        .setLngLat(userLocation)
        .setPopup(popup)
        .addTo(map.current);

      // Add accuracy circle if it's not the default location
      if (!isDefaultLocation) {
        // We'll create a circle with an arbitrary radius that looks good on the map
        map.current.addSource("accuracy-circle", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: userLocation,
            },
            properties: {},
          },
        });

        map.current.addLayer({
          id: "accuracy-circle",
          type: "circle",
          source: "accuracy-circle",
        });
      }

      // Add a 'You are here' label
      const labelEl = document.createElement("div");
      labelEl.className = "location-label maplibregl-marker";
      labelEl.style.backgroundColor = "rgba(0,0,0,0.7)";
      labelEl.style.color = "white";
      labelEl.style.padding = "4px 8px";
      labelEl.style.borderRadius = "4px";
      labelEl.style.fontSize = "12px";
      labelEl.style.pointerEvents = "none";
      labelEl.style.transform = "translate(-50%, -150%)";

      new maplibregl.Marker({ element: labelEl })
        .setLngLat(userLocation)
        .addTo(map.current);
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  };

  // If there's a map error, show it
  if (mapError) {
    return (
      <div className="flex-grow bg-gray-700 flex items-center justify-center text-center p-4">
        <div className="bg-red-800 p-4 rounded-lg max-w-md">
          <h3 className="text-white text-lg mb-2">Map Error</h3>
          <p className="text-gray-200">{mapError}</p>
          <div className="text-gray-300 text-sm mt-4">
            <p className="mb-2">Troubleshooting tips:</p>
            <ul className="text-left list-disc list-inside">
              <li>Check your internet connection</li>
              <li>Try a different browser (Chrome or Firefox recommended)</li>
              <li>Enable WebGL in your browser settings</li>
              <li>Update your browser to the latest version</li>
              <li>Disable VPN or proxy services</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="flex-grow relative"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="text-white text-center">
            <div className="mb-2">Loading map...</div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}
