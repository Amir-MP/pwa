export const registerAndSubscribe = async (
    onSubscribe: (subscription: PushSubscription | null) => void,
    onError: (error: Error) => void,
    applicationServerKey: string
) => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
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