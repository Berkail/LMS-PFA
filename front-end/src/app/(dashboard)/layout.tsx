"use client";

import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChaptersSidebar from "./student/courses/[courseId]/ChaptersSidebar";
import StoreProvider from "@/state/redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";


  export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [courseId, setCourseId] = useState<string | null>(null);
    const isCoursePage = /^\/student\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(pathname);
    const [isLoading, setIsLoading] = useState(true);
    const userType = pathname.startsWith('/teacher') ? 'teacher' : 'student';

    // First useEffect for auth check
    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (pathname.startsWith('/teacher')) {
            const response = await fetch('http://localhost/api/instructors/me', {
              credentials: 'include'
            });
            
            if (!response.ok) {
              window.location.href = '/signin';
              return;
            }
  
            if (pathname === '/teacher') {
              window.location.href = '/teacher/courses';
            }
          }
          else if (pathname.startsWith('/student')) {
            const response = await fetch('http://localhost/api/learners/me', {
              credentials: 'include'
            });
            
            if (!response.ok) {
              window.location.href = '/signin';
              return;
            }
  
            if (pathname === '/student') {
              window.location.href = '/student/search';
            }
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Auth check failed:', error);
          window.location.href = '/signin';
        }
      };
  
      checkAuth();
    }, [pathname]);
  
    // Second useEffect for course ID
    useEffect(() => {
      if (isCoursePage) {
        const match = pathname.match(/\/student\/courses\/([^\/]+)/);
        setCourseId(match ? match[1] : null);
      } else {
        setCourseId(null);
      }
    }, [isCoursePage, pathname]);
  
    if (isLoading) {
      return <Loading />;
    }
  
    return (
      <StoreProvider>
        <SidebarProvider>
          <div className="dashboard">
            <AppSidebar />
            <div className="dashboard__content">
              {courseId && <ChaptersSidebar />}
              <div 
                className={cn("dashboard__main",
                  isCoursePage && "dashboard__main--not-course"
                )} 
                style={{height: "100vh"}}
              >
                <Navbar isCoursePage={isCoursePage} userType={userType} />
                <main className="dashboard__body">{children}</main>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </StoreProvider>
    );
  }