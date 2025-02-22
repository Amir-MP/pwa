export async function subscribeToPushNotifications() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications are not supported');
    }

    // First check if we already have a service worker
    let registration = await navigator.serviceWorker.getRegistration();
    
    // If no service worker exists, register one
    if (!registration) {
      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
    }

    // Get existing subscription or create new one
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
    }

    // Send the subscription to your backend
    await fetch('/api/push-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
} 