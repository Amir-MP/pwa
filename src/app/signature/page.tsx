"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SignatureCanvas = dynamic(
  () => import("react-signature-canvas").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-full h-[150px] bg-gray-700 rounded-lg" />,
  }
);

export default function Signature() {
  const signatureRef = useRef<any>(null);
  const [signatureData, setSignatureData] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 150 });

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureData("");
    }
  };
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 32;
        setCanvasSize({ width, height: 150 });
      }
    };

    setTimeout(updateCanvasSize, 0);
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const saveSignature = () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert("Please provide a signature");
      return;
    }

    try {
      const dataURL = signatureRef.current.toDataURL("image/png");
      setSignatureData(dataURL);
      console.log("Signature saved:", dataURL);
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("Error saving signature. Please try again.");
    }
  };

  return (  
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-10 rounded-xl shadow-lg max-w-sm w-full backdrop-blur-md bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-center mb-6">امضا الکترونیکی</h1>

      <div
        ref={containerRef}
        className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-[500px]"
      >
        {canvasSize.width > 0 && ( 
          <SignatureCanvas
            //@ts-ignore
            ref={signatureRef}
            canvasProps={{
              width: canvasSize.width,
              height: canvasSize.height,
              className: "sigCanvas bg-gray-700 rounded-lg touch-none",
              style: { width: "100%", height: "100%" },
            }}
            penColor="white"
          />
        )}
      </div>
      <div className="mt-4 space-x-4 flex flex-row-reverse">
        <button
          onClick={clearSignature}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          پاک کردن
        </button>
        <button
          onClick={saveSignature}
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
    </div>
  );
}
