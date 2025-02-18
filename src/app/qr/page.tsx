'use client';

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Page() {
  const [scanResult, setScanResult] = useState<string>('No result');

  useEffect(() => {
    // Create scanner instance
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
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
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
      
      <div className="max-w-md mx-auto">
        <div id="reader"></div>
        <div className="mt-4 p-4 border rounded">
          <p className="font-semibold">Scanned Result:</p>
          <p className="break-all">{scanResult}</p>
        </div>
      </div>
    </div>
  );
}
