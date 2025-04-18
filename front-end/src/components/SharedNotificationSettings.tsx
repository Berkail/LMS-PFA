"use client";
import React from 'react'
import Header from './Header'
import { Form } from '@/components/ui/form';
import { METHODS } from 'http';


const SharedNotificationSettings = ({
    title="Notification Settings",
    subtitle="Customize your notification settings"
}: SharedNotificationSettingsProps) => {
  return (
    <div className='notification-settings'>
        <Header title={title} subtitle={subtitle} />
    </div>
  )
}

export default SharedNotificationSettings

