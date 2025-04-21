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

const FormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  plainPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPlainPassword: z.string(),
  birthdate: z.string()
}).refine((data) => data.plainPassword === data.confirmPlainPassword, {
  message: "Passwords don't match",
  path: ["confirmPlainPassword"],
});

const Profile = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      plainPassword: "",
      confirmPlainPassword: "",
      birthdate: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Profile updated successfully")
  }

  return (
    <div className="space-y-6 user-profile">
      <Header title="Profile Settings" subtitle="Manage your account information" />

      <Card className="profile-container dark border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <FormField
    control={form.control}
    name="firstName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <Input placeholder="John" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="lastName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Last Name</FormLabel>
        <FormControl>
          <Input placeholder="Doe" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="username"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input placeholder="johndoe" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="john@example.com" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <FormField
    control={form.control}
    name="plainPassword"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input 
            type="password" 
            placeholder="Enter your password"
            {...field} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="confirmPlainPassword"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Confirm Password</FormLabel>
        <FormControl>
          <Input 
            type="password" 
            placeholder="Confirm your password"
            {...field} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

</div>
              

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile