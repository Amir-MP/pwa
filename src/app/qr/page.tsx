'use client';

import React, { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import type SignatureCanvas from 'react-signature-canvas';

export default function Page() {
  const signatureRef = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      // Do something with the dataUrl
      console.log(dataUrl);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Signature Pad</h1>
      
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <SignaturePad
            canvasProps={{
              width: 500,
              height: 200,
              className: 'signature-canvas bg-black rounded-lg'
            }}
            ref={signatureRef}
            penColor="white"
          />
        </div>
        
        <div className="mt-4 flex gap-4">
          <button 
            onClick={clearSignature}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
          <button 
            onClick={saveSignature}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}