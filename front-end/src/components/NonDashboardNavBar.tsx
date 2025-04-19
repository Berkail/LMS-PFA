
import {Bell, BookOpen} from "lucide-react"
import Link from 'next/link'
import React from 'react'
import { Button } from "./ui/button"
import Image from "next/image"

const NonDashboardNavBar = () => {
  return (
    <nav className="nondashboard-navbar">
        <div className="nondashboard-navbar__container">
           <div className="nondashboard-navbar__search">
            <div className='nondashboard-navbar__logo-wrapper'>
            <Image src='/logo.svg' alt='logo' width={25} height={20} className="app-sidebar__logo"/>                        
            <Link href="/" className="nondashboard-navbar__brand">
                EHEI-LMS
            </Link>
            </div>
           </div>
        </div>
        <div className="nondashboard-navbar__actions">

                <Link href="/signin" className="nondashboard-navbar__auth-button--login">Login</Link>
                <Link href="/signup" className="nondashboard-navbar__auth-button--signup">Signup</Link>
            
        </div>
    </nav>
  )
}

export default NonDashboardNavBar