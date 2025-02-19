"use client";

import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function Page() {
  const [scanResult, setScanResult] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            QR Code Scanner
          </h1>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20">
            {!isScanning && !scanResult && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg 
                    className="w-24 h-24 mx-auto text-blue-500 mb-4 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p className="text-gray-300 mb-8">Ready to scan QR codes</p>
                </div>
                <button
                  onClick={() => setIsScanning(true)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Start Scanning
                </button>
              </div>
            )}

            {isScanning && (
              <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                <div className="aspect-square">
                  <Scanner
                    onScan={(result) => {
                      setScanResult(result);
                      setIsScanning(false);
                    }}
                    onError={(error) => console.log(error)}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
                {/* Enhanced scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Corner markers for scanning area */}
                  <div className="relative w-72 h-72">
                    {/* Top-left corner */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
                    {/* Top-right corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
                    {/* Bottom-left corner */}
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
                    {/* Bottom-right corner */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" />
                    
                    {/* Scanning line animation */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                  
                  {/* Dark overlay outside scanning area */}
                  <div className="absolute inset-0" style={{
                    background: `radial-gradient(circle at center, transparent 130px, rgba(0, 0, 0, 0.8) 130px)`
                  }} />
                  
                  {/* Scanning instructions */}
                  <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm font-medium">
                    <p className="bg-black/50 mx-auto max-w-[250px] rounded-full px-4 py-2 backdrop-blur-sm">
                      Position QR code within frame
                    </p>
                  </div>
                </div>

                {/* Stop scanning button */}
                <button
                  onClick={() => setIsScanning(false)}
                  className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {scanResult && (
              <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <h2 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Scan Result
                </h2>
                <div className="bg-white/5 p-4 rounded-lg break-all text-gray-100 border border-white/10 mb-6">
                  {scanResult}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setScanResult("");
                      setIsScanning(true);
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
                  >
                    Scan Again
                  </button>
                  <button
                    onClick={() => {
                      setScanResult("");
                      setIsScanning(false);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}