"use client";

import AppSidebar from "@/components/AppSidebar";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";



export default function DashboardLayout({ chidren }: { chidren: React.ReactNode }) {
    const pathname = useParams();


  return (
    <SidebarProvider>
    <div className="dashboard">
        <AppSidebar />
        <div className="dashboard__content">
            <div className={cn("dashboard__main")} style={{height: "100vh"}}>

                <main className="dashboard__body">{chidren}</main>
            </div>
        </div>
    </div>
    </SidebarProvider>
  );
}