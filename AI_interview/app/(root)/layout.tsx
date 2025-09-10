import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import LogoutButton from "@/components/LogoutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="animate-slideUp flex justify-between items-center p-4 bg-dark-200/50 rounded-2xl border border-primary-200/20 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div className="p-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl shadow-lg">
            <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10L16 6L24 10L16 14L8 10Z" fill="#020408" fillOpacity="0.8"/>
              <path d="M8 14L16 10L24 14L16 18L8 14Z" fill="#020408" fillOpacity="0.6"/>
              <path d="M8 18L16 14L24 18L16 22L8 18Z" fill="#020408" fillOpacity="0.8"/>
              <circle cx="16" cy="14" r="2" fill="#020408"/>
            </svg>
          </div>
          <h2 className="text-primary-100 font-bold">SkillSync</h2>
        </Link>

        {/* Navigation Menu */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 7L9 2L16 7V15C16 15.5523 15.5523 16 15 16H11V12H7V16H3C2.44772 16 2 15.5523 2 15V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              href="/interview" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L11.09 5.26L17 6L13 9.74L13.82 15.74L9 13.77L4.18 15.74L5 9.74L1 6L6.91 5.26L9 1Z" fill="currentColor"/>
              </svg>
              <span className="font-medium">Interview</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="mobile-menu-btn p-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </nav>

      <div className="animate-fadeIn">
        {children}
      </div>
    </div>
  );
};

export default Layout;