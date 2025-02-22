import { NextResponse } from 'next/server';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    
    // Store the subscription in your database
    // ... database code here ...

    return NextResponse.json({ message: 'Subscription added successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing subscription' },
      { status: 500 }
    );
  }
} 