'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

export default function Page() {
  const [scanResult, setScanResult] = useState<string>('');
  const [currentCamera, setCurrentCamera] = useState('environment');
  const [isClient, setIsClient] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Request camera permission on component mount
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      // Stop the stream since we only needed it for permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera permission denied:', error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    if (!isClient || !isScanning || !hasPermission) return;

    let html5QrcodeScanner: Html5QrcodeScanner | null = null;

    const initializeScanner = async () => {
      try {
        // Create scanner instance
        html5QrcodeScanner = new Html5QrcodeScanner(
          "reader",
          {
            qrbox: {
              width: 250,
              height: 250,
            },
            fps: 5,
            videoConstraints: {
              facingMode: { exact: currentCamera }
            },
            showTorchButtonIfSupported: true, // Show torch button if device supports it
            aspectRatio: 1, // Square aspect ratio for better scanning
          },
          false
        );

        // Define success and error handlers
        const success = (result: string) => {
          setScanResult(result);
          setIsScanning(false);
          html5QrcodeScanner?.clear();
        };

        const error = (err: string) => {
          // Only log errors that aren't related to normal scanning process
          if (!err.includes('No QR code found')) {
            console.warn(err);
          }
        };

        // Start scanning
        await html5QrcodeScanner.render(success, error);
      } catch (err) {
        console.error('Failed to initialize scanner:', err);
      }
    };

    initializeScanner();

    // Cleanup
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(console.error);
      }
    };
  }, [currentCamera, isClient, isScanning, hasPermission]);

  const toggleCamera = () => {
    setCurrentCamera(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const toggleScanning = () => {
    setIsScanning(prev => !prev);
    setScanResult('');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Camera Permission Required</h2>
          <p className="mb-4 text-gray-600">Please allow camera access to scan QR codes.</p>
          <button
            onClick={requestCameraPermission}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Grant Camera Permission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">QR Scanner</h1>
          
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              <button 
                onClick={toggleCamera}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                Switch Camera ({currentCamera === 'environment' ? 'Rear' : 'Front'})
              </button>

              {!isScanning && (
                <button 
                  onClick={toggleScanning}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Scan Again
                </button>
              )}
            </div>

            <div className="relative">
              <div id="reader" className="overflow-hidden rounded-lg"></div>
              {!isScanning && scanResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h2 className="font-semibold text-green-800 mb-2">Scanned Successfully!</h2>
                  <p className="break-all text-green-700">{scanResult}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}