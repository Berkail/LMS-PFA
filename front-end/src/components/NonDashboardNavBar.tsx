
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
            <div className='flex item-center gap-4'>
                <div className='relative group'>
                    <Link href="/search" className="nondashboard-navbar__search-input">
                           <span className="hidden sm:inline">Search Cources</span>
                           <span className="hidden sm:inline">Search</span>
                    </Link>
                    <BookOpen className="nondashboard-navbar__search-icon" size={18}/>
                </div>
            </div>
           </div>
        </div>
        <div className="nondashboard-navbar__actions">
            <button className="nondashboard-navbar__notification-button">
                <span className="nondashboard-navbar__notification-indicator"></span>
                <Bell className="nondashboard-navbar__notification-icon"></Bell>
            </button>

                <Link href="/signin" className="nondashboard-navbar__auth-button--login">Login</Link>
                <Link href="/signup" className="nondashboard-navbar__auth-button--signup">Signup</Link>
            
        </div>
    </nav>
  )
}

export default NonDashboardNavBar