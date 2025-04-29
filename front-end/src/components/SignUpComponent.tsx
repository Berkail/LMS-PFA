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

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  plainPassword: string;
  confirmPlainPassword: string;
  birthdate?: string;
}

function SignUpComponent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const signInUrl = "/signin";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const validatePasswords = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.querySelector('#studentPassword') as HTMLInputElement).value;
    const confirmPassword = (form.querySelector('#studentConfirmPassword') as HTMLInputElement).value;
  
    if (!validatePasswords(password, confirmPassword)) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setPasswordMatch(true);
  
  
    const birthdateInput = (form.querySelector('#Birthday') as HTMLInputElement).value;
    const birthdate = new Date(birthdateInput).toISOString();
  
    const formData: SignUpFormData = {
      firstName: (form.querySelector('#studentFirstName') as HTMLInputElement).value,
      lastName: (form.querySelector('#studentLastName') as HTMLInputElement).value,
      username: (form.querySelector('#Username') as HTMLInputElement).value,
      email: (form.querySelector('#studentEmail') as HTMLInputElement).value,
      plainPassword: password,
      confirmPlainPassword: password,
      birthdate: birthdate, // Now sending as ISO string
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASED_URL}auth/signup/learner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        setError(data.message || 'Failed to create account');
        setIsLoading(false);
        return;
      }
    
      window.location.href = signInUrl;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsLoading(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.querySelector('#teacherPassword') as HTMLInputElement).value;
    const confirmPassword = (form.querySelector('#teacherConfirmPassword') as HTMLInputElement).value;

    if (!validatePasswords(password, confirmPassword)) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPasswordMatch(true);

    const formData: SignUpFormData = {
      firstName: (form.querySelector('#teacherFirstName') as HTMLInputElement).value,
      lastName: (form.querySelector('#teacherLastName') as HTMLInputElement).value,
      username: (form.querySelector('#Username') as HTMLInputElement).value,
      email: (form.querySelector('#teacherEmail') as HTMLInputElement).value,
      plainPassword: password,
      confirmPlainPassword: password,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASED_URL}auth/signup/instructor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        setError(data.message || 'Failed to create account');
        setIsLoading(false);
        return;
      }
    
      window.location.href = signInUrl;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-3xl mx-auto", className)} {...props}>
      <Card className="w-full auth-card-bg-color">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 text-red-500 bg-red-100 rounded">
              {error}
            </div>
          )}
          <Tabs defaultValue="student" className="w-full dark">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-customgreys-primarybg">
              <TabsTrigger value="student">As a Student</TabsTrigger>
              <TabsTrigger value="teacher">As a Teacher</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form className="flex flex-col gap-6" onSubmit={handleStudentSubmit}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="studentConfirmPassword">Confirm Password</Label>
                    <Input 
                      id="studentConfirmPassword" 
                      className={cn('auth-form-input', !passwordMatch && 'border-red-500')} 
                      type="password" 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full auth-action" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Student Account"}
                </Button>
                <Button variant="outline" className="w-full">Sign up with Google</Button>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form className="flex flex-col gap-6" onSubmit={handleTeacherSubmit}>
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
                    <Input 
                      id="teacherConfirmPassword" 
                      className={cn('auth-form-input', !passwordMatch && 'border-red-500')} 
                      type="password" 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full auth-action" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Teacher Account"}
                </Button>
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
  );
}

export default SignUpComponent;