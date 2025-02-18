'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FpjsProvider, useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';

// Replace with your public API key from FingerprintJS Pro dashboard
const FPJS_PUBLIC_API_KEY = 'your_public_api_key';

function FingerprintAuthContent() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const {
    isLoading,
    error: fpError,
    data,
  } = useVisitorData({ immediate: true });

  const handleFingerPrintLogin = async () => {
    try {
      if (fpError) {
        throw new Error('Failed to get fingerprint');
      }

      if (data) {
        console.log('Visitor ID:', data.visitorId);
        // Here you would typically:
        // 1. Send the visitorId to your backend for verification
        // 2. Get a session token in response
        // 3. Store the token
        
        // For demo purposes, we'll just redirect
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Authentication failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Fingerprint Login
        </h1>
        
        <div className="flex flex-col items-center">
          <button
            onClick={handleFingerPrintLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center gap-2 w-full max-w-sm transition-colors"
            disabled={isLoading}
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
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
            Login with Fingerprint
          </button>

          {(error || fpError) && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error || fpError?.message}
            </div>
          )}

          <p className="mt-6 text-sm text-gray-600 text-center">
            Please authenticate to continue
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrap the main component with FpjsProvider
export default function FingerprintAuth() {
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: FPJS_PUBLIC_API_KEY
      }}
    >
      <FingerprintAuthContent />
    </FpjsProvider>
  );
}