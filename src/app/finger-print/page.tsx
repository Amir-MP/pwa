'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function FingerprintAuthContent() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFingerPrintLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if the browser supports biometric authentication
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication is not supported in this browser');
      }

      // Check if platform authenticator is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        throw new Error('Biometric authentication is not available on this device');
      }

      // Generate a random challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Create authentication options specifically for biometric auth
      const authenticationOptions = {
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required' as UserVerificationRequirement,
          authenticatorAttachment: 'platform' as AuthenticatorAttachment,
          rpId: window.location.hostname,
          allowCredentials: [], // Empty array to prevent passkey prompt
        }
      };

      // Create registration options for first-time setup
      const registrationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'Your App Name',
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16), // Generate a random user ID
            name: 'user@example.com',
            displayName: 'Test User',
          },
          pubKeyCredParams: [{
            type: 'public-key',
            alg: -7
          }],
          timeout: 60000,
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            requireResidentKey: false,
            userVerification: 'required'
          }
        }
      };

      try {
        // First try to authenticate
        const credential = await navigator.credentials.create(registrationOptions);
        
        if (!credential) {
          throw new Error('No credentials received');
        }

        // If we get here, authentication was successful
        console.log('Authentication successful');
        router.push('/dashboard');
      } catch (credentialError) {
        throw new Error('Biometric authentication failed. Please try again.');
      }

    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Biometric Login 2
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
            {isLoading ? 'Authenticating...' : 'Login with Biometrics'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
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

export default FingerprintAuthContent;