import { NextRequest } from "next/server";
import webPush from 'web-push';

const vapidDetails = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
  subject: process.env.VAPID_SUBJECT!
};

webPush.setVapidDetails(
  vapidDetails.subject,
  vapidDetails.publicKey,
  vapidDetails.privateKey
);

export async function POST(req: NextRequest) {
    try {
        const { subscription, title, message } = await req.json();
        
        const payload = JSON.stringify({
            title,
            message
        });

        await webPush.sendNotification(subscription, payload);
        
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