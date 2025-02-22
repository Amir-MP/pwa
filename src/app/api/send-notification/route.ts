import { NextResponse } from 'next/server';
import webpush from 'web-push';

// VAPID keys should be in your environment variables
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  publicKey!,
  privateKey!
);

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    
    // Test notification payload
    const payload = JSON.stringify({
      title: 'Test Notification',
      body: 'This is a test push notification!',
      icon: '/icon.png' // Optional: Add your icon path
    });

    await webpush.sendNotification(subscription, payload);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    );
  }
} 