"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Header from "@/components/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import { useState, useEffect } from "react"


const ProfileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." })
});

const PasswordFormSchema = z.object({
  plainPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPlainPassword: z.string()
}).refine((data) => data.plainPassword === data.confirmPlainPassword, {
  message: "Passwords don't match",
  path: ["confirmPlainPassword"],
});

const Profile = () => {
  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
  });

  const profileForm = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      plainPassword: "",
      confirmPlainPassword: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost/api/instructors/me', {
          credentials: 'include'
        });
        const data = await response.json();
        
        profileForm.reset({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
        });
      } catch (error) {
        toast.error("Failed to fetch profile data");
      }
    };

    fetchProfile();
  }, [profileForm]);

  const toggleEditable = (field: keyof typeof editableFields) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  async function onSubmitProfile(data: z.infer<typeof ProfileFormSchema>) {
    try {
      const updateData: Partial<z.infer<typeof ProfileFormSchema>> = {};
      
      Object.keys(editableFields).forEach((key) => {
        const field = key as keyof typeof editableFields;
        if (editableFields[field] && data[field]) {
          updateData[field] = data[field];
        }
      });

      const response = await fetch('http://localhost/api/instructors/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.success("Profile updated successfully");
      setEditableFields(prev => Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {} as typeof editableFields));
      
    } catch (error) {
      toast.error("Failed to update profile");
    }
  }

  async function onSubmitPassword(data: z.infer<typeof PasswordFormSchema>) {
    try {
      const response = await fetch('http://localhost/api/instructors/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          plainPassword: data.plainPassword
        }),
      });

      if (!response.ok) throw new Error('Failed to update password');

      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to update password");
    }
  }

  return (
    <div className="space-y-6 user-profile">
      <Header title="Profile Settings" subtitle="Manage your account information" />

      <Card className="profile-container dark border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage/>
              <AvatarFallback className="bg-secondary-700 rounded-lg text-3xl text-black">
              {profileForm.getValues("lastName")?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Form */}
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<FormField
  control={profileForm.control}
  name="firstName"
  render={({ field }) => (
    <FormItem className="relative">
      <FormLabel>First Name</FormLabel>
      <div className="flex items-center gap-2">
        <FormControl>
          <Input 
            placeholder="John" 
            {...field} 
            disabled={!editableFields.firstName}
          />
        </FormControl>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => toggleEditable('firstName')}
        >
          <Pencil className={editableFields.firstName ? "text-primary" : "text-muted-foreground"} size={16} />
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
  {/* Last Name Field */}
  <FormField
    control={profileForm.control}
    name="lastName"
    render={({ field }) => (
      <FormItem className="relative">
        <FormLabel>Last Name</FormLabel>
        <div className="flex items-center gap-2">
          <FormControl>
            <Input 
              placeholder="Doe" 
              {...field} 
              disabled={!editableFields.lastName}
            />
          </FormControl>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => toggleEditable('lastName')}
          >
            <Pencil className={editableFields.lastName ? "text-primary" : "text-muted-foreground"} size={16} />
          </Button>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Username Field */}
  <FormField
    control={profileForm.control}
    name="username"
    render={({ field }) => (
      <FormItem className="relative">
        <FormLabel>Username</FormLabel>
        <div className="flex items-center gap-2">
          <FormControl>
            <Input 
              placeholder="johndoe" 
              {...field} 
              disabled={!editableFields.username}
            />
          </FormControl>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => toggleEditable('username')}
          >
            <Pencil className={editableFields.username ? "text-primary" : "text-muted-foreground"} size={16} />
          </Button>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Email Field */}
  <FormField
    control={profileForm.control}
    name="email"
    render={({ field }) => (
      <FormItem className="relative">
        <FormLabel>Email</FormLabel>
        <div className="flex items-center gap-2">
          <FormControl>
            <Input 
              placeholder="john@example.com" 
              {...field} 
              disabled={!editableFields.email}
            />
          </FormControl>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => toggleEditable('email')}
          >
            <Pencil className={editableFields.email ? "text-primary" : "text-muted-foreground"} size={16} />
          </Button>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
</div>
              <div className="flex justify-end">
                {Object.values(editableFields).some(Boolean) && (
                  <Button type="submit">Save Changes</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card className="profile-container dark border-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={passwordForm.control}
                  name="plainPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter new password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPlainPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm new password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile