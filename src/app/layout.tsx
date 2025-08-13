"use client"
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
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
  const [darkMode, setDarkMode] = useState(true);

  return (
    <html lang="en" className="relative" suppressHydrationWarning>
      <body className={dmSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
          themes={['light', 'dark', 'system']}
        >
          <NextTopLoader
            color="#0ea5e9"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #0ea5e9,0 0 5px #0ea5e9"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
                      <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
          
          {isAdminRoute ? (
            <div className={cn("min-h-screen h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-950 to-black dark:from-gray-950 dark:via-slate-950 dark:to-black")}>
            
            {/* Admin Sidebar - Fixed positioned */}
            <AdminSidebar
              sidebarCollapsed={sidebarCollapsed}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
            
            {/* Admin Header - Fixed positioned with proper left margin */}
            <div className={cn(
              "fixed top-0 right-0 z-30 transition-all duration-300",
              sidebarCollapsed ? "lg:left-20" : "lg:left-72",
              "left-0" // Full width on mobile
            )}>
              <AdminHeader
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            </div>
            
            {/* Main Content Area */}
            <main className={cn(
              "h-screen overflow-y-auto transition-all duration-300 pt-16", // Add top padding for fixed header and full height with scroll
              sidebarCollapsed ? "lg:ml-20" : "lg:ml-72", // Left margin for sidebar
              "ml-0" // No margin on mobile
            )}>
              {/* Content Background with Glass Effect */}
              <div className="relative h-full">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full animate-float ${
                        i % 2 === 0 ? 'bg-sky-400/20' : 'bg-white/10'
                      }`}
                      style={{
                        left: `${10 + (i * 12)}%`,
                        top: `${20 + (i * 10)}%`,
                        animationDelay: `${i * 0.6}s`,
                        animationDuration: `${4 + (i % 3)}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Glass Content Container */}
                <div className="relative z-10 p-4 lg:p-6 h-full">
                  <div className="glass-content backdrop-blur-sm bg-white/5 rounded-2xl border border-sky-500/10 h-full overflow-hidden">
                    {/* Content area background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-sky-500/5 opacity-50"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent opacity-30"></div>
                    
                    {/* Actual content */}
                    <div className="relative z-10 p-6 h-full overflow-y-auto">
                      {children}
                    </div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-sky-400/20 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    
                    {/* Corner highlights */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-sky-400/20 rounded-tl-xl"></div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-sky-400/20 rounded-br-xl"></div>
                  </div>
                </div>
              </div>
            </main>

            <style jsx>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              
              .animate-float {
                animation: float 3s ease-in-out infinite;
              }

              .glass-content {
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                box-shadow: 
                  0 8px 32px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  0 0 0 1px rgba(14, 165, 233, 0.1);
              }
            `}</style>
          </div>
        ) : (
          // Regular layout for non-admin routes
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange={false}
            themes={['light', 'dark', 'system']}
          >
            {children}
          </ThemeProvider>
        )}
        </ThemeProvider>
      </body>
    </html>
  );
}