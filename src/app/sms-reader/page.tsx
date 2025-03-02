'use client';

import { useState, useEffect } from 'react';

interface SMS {
  body: string;
  timestamp: number;
}

declare global {
  interface Window {
    Android?: {
      getLatestSMS?: () => string;
    };
  }
}

export default function SMSReader() {
  const [smsMessages, setSmsMessages] = useState<SMS[]>([]);
  const [extractedNumbers, setExtractedNumbers] = useState<string[]>([]);

  // Function to extract 5-digit numbers from text
  const extract5DigitNumbers = (text: string): string[] => {
    const regex = /\b\d{5}\b/g;
    const matches = text.match(regex) || [];
    console.log('Extracted numbers:', matches);
    return matches;
  };

  // Function to check for new SMS
  const checkNewSMS = () => {
    if (window.Android?.getLatestSMS) {
      const messageText = window.Android.getLatestSMS();
      if (messageText) {
        const newSMS: SMS = {
          body: messageText,
          timestamp: Date.now(),
        };
        
        setSmsMessages(prev => [...prev, newSMS]);
        
        // Extract 5-digit numbers from the new message
        const numbers = extract5DigitNumbers(messageText);
        if (numbers.length > 0) {
          setExtractedNumbers(prev => [...prev, ...numbers]);
        }
      }
    }
  };

  useEffect(() => {
    // Check for new SMS every 2 seconds
    const interval = setInterval(checkNewSMS, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SMS Reader</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Extracted 5-Digit Numbers</h2>
        {extractedNumbers.length > 0 ? (
          <ul className="list-disc pl-4">
            {extractedNumbers.map((number, index) => (
              <li key={index} className="text-lg text-blue-600">{number}</li>
            ))}
          </ul>
        ) : (
          <p>No 5-digit numbers found yet</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Messages</h2>
        {smsMessages.length > 0 ? (
          <ul className="space-y-2">
            {smsMessages.map((sms, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded">
                <p>{sms.body}</p>
                <p className="text-sm text-gray-500">
                  {new Date(sms.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages received yet</p>
        )}
      </div>
    </div>
  );
}
