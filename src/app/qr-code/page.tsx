"use client";

import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

const customStyles = `
  /* Custom styles for the QR scanner */

  /* Hide default elements */
  #reader__dashboard_section_csr {
    display: none !important;
  }
  
  #reader__dashboard_section_fsr {
    display: none !important;
  }

  #reader__filescan_input {
    display: none !important;
  }

  /* Rest of your custom styles remain the same */
  #reader {
    width: 100% !important;
    border: none !important;
    min-height: 300px !important;
  }

  #reader__scan_region {
    background: #ffffff !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    min-height: 300px !important;
  }

  #reader__scan_region > img {
    display: none !important;
  }

  #reader__scan_region video {
    border-radius: 12px !important;
    max-height: 300px !important;
    object-fit: cover !important;
  }

  #reader__camera_selection {
    width: 100% !important;
    margin-bottom: 1rem !important;
    padding: 0.5rem !important;
    border-radius: 8px !important;
    border: 1px solid #e2e8f0 !important;
    background-color: #f8fafc !important;
  }

  #reader__dashboard {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
  }

  #reader__dashboard_section {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
  }

  #reader__dashboard_section_swaplink {
    color: #3b82f6 !important;
    text-decoration: none !important;
    font-weight: 500 !important;
  }

  #reader__status_span {
    display: none !important;
  }

  /* Custom QR scanning region overlay */
  #reader__scan_region::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    height: 250px;
    border: 2px solid #3b82f6;
    border-radius: 12px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    }
    50% {
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
    }
    100% {
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    }
  }
`;

export default function Page() {
  const [scanResult, setScanResult] = useState<string>("");
  const [currentCamera, setCurrentCamera] = useState("environment");
  const [isClient, setIsClient] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    requestCameraPermission();
  }, [isClient]);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentCamera
        }
      });
      setHasPermission(true);
      setIsScanning(true);
    } catch (error) {
      console.error("Camera permission denied:", error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    if (!isClient || !isScanning || !hasPermission) return;

    const initializeScanner = async () => {
      try {
        // Clear existing scanner if any
        if (scannerRef.current) {
          await scannerRef.current.clear();
        }

        // Create new scanner instance
        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          {
            qrbox: {
              width: 250,
              height: 250,
            },
            fps: 10,
            videoConstraints: {
              facingMode: currentCamera,
            },
            showTorchButtonIfSupported: true,
            aspectRatio: 1,
          },
          false
        );

        const success = (result: string) => {
          setScanResult(result);
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
          }
        };

        const error = (err: string) => {
          if (!err.includes("No QR code found")) {
            console.warn(err);
          }
        };

        await scannerRef.current.render(success, error);
      } catch (err) {
        console.error("Scanner error:", err);
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [currentCamera, isClient, isScanning, hasPermission]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleCameraSwitch = (newCamera: string) => {
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        setCurrentCamera(newCamera);
        setIsScanning(true);
      }).catch(console.error);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            QR Code Scanner
          </h1>

          {!hasPermission ? (
            <div className="text-center p-8">
              <button
                onClick={requestCameraPermission}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium 
                         hover:bg-blue-700 transition-all duration-200 
                         flex items-center justify-center gap-2 mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Enable Camera Access
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 relative rounded-2xl overflow-hidden bg-gray-50">
                <div id="reader" className="shadow-inner"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCameraSwitch("environment")}
                  className={`
                    col-span-1 p-4 rounded-xl font-medium transition-all duration-200
                    flex items-center justify-center gap-2
                    ${
                      currentCamera === "environment"
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back Camera
                </button>

                <button
                  onClick={() => handleCameraSwitch("user")}
                  className={`
                    col-span-1 p-4 rounded-xl font-medium transition-all duration-200
                    flex items-center justify-center gap-2
                    ${
                      currentCamera === "user"
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Front Camera
                </button>
              </div>

              {!isScanning && scanResult && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                  <h2 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
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
                  <div className="bg-white p-4 rounded-lg break-all text-gray-800 border border-green-100">
                    {scanResult}
                  </div>
                  <button
                    onClick={() => {
                      setScanResult("");
                      setIsScanning(true);
                    }}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Scan Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}