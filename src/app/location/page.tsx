"use client";

import dynamic from "next/dynamic";

// Import the actual component with SSR disabled completely
const LocationContent = dynamic(
  () => import("../../components/LocationContent"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex flex-col">
        <div className="p-4 bg-gray-800 shadow-md">
          <h1 className="text-2xl font-bold text-center mb-2">موقعیت مکانی</h1>
          <div className="w-full px-4 py-2 bg-gray-500 text-white rounded text-center">
            Loading...
          </div>
        </div>
        <div className="flex-grow bg-gray-700 flex items-center justify-center text-white">
          Loading location services...
        </div>
      </div>
    )
  }
);

// This shell page has minimal client-side logic to avoid hydration issues
export default function LocationPage() {
  return <LocationContent />;
}
