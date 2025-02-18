"use client";

import { useEffect, useRef, useState } from "react";
import type SignaturePad from "react-signature-canvas";

interface SignatureComponentProps {
  onSave: (dataURL: string) => void;
  onClear: () => void;
}

export default function SignatureComponent({ onSave, onClear }: SignatureComponentProps) {
  const signaturePadRef = useRef<SignaturePad>(null);
  const [SignaturePadComponent, setSignaturePadComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamic import of the component
    import('react-signature-canvas')
      .then((module) => {
        setSignaturePadComponent(() => module.default);
      })
      .catch((err) => console.error('Failed to load SignaturePad:', err));
  }, []);

  useEffect(() => {
    const handleSave = () => {
      if (signaturePadRef.current) {
        const dataURL = signaturePadRef.current.getTrimmedCanvas().toDataURL('image/png');
        onSave(dataURL);
      }
    };

    document.addEventListener('saveSignature', handleSave);
    return () => document.removeEventListener('saveSignature', handleSave);
  }, [onSave]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      onClear();
    }
  };

  if (!SignaturePadComponent) {
    return (
      <div className="w-[500px] h-[200px] bg-gray-700 rounded-lg" />
    );
  }

  return (
    <SignaturePadComponent
      ref={signaturePadRef}
      canvasProps={{
        className: "w-[500px] h-[200px] bg-white rounded-lg",
      }}
    />
  );
} 