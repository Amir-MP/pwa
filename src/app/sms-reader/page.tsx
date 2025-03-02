'use client';

import { useState, useEffect } from 'react';

interface SMS {
  body: string;
  timestamp: number;
}

export default function SMSReader() {
  const [smsMessages, setSmsMessages] = useState<SMS[]>([]);
  const [extractedNumbers, setExtractedNumbers] = useState<string[]>([]);

  // Function to extract 5-digit numbers from text
  const extract5DigitNumbers = (text: string): string[] => {
    const regex = /\b\d{5}\b/g;
    return text.match(regex) || [];
  };

  // Function to handle incoming SMS
  const handleIncomingSMS = async () => {
    try {
      // Check if SMS permission is available
      if (!('sms' in navigator)) {
        throw new Error('SMS API is not supported in this browser');
      }

      // Request SMS permission
      // @ts-ignore - SMS API is experimental
      const permission = await navigator.permissions.query({ name: 'sms-receive' });
      
      if (permission.state === 'granted') {
        // @ts-ignore - SMS API is experimental
        navigator.sms.watch((message: { content: string }) => {
          console.log('Received SMS:', message); // Debug log
          
          const newSMS: SMS = {
            body: message.content,
            timestamp: Date.now(),
          };
          
          setSmsMessages(prev => [...prev, newSMS]);
          
          // Extract 5-digit numbers from the new message
          const numbers = extract5DigitNumbers(message.content);
          console.log('Extracted numbers:', numbers); // Debug log
          
          if (numbers.length > 0) {
            setExtractedNumbers(prev => [...prev, ...numbers]);
          }
        });
      }
    } catch (error) {
      console.error('Error accessing SMS:', error);
    }
  };

  useEffect(() => {
    handleIncomingSMS();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SMS Reader</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Extracted 5-Digit Numbers</h2>
        {extractedNumbers.length > 0 ? (
          <ul className="list-disc pl-4">
            {extractedNumbers.map((number, index) => (
              <li key={index}>{number}</li>
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
