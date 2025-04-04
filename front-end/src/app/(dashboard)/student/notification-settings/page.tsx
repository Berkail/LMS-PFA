import Header from '@/components/Header';
import SwitchForm from '@/components/NotificationSettings';
import SharedNotificationSettings from '@/components/SharedNotificationSettings';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react'

const UserNotificationSettings = () => {
  return (
    <div className='w-3/5'>
      <Header title='Notifications' subtitle='You can change your notification settings here'/>
        <Card className="profile-container dark border-none">
                <CardContent className="p-6">
        <SwitchForm />
        </CardContent>
        </Card>
    </div>
  )
}

export default UserNotificationSettings;