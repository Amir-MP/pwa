"use client";
import { NotificationSubscriptionForm } from "@/components/notifications/NotificationSubscriptionForm";
import NotificationSubscriptionStatus from "@/components/notifications/NotificationSubscriptionStatus";
import { UnsupportedNotificationMessage } from "@/components/notifications/UnsupportedNotificationMessage";
import { useNotification } from "@/notifications/useNotification";
import React from "react";


const Home = () => {
    const {isSupported, isSubscribed} = useNotification();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100dvh)] bg-gray-100 p-4">
            {!isSupported ? (
                <UnsupportedNotificationMessage/>
            ) : (
                <NotificationSubscriptionStatus/>
            )}

            {isSubscribed && (
                <NotificationSubscriptionForm/>
            )}
        </div>
    );
};

export default Home;
