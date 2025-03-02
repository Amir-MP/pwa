'use client';

import { useState, useEffect } from 'react';

interface SMS {
  body: string;
  timestamp: number;
}

export default function SMSReader() {
  const [smsMessages, setSmsMessages] = useState<SMS[]>([]);
  const [extractedNumbers, setExtractedNumbers] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Function to extract 5-digit numbers from text
  const extract5DigitNumbers = (text: string): string[] => {
    const regex = /\b\d{5}\b/g;
    const matches = text.match(regex) || [];
    console.log('Extracted numbers:', matches); // Debug log
    return matches;
  };

  // Function to handle new message
  const handleNewMessage = (messageText: string) => {
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
  };

  // Test function to add a message
  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      handleNewMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SMS Reader</h1>
      
      {/* Test input form */}
      <form onSubmit={handleTestSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter test message"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Message
          </button>
        </div>
      </form>
      
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
