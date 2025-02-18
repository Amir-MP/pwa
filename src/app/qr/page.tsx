'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Page() {
  const [scanResult, setScanResult] = useState<string>('No result');
  const [currentCamera, setCurrentCamera] = useState('environment');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Create scanner instance
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
        defaultDeviceId: currentCamera,
        facingMode: { exact: currentCamera },
      },
      false
    );

    // Define success and error handlers
    const success = (result: string) => {
      setScanResult(result);
      scanner.clear();
    };

    const error = (err: string) => {
      console.warn(err);
    };

    // Start scanning
    scanner.render(success, error);

    // Cleanup
    return () => {
      scanner.clear();
    };
  }, [currentCamera, isClient]);

  const toggleCamera = () => {
    setCurrentCamera(prev => prev === 'environment' ? 'user' : 'environment');
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
      
      <div className="max-w-md mx-auto">
        <button 
          onClick={toggleCamera}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Switch Camera ({currentCamera === 'environment' ? 'Rear' : 'Front'})
        </button>
        <div id="reader"></div>
        <div className="mt-4 p-4 border rounded">
          <p className="font-semibold">Scanned Result:</p>
          <p className="break-all">{scanResult}</p>
        </div>
      </div>
    </div>
  );
}