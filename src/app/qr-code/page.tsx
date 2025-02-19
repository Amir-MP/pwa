'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRCodeScanner() {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('qr-reader');

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      setError('');
      setIsScanning(true);
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setData(decodedText);
          stopScanning();
        },
        () => {} // Ignore failures
      );
    } catch (err) {
      setError('Error accessing camera: ' + (err instanceof Error ? err.message : String(err)));
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setData('');
    setError('');
    startScanning();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
      
      <div className="max-w-md mx-auto">
        <div className="mb-4 relative">
          <div 
            id="qr-reader" 
            className="overflow-hidden rounded-lg bg-gray-100"
            style={{ minHeight: '300px' }}
          />
          
          {!isScanning && !data && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startScanning}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {data && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <h2 className="font-bold mb-2">Scanned Result:</h2>
            <p className="break-all mb-4">{data}</p>
            <button
              onClick={resetScanner}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Scan Another Code
            </button>
          </div>
        )}

        {isScanning && (
          <button
            onClick={stopScanning}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
}