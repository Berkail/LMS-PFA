import { usePathname } from 'next/navigation';
import Link from 'next/link'; // FIXED: Correct Link import
import React from 'react';
import { 
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter, // ADD: Import SidebarFooter
    useSidebar 
} from '@/components/ui/sidebar';
import { BookOpen, ChartColumn, ClipboardPenLine, LibraryBig, PanelLeft, Search, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { NavUser } from './NavUser'; // Import NavUser component
import { useEffect, useState } from 'react';


interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const AppSidebar = () => {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();
    const [user, setUser] = useState<User | null>(null);

    const userType = pathname?.startsWith('/teacher') ? 'teacher' : 'student';

    useEffect(() => {
      const fetchUser = async () => {
          try {
              const response = await fetch('http://localhost/api/learners/me', {
                  credentials: 'include'
              });
              if (!response.ok) throw new Error('Failed to fetch user');
              const data = await response.json();
              setUser(data);
          } catch (error) {
              console.error('Error fetching user:', error);
          }
      };

      fetchUser();
  }, []);


  const formatName = (firstName: string, lastName: string) => {
    return `${lastName[0]}. ${firstName}`;
};
    const navLinks = {
        student: [
          { icon: Search, label: "Search", href: '/student/search' },
            { icon: BookOpen, label: "Courses", href: '/student/courses' },
            { icon: ClipboardPenLine, label: "Assignments", href: '/student/assignments' },
            { icon: ChartColumn, label: "Progress", href: '/student/progress' },
        ],
        teacher: [
            { icon: BookOpen, label: "Courses", href: '/teacher/courses' },
            { icon: ClipboardPenLine, label: "Assignments", href: '/teacher/assignments' },
        ]
    };

    const userLinks = {
      student: {
          profile: '/student/profile',
          notifications: '/student/notification-settings',
      },
      teacher: {
          profile: '/teacher/profile',
          notifications: '/teacher/notification-settings',
      }
  };

    const currentNavLinks = navLinks[userType];

    return (
      <Sidebar
        collapsible="icon"
        style={{ height: '100vh' }}
        className="bg-customgreys-primarybg border-none shadow-lg"
      >
        <SidebarHeader>
          <SidebarMenu className='app-sidebar__menu'>
            <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  onClick={() => toggleSidebar()}
                  className="group hover:bg-customgreys-secondarybg"
                >
                  <div className='app-sidebar__logo-container group'>
                    <div className='app-sidebar__logo-wrapper'>
                <Image 
                  src='/logo.svg' 
                  alt='logo' 
                  width={70} 
                  height={50} 
                  priority
                  style={{
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
                    </div>
                    <PanelLeft className='app-sidebar__collapse-icon' />
                  </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className='app-sidebar__nav-menu'>
            {currentNavLinks.map((link) => {
                const isActive = pathname && pathname.startsWith(link.href);
                return (
                  <SidebarMenuItem 
                    key={link.href}
                    className={cn("app-sidebar__nav-item", isActive && "bg-gray-800")}
                  >
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      className={cn("app-sidebar__nav-button", !isActive && "text-customgreys-dirtyGrey")}
                    >
                      <Link href={link.href} className='app-sidebar__nav-link'>
                        <link.icon className={isActive ? "text-white-50" : "text-gray-500"} />
                        <span className={cn("app-sidebar__nav-text", isActive ? "text-white-50" : "text-gray-500")}>
                          {link.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    {isActive && <div className='app-sidebar__active-indicator'></div>}
                  </SidebarMenuItem>
                );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Add NavUser in SidebarFooter */}
        <SidebarFooter>
          <NavUser
            user={{
              name: user ? formatName(user.firstName, user.lastName) : 'Loading...',
              email: user?.email || 'Loading...',
              avatar: '/profile-pic.png',
          }}
            userLinks={userLinks[userType]}
          />
        </SidebarFooter>
      </Sidebar>
    );
};

export default AppSidebar;