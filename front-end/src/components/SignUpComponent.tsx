"use client";

import React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

function SignUpComponent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const signInUrl = "/signin";

  return (
    <div className={cn("flex flex-col gap-6  max-w-3xl mx-auto ", className)} {...props}>
      <Card className="w-full auth-card-bg-color">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-customgreys-primarybg">
              <TabsTrigger value="student">As a Student</TabsTrigger>
              <TabsTrigger value="teacher">As a Teacher</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 grid gap-2">
                      <Label htmlFor="studentFirstName">First Name</Label>
                      <Input id="studentFirstName" className='auth-form-input' type="text" placeholder="John" required />
                    </div>
                    <div className="flex-1 grid gap-2">
                      <Label htmlFor="studentLastName">Last Name</Label>
                      <Input id="studentLastName" className='auth-form-input' type="text" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="Username">Username</Label>
                    <Input id="Username" className='auth-form-input' type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="Birthday">Birthday</Label>
                    <Input id="Birthday" className='auth-form-input' type="date" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="studentEmail">Email</Label>
                    <Input id="studentEmail" className='auth-form-input' type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="studentPassword">Password</Label>
                    <Input id="studentPassword" className='auth-form-input' type="password" required />
                  </div>
                  <div className="grid gap-2 ">
                    <Label htmlFor="studentConfirmPassword">Confirm Password</Label>
                    <Input id="studentConfirmPassword" className='auth-form-input' type="password" required />
                  </div>
                </div>
                <Button type="submit" className="w-full auth-action">Create Student Account</Button>
                <Button variant="outline" className="w-full">Sign up with Google</Button>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <div className="flex gap-4">
                    <div className="flex-1 grid gap-2">
                      <Label htmlFor="teacherFirstName">First Name</Label>
                      <Input id="teacherFirstName" className='auth-form-input' type="text" placeholder="John" required />
                    </div>
                    <div className="flex-1 grid gap-2">
                      <Label htmlFor="teacherLastName">Last Name</Label>
                      <Input id="teacherLastName" className='auth-form-input' type="text" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="Username">Username</Label>
                    <Input id="Username" className='auth-form-input' type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="teacherEmail">Email</Label>
                    <Input id="teacherEmail" className='auth-form-input' type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="teacherPassword">Password</Label>
                    <Input id="teacherPassword" className='auth-form-input' type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="teacherConfirmPassword">Confirm Password</Label>
                    <Input id="teacherConfirmPassword" className='auth-form-input' type="password" required />
                  </div>
                </div>
                <Button type="submit" className="w-full auth-action">Create Teacher Account</Button>
                <Button variant="outline" className="w-full">Sign up with Google</Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href={signInUrl} className="auth-link">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpComponent;