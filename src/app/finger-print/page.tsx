"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FingerPrint = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleBiometricAuth = async () => {
    setLoading(true);
    setError("");

    try {
      // Check if the browser supports WebAuthn
      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported by this browser");
      }

      // Check if device supports biometric authentication
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        throw new Error(
          "Biometric authentication is not available on this device"
        );
      }

      // Create challenge (in production, this should come from your backend)
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Authentication options
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
        {
          challenge,
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
        };

      // Start the biometric authentication
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (credential) {
        // Here you would typically send the credential to your backend
        // for verification and user authentication
        console.log("Successfully authenticated!");

        // Redirect to dashboard or home page after successful authentication
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Login with Fingerprint</h2>
          <p className="mt-2 text-gray-600">
            Use your device's biometric authentication to sign in
          </p>
        </div>

        <button
          onClick={handleBiometricAuth}
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Authenticate with Fingerprint"}
        </button>

        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default FingerPrint;
