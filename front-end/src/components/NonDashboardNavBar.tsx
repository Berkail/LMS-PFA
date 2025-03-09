import Link from 'next/link'
import React from 'react'

const NonDashboardNavBar = () => {
  return (
    <nav className="nondashboard-navbar">
        <div className="nondashboard-navbar__container">
            <Link href="/" className="nondashboard-navbar__brand">
                EHEI-LMS
            </Link>
            <div className='flex item-center gap-4'>
                <div className='relative group'>
                    
                </div>
            </div>
        </div>
    </nav>
  )
}

export default NonDashboardNavBar