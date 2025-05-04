"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRCodeScanner() {
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      setError("");
      setIsScanning(true);

      try {
        await scannerRef.current.start(
          { facingMode: { exact: "environment" } },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            setData(decodedText);
            stopScanning();
          },
          () => {} 
        );
      } catch {
        await scannerRef.current.start(
          { facingMode: "user" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            setData(decodedText);
            stopScanning();
          },
          () => {}
        );
      }
    } catch (err) {
      setError(
        "Error accessing camera: " +
          (err instanceof Error ? err.message : String(err))
      );
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
    setData("");
    setError("");
    startScanning();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !scannerRef.current) return;

    try {
      setError("");
      const result = await scannerRef.current.scanFile(
        file,
       false
      );
      setData(result);
    } catch (err) {
      setError(
        "Error reading QR code from image: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-10 rounded-xl shadow-lg max-w-sm w-full backdrop-blur-md bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-center mb-6">اسکنر QR Code</h1>

        <div
          id="qr-reader"
          className="overflow-hidden rounded-lg bg-gray-100"
          style={{ minHeight: "300px" }}
        />

        {!isScanning && !data && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <button
              onClick={startScanning}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              شروع اسکن
            </button>

            <div className="text-center ">
              <label className="block text-sm text-gray-600 mb-2 pb-2">
                یا بارگذاری یک تصویر QR Code
              </label>
              <label className=" cursor-pointer bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors border border-gray-300">
                بارگذاری تصویر
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {data && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <h2 className="font-bold mb-2">نتیجه اسکن:</h2>
            <p className="break-all mb-4">{data}</p>
            <div className="flex gap-2">
              <button
                onClick={resetScanner}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                اسکن کد دیگر
              </button>
              <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
                بارگذاری تصویر دیگر
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        )}

        {isScanning && (
          <button
            onClick={stopScanning}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            متوقف کردن اسکن
          </button>
        )}
      </div>
    </div>
  );
}
