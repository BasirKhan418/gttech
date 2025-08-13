"use client"
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NextTopLoader from 'nextjs-toploader';
import { AdminSidebar } from "../../utils/admin/sidebar/admin-sidebar";
import { AdminHeader } from "../../utils/admin/sidebar/admin-header";
import { cn } from "@/lib/utils";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <html lang="en" className="relative" suppressHydrationWarning>
      <body className={dmSans.className}>
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        
        {isAdminRoute ? (
          <div className={cn("min-h-screen bg-gray-50", darkMode && "dark bg-gray-900")}>
            {/* Mobile overlay */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}
            
            {/* Admin Header */}
            <AdminHeader
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            
            <div className="flex">
              {/* Admin Sidebar */}
              <AdminSidebar
                sidebarCollapsed={sidebarCollapsed}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />
              
              {/* Main Content for Admin */}
              <main className={cn("flex-1 transition-all duration-300", "lg:ml-64", sidebarCollapsed && "lg:ml-16")}>
                {children}
              </main>
            </div>
          </div>
        ) : (
          // Regular layout for non-admin routes
          children
        )}
      </body>
    </html>
  );
}