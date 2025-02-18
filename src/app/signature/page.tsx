"use client";

import { useState } from "react";
import SignatureComponent from "@/components/SignatureComponent";

export default function Signature() {
  const [signatureData, setSignatureData] = useState<string>("");

  const handleClear = () => {
    setSignatureData("");
  };

  const handleSave = (dataURL: string) => {
    setSignatureData(dataURL);
    console.log("Signature saved:", dataURL);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Digital Signature</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <SignatureComponent onSave={handleSave} onClear={handleClear} />
      </div>

      <div className="mt-4 space-x-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          پاک کردن
        </button>
        <button
          onClick={() => document.dispatchEvent(new Event('saveSignature'))}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          ذخیره
        </button>
      </div>

      {signatureData && (
        <div className="mt-8">
          <h2 className="text-white mb-2">امضا ذخیره شده:</h2>
          <img
            src={signatureData}
            alt="Saved signature"
            className="max-w-[500px] p-2 rounded"
          />
        </div>
      )}
    </div>
  );
}