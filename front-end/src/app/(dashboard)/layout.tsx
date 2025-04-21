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



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    const pathname = usePathname();
    const [courseId, setCourseId] = useState<string | null>(null);
    const isCoursePage = /^\/student\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
      pathname
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('http://localhost/api/learners/me', {
            credentials: 'include'
          });
  
          if (response.status === 403) {
            router.push('/signin');
            return;
          }
  
          setIsLoading(false);
        } catch (error) {
          console.error('Auth check failed:', error);
          router.push('/signin');
        }
      };
  
      checkAuth();
    }, [router]);

    useEffect(() => {
      if (isCoursePage) {
        const match = pathname.match(/\/student\/courses\/([^\/]+)/);
        setCourseId(match ? match[1] : null);
      } else {
        setCourseId(null);
      }
    }, [isCoursePage, pathname]);

  return (
    <StoreProvider>
    <SidebarProvider>
    <div className="dashboard">
        <AppSidebar />
        <div className="dashboard__content">
          {courseId && <ChaptersSidebar />}
            <div className={cn("dashboard__main",
              isCoursePage && "dashboard__main--not-course"
            )} style={{height: "100vh"}}>
                <Navbar isCoursePage={isCoursePage} />
                <main className="dashboard__body">{children}</main>
            </div>
        </div>
    </div>
    </SidebarProvider>
    </StoreProvider>
  );
}