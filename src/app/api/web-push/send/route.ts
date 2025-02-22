import { NextRequest } from "next/server";
import webpush from 'web-push';

// Initialize webpush with VAPID details
webpush.setVapidDetails(
    'mailto:amir.re6@gmail.com',  // Replace with your email
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { subscription, title, message } = await req.json();
        
        const payload = JSON.stringify({
            title,
            message
        });

        await webpush.sendNotification(subscription, payload);
        
        return new Response(JSON.stringify({ message: "Push sent." }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error sending push notification:', error);
        return new Response(JSON.stringify({ error: 'Failed to send push notification' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}