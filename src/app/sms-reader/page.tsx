'use client';

import { useState, useEffect } from 'react';

interface SMS {
  body: string;
  date: number;
}

export default function SMSReader() {
  const [smsMessages, setSmsMessages] = useState<SMS[]>([]);
  const [balanceInfo, setBalanceInfo] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const readSMS = async () => {
    try {
      if (!('sms' in navigator)) {
        throw new Error('SMS API is not supported in this browser/device');
      }

      // @ts-ignore - SMS API types are not included in TypeScript
      const messages = await navigator.sms.receive();
      setSmsMessages(messages);

      // Filter messages containing "مانده"
      const balances = messages
        .map(msg => {
          const match = msg.body.match(/مانده:[\d,]+/g);
          return match ? match[0] : null;
        })
        .filter(Boolean) as string[];

      setBalanceInfo(balances);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read SMS messages');
    }
  };

  useEffect(() => {
    // Request permission and read SMS when component mounts
    const requestPermission = async () => {
      try {
        // @ts-ignore - SMS API types are not included in TypeScript
        const permission = await navigator.permissions.query({ name: 'sms-receive' });
        if (permission.state === 'granted') {
          readSMS();
        } else {
          setError('Permission to read SMS was denied');
        }
      } catch (err) {
        setError('SMS permission is not supported in this browser/device');
      }
    };

    requestPermission();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SMS Reader</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {balanceInfo.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Balance Information:</h2>
          {balanceInfo.map((balance, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              dir="rtl"
            >
              {balance}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          {error ? '' : 'No balance information found in SMS messages'}
        </p>
      )}
    </div>
  );
}
