"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUserMutation } from "@/state/api";
import React from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { z } from "zod";
import { Button } from "@/components/ui/button";

// Define props interface
interface SharedNotificationSettingsProps {
    title?: string;
    subtitle?: string;
}

// Mock user hook (similar to previous example)
const useUser = () => {
    return {
        user: {
            id: 'mock-user-id',
            fullName: 'Mock User',
            emailAddresses: [{ emailAddress: 'mock@example.com' }],
        }
    };
};

// Notification settings schema
const notificationSchema = z.object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    pushNotifications: z.boolean().default(false)
});

const SharedNotificationSettings: React.FC<SharedNotificationSettingsProps> = ({
                                                                                   title = "Notification Settings",
                                                                                   subtitle = "Manage how you receive updates"
                                                                               }) => {
    const { user } = useUser();
    const [updateUser] = useUpdateUserMutation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: false
        }
    });

    const onSubmit = async (data: z.infer<typeof notificationSchema>) => {
        try {
            await updateUser({
                userId: user?.id,
                ...data  // Spread the notification settings directly
            }).unwrap();
            // Optionally add success toast or notification
        } catch (error) {
            // Handle error (e.g., show error message)
            console.error('Failed to update notification settings', error);
        }
    };

    return (
        <div className="notification-settings">
            <Header
                title={title}
                subtitle={subtitle}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        {...register('emailNotifications')}
                        id="email-notifications"
                        className="form-checkbox"
                    />
                    <label htmlFor="email-notifications">
                        Email Notifications
                    </label>
                    {errors.emailNotifications && (
                        <span className="text-red-500 text-sm">
                            {errors.emailNotifications.message}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        {...register('smsNotifications')}
                        id="sms-notifications"
                        className="form-checkbox"
                    />
                    <label htmlFor="sms-notifications">
                        SMS Notifications
                    </label>
                    {errors.smsNotifications && (
                        <span className="text-red-500 text-sm">
                            {errors.smsNotifications.message}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        {...register('pushNotifications')}
                        id="push-notifications"
                        className="form-checkbox"
                    />
                    <label htmlFor="push-notifications">
                        Push Notifications
                    </label>
                    {errors.pushNotifications && (
                        <span className="text-red-500 text-sm">
                            {errors.pushNotifications.message}
                        </span>
                    )}
                </div>

                <Button
                    type="submit"
                    className="mt-4"
                    disabled={isSubmitting}
                >
                    Save Notification Preferences
                </Button>
            </form>
        </div>
    );
};

export default SharedNotificationSettings;