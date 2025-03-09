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
import { RadioGroupItem,RadioGroup } from '@/components/ui/radio-group';

function SignUpComponent({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) {
    const signInUrl = "/signin";

    return (
      <div className={cn("flex flex-col gap-6 dark", className)} {...props}>
        <Card>
          
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Weldome! please fill in the details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
              
              <div className="grid gap-2">
                 <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" type="text" placeholder="John" required />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" type="text" placeholder="Doe" required />
                    </div>
                  </div>
              </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="m@example.com"
                    required
                    
                  />
                  </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                
                <div className="flex justify-center">
                  <RadioGroup defaultValue="student" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">As a Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="teacher" />
                      <Label htmlFor="teacher">As a Teacher</Label>
                    </div>      
                  </RadioGroup>
                </div>


                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href={signInUrl} className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}

export default SignUpComponent;