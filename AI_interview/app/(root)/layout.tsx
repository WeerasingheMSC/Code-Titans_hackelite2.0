import Link from "next/link";
import Image from "next/image";
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
          <div className="flex items-center justify-center w-12 h-12 bg-black rounded-full shadow-lg p-1">
            <Image 
              src="/logo.png" 
              alt="SkillSync Logo" 
              width={45} 
              height={45}
              className="object-contain rounded-full"
            />
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
            
            <Link 
              href="/roadmap" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3H16C16.5523 3 17 3.44772 17 4V14C17 14.5523 16.5523 15 16 15H2C1.44772 15 1 14.5523 1 14V4C1 3.44772 1.44772 3 2 3Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 7H17M5 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-medium">Roadmap</span>
            </Link>
            
            <Link 
              href="/career-ready" 
              className="flex items-center gap-2 px-4 py-2 text-light-100 hover:text-primary-100 hover:bg-dark-300/50 rounded-xl transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L11 7H17L12 11L14 17L9 13L4 17L6 11L1 7H7L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-medium">Assessment</span>
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