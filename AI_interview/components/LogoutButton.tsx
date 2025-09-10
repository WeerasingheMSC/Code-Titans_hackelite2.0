"use client";

import { signOut } from "@/lib/actions/auth.action";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Button 
      onClick={handleLogout}
      className="w-fit !bg-destructive-100 !text-white hover:!bg-destructive-200 hover:scale-105 !rounded-full !font-bold px-5 cursor-pointer min-h-10 transition-all duration-300 shadow-lg flex items-center gap-2"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L2 8L6 4M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;