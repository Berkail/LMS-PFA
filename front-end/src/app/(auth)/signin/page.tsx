"use client";

import SignInComponent from '@/components/SignInComponent'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useParams, useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  return (
    <div>
      <div className="absolute top-6 left-20">
        <Link href="/">
          <Image 
            src="/logo.svg" 
            alt="Ehei LMS Logo" 
            width={80} 
            height={60}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignInComponent/>
        </div>
      </div>
    </div>
  )
}