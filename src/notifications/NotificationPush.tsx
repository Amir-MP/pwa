export const registerAndSubscribe = async (
    onSubscribe: (subscription: PushSubscription | null) => void,
    onError: (error: Error) => void
) => {
    try {
        // Fetch the VAPID key internally
        const response = await fetch("/api/web-push/vapid-public-key");
        const { publicKey } = await response.json();

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey,
        });
        onSubscribe(subscription);
    } catch (e) {
        onError(e as Error);
    }
};

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const isPermissionGranted = (): boolean => {
  return Notification.permission === 'granted';
};

export const isPermissionDenied = (): boolean => {
  return Notification.permission === 'denied';
}; 