
import {Bell, BookOpen} from "lucide-react"
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from "./ui/button"
import Image from "next/image"
import { SidebarTrigger } from "./ui/sidebar"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"



const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
    const pathname = usePathname()
    const isSearchPage = pathname === '/student/search'
  return (
    <nav className="dashboard-navbar">
        <div className="dashboard-navbar__container">
           <div className="dashboard-navbar__search">
            <div className='md:hidden'>
                <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
            </div>
            {!isSearchPage && (
              <div className='flex item-center gap-4'>
                  <div className='relative group'>
                      <Link href="/student/search" className={cn("dashboard-navbar__search-input", {
                          "!bg-customgreys-secondarybg": isCoursePage})}>
                             <span className="hidden sm:inline">Search Courses</span>
                             <span className="sm:hidden">Search</span>
                      </Link>
                      <BookOpen className="dashboard-navbar__search-icon" size={18}/>
                  </div>
              </div>
            )}
           </div>
        </div>
        {!isSearchPage && (
        <div className="dashboard-navbar__actions">
            <button className="nondashboard-navbar__notification-button">
                <span className="nondashboard-navbar__notification-indicator"></span>
                <Bell className="nondashboard-navbar__notification-icon"></Bell>
            </button>
        </div>
        )}
    </nav>
  )
}

export default Navbar