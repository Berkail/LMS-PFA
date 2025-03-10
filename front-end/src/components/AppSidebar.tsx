import { usePathname } from 'next/navigation';
import Link from 'next/link'; // FIXED: Correct Link import
import React from 'react';
import { 
    Sidebar,
  SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar 
} from '@/components/ui/sidebar';
import { BookOpen, ChartColumn, ClipboardPenLine, PanelLeft, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();

    const navLinks = {
        students: [
            { icon: BookOpen, label: "Courses", href: '/student/courses' },
            { icon: ClipboardPenLine, label: "Assignments", href: '/student/assignments' },
            { icon: User, label: "Profile", href: '/student/profile' },
            { icon: ChartColumn, label: "Progress", href: '/student/progress' },
        ],
        teacher: [
            { icon: BookOpen, label: "Courses", href: '/teacher/courses' },
            { icon: ClipboardPenLine, label: "Assignments", href: '/teacher/assignments' },
            { icon: ChartColumn, label: "Profile", href: '/teacher/progress' },
            { icon: Settings, label: "Settings", href: '/teacher/settings' },
        ]
    };

    const currentNavLinks = navLinks['students'];

    return (
      <Sidebar
        collapsible="icon" // FIXED: Changed to boolean
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
                        <Image src='/logo.svg' alt='logo' width={25} height={20} className="app-sidebar__logo"/>
                        <p className='app-sidebar__title'>Ehei LMS</p>
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
                const isActive = pathname && pathname.startsWith(link.href); // FIXED: Ensure pathname exists
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
      </Sidebar>
    );
};

export default AppSidebar;
