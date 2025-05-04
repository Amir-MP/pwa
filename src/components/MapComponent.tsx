"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapComponentProps {
  userLocation: [number, number];
  isDefaultLocation?: boolean;
}

export default function MapComponent({ userLocation, isDefaultLocation = false }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
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
    });

    // Add marker for user location
    map.current.on("load", () => {
      addMarkerAndCircle();
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]); // Only initialize the map once

  // This effect handles updating the marker when the location changes
  useEffect(() => {
    if (!map.current || !mapContainer.current) return;
    
    // Update map center when location changes
    map.current.setCenter(userLocation);
    
    // Update the marker and circle
    addMarkerAndCircle();
  }, [userLocation]); // Run when location changes

  const addMarkerAndCircle = () => {
    if (!map.current) return;

    // Remove previous markers and sources if they exist
    const existingMarker = document.querySelector('.maplibregl-marker');
    if (existingMarker) {
      existingMarker.remove();
    }

    if (map.current.getSource('accuracy-circle')) {
      map.current.removeLayer('accuracy-circle');
      map.current.removeSource('accuracy-circle');
    }

    // Add new marker
    const markerColor = isDefaultLocation ? "#FFA500" : "#FF0000"; // Orange for default, Red for actual
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.backgroundColor = markerColor;
    markerElement.style.width = '20px';
    markerElement.style.height = '20px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.border = '2px solid white';
    markerElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

    new maplibregl.Marker({ element: markerElement })
      .setLngLat(userLocation)
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
        paint: {
          "circle-radius": 200, // Fixed radius instead of stops to avoid type errors
          "circle-color": "rgba(66, 135, 245, 0.2)",
          "circle-stroke-color": "rgba(66, 135, 245, 0.8)",
          "circle-stroke-width": 1,
        },
      });
    }
  };

  return (
    <div 
      ref={mapContainer} 
      className="flex-grow" 
      style={{ minHeight: "calc(100vh - 120px)" }}
    />
  );
} 