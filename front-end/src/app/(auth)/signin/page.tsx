import SignInComponent from '@/components/SignInComponent'
import Image from 'next/image'
import React from 'react'


export default function page() {
  return (
    <div>
    {/*<Link href="/">
          <Image 
            src="/EHEI_LMS.png" 
            alt="Ehei LMS Logo" 
            width={150} 
            height={60}
            className="cursor-pointer"
          />
        </Link>*/}
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
      <SignInComponent/>
      </div>
    </div>
    </div>
  )
}