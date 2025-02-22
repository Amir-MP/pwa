'use client';

import { useState } from 'react';
import { subscribeToPushNotifications } from '@/utils/pushNotification';

export default function TestNotification() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubscribe = async () => {
    try {
      setError('');
      const sub = await subscribeToPushNotifications();
      setSubscription(sub);
      alert('Successfully subscribed to push notifications!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to subscribe:', error);
      alert(`Failed to subscribe: ${errorMessage}`);
    }
  };

  const handleTestNotification = async () => {
    if (!subscription) {
      alert('Please subscribe first');
      return;
    }

    try {
      setError('');
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }

      console.log('Test notification sent!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error sending test notification:', error);
      alert(`Failed to send notification: ${errorMessage}`);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <button 
        onClick={handleSubscribe}
        className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
      >
        Subscribe to Notifications
      </button>
      <button 
        onClick={handleTestNotification}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={!subscription}
      >
        Send Test Notification
      </button>
      {subscription && (
        <div className="mt-4 text-sm text-gray-600">
          Subscription active ✓
        </div>
      )}
    </div>
  );
} 