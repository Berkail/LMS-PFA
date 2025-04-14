"use client";

import React, { useState } from 'react'
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

interface LoginFormData {
  username: string;
  plainPassword: string;
}

function SignInComponent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const signUpUrl = "/signup";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData: LoginFormData = {
      username: (form.querySelector('#username') as HTMLInputElement).value,
      plainPassword: (form.querySelector('#password') as HTMLInputElement).value,
    };

    try {
      const endpoint = activeTab === 'student' 
        ? `${process.env.NEXT_PUBLIC_API_BASED_URL}auth/login/learner`
        : `${process.env.NEXT_PUBLIC_API_BASED_URL}auth/login/instructor`;
    
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return;
      }
    
      if (activeTab === 'student') {
        window.location.href = '/student/search';
      } else {
        window.location.href = '/teacher/profile';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className='auth-card-bg-color dark'>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 text-red-500 bg-red-100 rounded">
              {error}
            </div>
          )}
          <Tabs 
            defaultValue="student" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value as 'student' | 'teacher')}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">As a Student</TabsTrigger>
              <TabsTrigger value="teacher">As a Teacher</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    className='auth-form-input'
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    className='auth-form-input' 
                    type="password" 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full auth-action"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href={signUpUrl} className="auth-link">
                  Sign up
                </a>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInComponent;