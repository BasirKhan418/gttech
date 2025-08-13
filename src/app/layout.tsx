"use client"
import { DM_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import NextTopLoader from 'nextjs-toploader';
import AdminLayout from "@/components/admin/AdminLayout";
import Chatbot from "@/components/Chatbot";
import "./globals.css";
import RedesignedPreloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const isLoginRoute = pathname === '/login';

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
          <RedesignedPreloader/>
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
            <AdminLayout>{children}</AdminLayout>
          ) : (
            <>
              <Navbar/> 
              {children}
              <Footer/>
            </>
          )}

          {!isAdminRoute && !isLoginRoute && <Chatbot />}
        </ThemeProvider>
      </body>
    </html>
  );
}